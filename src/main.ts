import './scss/styles.scss';

import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { CardCatalog } from './components/cards/CardCatalog';
import { CardPreview } from './components/cards/CardPreview';
import { BasketView } from './components/basket/BasketView';
import { BasketItemView } from './components/basket/BasketItemView';
import { OrderFormStep1 } from './components/forms/OrderFormStep1';
import { OrderFormStep2 } from './components/forms/OrderFormStep2';
import { SuccessView } from './components/success/SuccessView';

import { Modal } from './components/base/Modal';
import { events } from './components/base/Events';

import { Api } from './components/base/Api';
import { LarekApi } from './components/Api/LarekApi';
import { API_URL } from './utils/constants';
import { IProduct, IOrder, IOrderResult } from './types';
import { Page } from './components/page/Page';

// -------- МОДЕЛИ --------

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();

// -------- DOM-ШАБЛОНЫ --------

const catalogTemplate =
	document.querySelector<HTMLTemplateElement>('#card-catalog');
const previewTemplate =
	document.querySelector<HTMLTemplateElement>('#card-preview');
const basketTemplate =
	document.querySelector<HTMLTemplateElement>('#basket');
const orderTemplate =
	document.querySelector<HTMLTemplateElement>('#order');
const contactsTemplate =
	document.querySelector<HTMLTemplateElement>('#contacts');
const successTemplate =
	document.querySelector<HTMLTemplateElement>('#success');

const modal = new Modal();

// -------- VIEW-СЛОЙ --------

const basketView = basketTemplate
	? new BasketView(
			basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement
	  )
	: null;

const page = new Page();

// превью товара — один экземпляр
const previewCard = previewTemplate
	? new CardPreview(
			previewTemplate.content.firstElementChild!.cloneNode(
				true
			) as HTMLElement
	  )
	: null;

// форма с доставкой
const deliveryForm = orderTemplate
	? new OrderFormStep1(
			orderTemplate.content.firstElementChild!.cloneNode(
				true
			) as HTMLElement
	  )
	: null;

// форма с контактами
const contactsForm = contactsTemplate
	? new OrderFormStep2(
			contactsTemplate.content.firstElementChild!.cloneNode(
				true
			) as HTMLElement
	  )
	: null;

// окно «успех»
const successView = successTemplate
	? new SuccessView(
			successTemplate.content.firstElementChild!.cloneNode(
				true
			) as HTMLElement
	  )
	: null;

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
	if (!basketView) return;
	const content = basketView.render();
	modal.open(content);
}

// -------- ПРЕЗЕНТЕР: КАТАЛОГ --------

events.on<{ items: IProduct[] }>('products:changed', ({ items }) => {
	if (!catalogTemplate) return;

	const cards = items.map((product) => {
		const el = catalogTemplate.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;
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
	if (!product || !previewCard) return;

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

	// 🔒 защита: товар без цены/«бесценно» нельзя добавлять в корзину
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
	page.setBasketCounter(items.length);

	if (previewCard) {
		previewCard.updateButton(items);
	}

	if (basketView) {
		const itemNodes = items.map((item, index) => {
			const view = new BasketItemView();
			return view.render(item, index);
		});
		const total = basketModel.getTotal();
		basketView.setItems(itemNodes);
		basketView.setTotal(total);
	}
});

events.on('basket:open', () => {
	openBasket();
});

events.on('basket:submit', () => {
	if (!deliveryForm) return;

	const content = deliveryForm.render();
	modal.open(content);
});

// -------- ПРЕЗЕНТЕР: ФОРМЫ --------

events.on<{ payment: 'card' | 'cash' }>('order:change-payment', ({ payment }) => {
	buyerModel.setData({ payment });
});

events.on<{ address: string }>('order:change-address', ({ address }) => {
	buyerModel.setData({ address });
});

events.on('order:submit-step1', () => {
	if (!contactsForm) return;

	const content = contactsForm.render();
	modal.open(content);
});

events.on<{ email: string }>('order:change-email', ({ email }) => {
	buyerModel.setData({ email });
});

events.on<{ phone: string }>('order:change-phone', ({ phone }) => {
	buyerModel.setData({ phone });
});

events.on('order:submit-step2', () => {
	if (!successView) return;

	const items = basketModel.getItems();
	const total = basketModel.getTotal();
	const buyerData = buyerModel.getData();

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
			console.log('SERVER ORDER RESPONSE:', orderResult);

			// пробуем взять сумму из ответа сервера, иначе — локальную
			const serverTotal =
				typeof orderResult.total === 'number'
					? orderResult.total
					: total;

			const content = successView.render(serverTotal);

			modal.open(content);

			basketModel.clear();
			buyerModel.clear();
		})
		.catch((error) => {
			console.error('Ошибка при оформлении заказа:', error);
			alert('Не удалось оформить заказ, попробуйте ещё раз позже');
		});
});
