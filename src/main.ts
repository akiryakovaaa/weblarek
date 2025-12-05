import './scss/styles.scss';

import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { CardCatalog } from './components/cards/CardCatalog';
import { CardPreview } from './components/cards/CardPreview';
import { BasketView } from './components/basket/BasketView';
import { BasketItemView } from './components/basket/BasketItemView';
import { FormAdressDelivery } from './components/forms/FormAdressDelivery';
import { FormContact } from './components/forms/FormContact';
import { SuccessView } from './components/success/SuccessView';

import { Modal } from './components/base/Modal';
import { events } from './components/base/Events';

import { Api } from './components/base/Api';
import { LarekApi } from './components/Api/LarekApi';
import { API_URL } from './utils/constants';
import { IProduct, IOrder, IOrderResult } from './types';
import { Page } from './components/page/Page';
import { cloneTemplate } from './utils/utils';

// -------- МОДЕЛИ --------

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();

// -------- VIEW-СЛОЙ --------

const basketView = new BasketView(
	cloneTemplate<HTMLElement>('#basket')
);

// страница: витрина + иконка корзины + счётчик
const page = new Page();

// превью товара — один экземпляр
const previewCard = new CardPreview(
	cloneTemplate<HTMLElement>('#card-preview')
);

// форма: адрес и способ доставки
const deliveryForm = new FormAdressDelivery(
	cloneTemplate<HTMLElement>('#order')
);

// форма: контакты покупателя
const contactsForm = new FormContact(
	cloneTemplate<HTMLElement>('#contacts')
);

// окно «успех»
const successView = new SuccessView(
	cloneTemplate<HTMLElement>('#success')
);

// -------- API --------

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

larekApi
	.getProducts()
	.then((items) => {
		productsModel.setItems(items);
	})
	.catch((error) => {
		console.error('Ошибка при загрузке каталога:', error);
	});

// -------- ВСПОМОГАТЕЛЬНОЕ --------

function openBasket() {
	const content = basketView.render();
	modal.open(content);
}

const modal = new Modal();

// -------- ПРЕЗЕНТЕР: КАТАЛОГ --------

events.on<{ items: IProduct[] }>('products:changed', ({ items }) => {
	const cards = items.map((product) => {
		const el = cloneTemplate<HTMLElement>('#card-catalog');
		const card = new CardCatalog(el);
		return card.render(product);
	});

	page.setCatalog(cards);
});

events.on<{ id: string }>('product:select', ({ id }) => {
	const product = productsModel.getItemById(id);
	if (product) {
		productsModel.setSelected(product);
	}
});

// открытие превью товара
events.on<{ product: IProduct | null }>('products:selected', ({ product }) => {
	if (!product) return;

	const content = previewCard.render(product);

	// при каждом открытии сразу проверяем, есть ли товар в корзине
	const itemsInBasket = basketModel.getItems();
	previewCard.updateButton(itemsInBasket);

	modal.open(content);
});

// только превью занимается покупкой / удалением
events.on<{ id: string }>('product:toggle-from-preview', ({ id }) => {
	const product = productsModel.getItemById(id);
	if (!product) return;

	// защита: товар без цены/«бесценно» нельзя добавлять в корзину
	if (product.price === null) {
		console.warn(
			'Попытка добавить в корзину товар без цены — операция запрещена'
		);
		return;
	}

	if (basketModel.hasItem(id)) {
		basketModel.removeItem(product);
	} else {
		basketModel.addItem(product);
	}
});

// -------- ПРЕЗЕНТЕР: КОРЗИНА --------

events.on<{ id: string }>('basket:item-remove', ({ id }) => {
	const product = basketModel.getItems().find((item) => item.id === id);
	if (product) {
		basketModel.removeItem(product);
	}
});

events.on<{ items: IProduct[] }>('basket:changed', ({ items }) => {
	// счётчик в шапке
	page.setBasketCounter(items.length);

	// кнопка в превью
	previewCard.updateButton(items);

	// список и сумма в окне корзины
	const itemNodes = items.map((item, index) => {
		const view = new BasketItemView();
		return view.render(item, index);
	});
	const total = basketModel.getTotal();
	basketView.setItems(itemNodes);
	basketView.setTotal(total);
});

// «открыть корзину» приходит от Page
events.on('basket:open', () => {
	openBasket();
});

// нажали «Оформить» в корзине
events.on('basket:submit', () => {
	const content = deliveryForm.render();
	modal.open(content);
});

// -------- ПРЕЗЕНТЕР: ФОРМЫ --------

// изменения данных покупателя → кладём в модель
events.on<{ payment: 'card' | 'cash' }>('order:change-payment', ({ payment }) => {
	buyerModel.setData({ payment });
});

events.on<{ address: string }>('order:change-address', ({ address }) => {
	buyerModel.setData({ address });
});

events.on<{ email: string }>('order:change-email', ({ email }) => {
	buyerModel.setData({ email });
});

events.on<{ phone: string }>('order:change-phone', ({ phone }) => {
	buyerModel.setData({ phone });
});

// модель покупателя изменилась → валидируем и обновляем формы
events.on('buyer:changed', () => {
	const data = buyerModel.getData();
	const errors = buyerModel.validate();

	// ----- обновляем форму доставки -----
	deliveryForm.updateFields(data);

	deliveryForm.setValidationState({
		canSubmit: !errors.payment && !errors.address,
		errorMessage: errors.payment || errors.address || '',
	});

	// ----- обновляем форму контактов -----
	contactsForm.updateFields(data);

	contactsForm.setValidationState({
		canSubmit: !errors.email && !errors.phone,
		errorMessage: errors.email || errors.phone || '',
	});
});

// первый шаг формы успешно пройден → открываем шаг 2
events.on('order:submit-step1', () => {
	const content = contactsForm.render();
	modal.open(content);
});

// второй шаг формы успешно пройден → отправляем заказ
events.on('order:submit-step2', () => {
	const items = basketModel.getItems();
	const total = basketModel.getTotal();
	const buyerData = buyerModel.getData();

	// простая проверка на заполненность перед отправкой
	if (
		!buyerData.payment ||
		!buyerData.address.trim() ||
		!buyerData.email.trim() ||
		!buyerData.phone.trim()
	) {
		console.error('Заполнены не все данные покупателя', buyerData);
		return;
	}

	const order: IOrder = {
		items: items.map((item) => item.id),
		total,
		payment: buyerData.payment,
		address: buyerData.address,
		email: buyerData.email,
		phone: buyerData.phone,
	};

	larekApi
		.createOrder(order)
		.then((orderResult: IOrderResult) => {

			// пробуем взять сумму из ответа сервера, иначе — локальную
			const serverTotal =
				typeof orderResult.total === 'number'
					? orderResult.total
					: total;

			const content = successView.render(serverTotal);

			modal.open(content);

			// очищаем корзину и данные покупателя
			basketModel.clear();
			buyerModel.clear();
		})
		.catch((error) => {
			console.error('Ошибка при оформлении заказа:', error);
			alert('Не удалось оформить заказ, попробуйте ещё раз позже');
		});
});

// кнопка «За новыми покупками!» в окне успеха
events.on('success:close', () => {
	modal.close();
});
