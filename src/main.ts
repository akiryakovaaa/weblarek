import './scss/styles.scss';

import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { CardCatalog } from './components/cards/CardCatalog';
import { CardPreview } from './components/cards/CardPreview';
import { BasketView } from './components/basket/BasketView';
import { OrderFormStep1 } from './components/forms/OrderFormStep1';
import { OrderFormStep2 } from './components/forms/OrderFormStep2';
import { SuccessView } from './components/success/SuccessView';

import { Modal } from './components/base/Modal';
import { events } from './components/base/Events';

import { Api } from './components/base/Api';
import { LarekApi } from './components/Api/LarekApi';
import { API_URL } from './utils/constants';
import { IProduct, IOrder } from './types';

// =======================
//   МОДЕЛИ
// =======================

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();

// =======================
//   DOM и VIEW
// =======================

const gallery = document.querySelector<HTMLElement>('.gallery');
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

const basketButton =
	document.querySelector<HTMLButtonElement>('.header__basket');
const basketCounter =
	document.querySelector<HTMLElement>('.header__basket-counter');

const modal = new Modal();

// создаём view корзины из шаблона
const basketView = basketTemplate
	? new BasketView(
			basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement
	  )
	: null;

// =======================
//   API и загрузка каталога
// =======================

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

// =======================
//   ВСПОМОГАТЕЛЬНОЕ: открыть корзину
// =======================

function openBasket() {
	if (!basketView) return;

	const itemsNodes = basketModel.getItems().map((item, index) => {
		const li = document.createElement('li');
		li.classList.add('basket__item', 'card', 'card_compact');

		const indexSpan = document.createElement('span');
		indexSpan.classList.add('basket__item-index');
		indexSpan.textContent = String(index + 1);

		const titleSpan = document.createElement('span');
		titleSpan.classList.add('card__title');
		titleSpan.textContent = item.title;

		const priceSpan = document.createElement('span');
		priceSpan.classList.add('card__price');
		priceSpan.textContent =
			item.price === null ? 'Бесценно' : `${item.price} синапсов`;

		const deleteBtn = document.createElement('button');
		deleteBtn.classList.add('basket__item-delete');
		deleteBtn.type = 'button';
		deleteBtn.setAttribute('aria-label', 'Удалить из корзины');
		deleteBtn.addEventListener('click', () => {
			basketModel.removeItem(item);
			// перерисуем корзину после удаления
			openBasket();
		});

		li.append(indexSpan, titleSpan, priceSpan, deleteBtn);
		return li;
	});

	const total = basketModel.getTotal();
	const content = basketView.render(itemsNodes, total);

	modal.open(content);
}

// =======================
//   ПРЕЗЕНТЕР (СОБЫТИЯ)
// =======================

// 1. Каталог обновился → рендерим карточки
events.on<{ items: IProduct[] }>('products:changed', ({ items }) => {
	if (!gallery || !catalogTemplate) return;

	const cards = items.map((product) => {
		const el = catalogTemplate.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;
		const card = new CardCatalog(el);
		return card.render(product);
	});

	gallery.replaceChildren(...cards);
});

// 2. Нажали на карточку → выбираем товар
events.on<{ id: string }>('product:select', ({ id }) => {
	const product = productsModel.getItemById(id);
	if (product) {
		productsModel.setSelected(product);
	}
});

// 3. В модели выбран новый товар → открываем модалку превью
events.on<{ product: IProduct | null }>('products:selected', ({ product }) => {
	if (!product || !previewTemplate) return;

	const element = previewTemplate.content.firstElementChild!.cloneNode(
		true
	) as HTMLElement;
	const previewCard = new CardPreview(element);

	const content = previewCard.render(product);
	modal.open(content);
});

// 4. Нажали "Купить" на карточке каталога → добавляем в корзину
events.on<{ id: string }>('product:add-to-basket', ({ id }) => {
	const product = productsModel.getItemById(id);
	if (!product) return;

	basketModel.addItem(product);
});

// 5. Нажали "Купить / Удалить" в модалке превью
events.on<{ id: string }>('product:toggle-from-preview', ({ id }) => {
	const product = productsModel.getItemById(id);
	if (!product) return;

	if (basketModel.hasItem(id)) {
		basketModel.removeItem(product);
	} else {
		basketModel.addItem(product);
	}
});

// 6. Любое изменение корзины → обновляем счётчик
events.on<{ items: IProduct[] }>('basket:changed', ({ items }) => {
	if (basketCounter) {
		basketCounter.textContent = String(items.length);
	}
});

// 7. Клик по иконке корзины → открыть корзину
basketButton?.addEventListener('click', () => {
	openBasket();
});

// 8. Нажали «Оформить» в корзине → открыть шаг 1 (способ оплаты + адрес)
events.on('basket:submit', () => {
	if (!orderTemplate) return;

	const element = orderTemplate.content.firstElementChild!.cloneNode(
		true
	) as HTMLElement;

	const orderFormStep1 = new OrderFormStep1(element);
	const content = orderFormStep1.render();

	modal.open(content);
});

// 9. Изменение способа оплаты
events.on<{ payment: 'card' | 'cash' }>('order:change-payment', ({ payment }) => {
	buyerModel.setData({ payment });
});

// 10. Изменение адреса
events.on<{ address: string }>('order:change-address', ({ address }) => {
	buyerModel.setData({ address });
});

// 11. Первый шаг формы успешно пройден → открыть шаг 2 (Email + телефон)
events.on('order:submit-step1', () => {
	if (!contactsTemplate) return;

	const element = contactsTemplate.content.firstElementChild!.cloneNode(
		true
	) as HTMLElement;

	const orderFormStep2 = new OrderFormStep2(element);
	const content = orderFormStep2.render();

	modal.open(content);
});

// 12. Изменение email
events.on<{ email: string }>('order:change-email', ({ email }) => {
	buyerModel.setData({ email });
});

// 13. Изменение телефона
events.on<{ phone: string }>('order:change-phone', ({ phone }) => {
	buyerModel.setData({ phone });
});

// 14. Второй шаг формы успешно пройден → отправляем заказ на сервер
events.on('order:submit-step2', () => {
	if (!successTemplate) return;

	// товары и сумма заказа
	const items = basketModel.getItems();
	const total = basketModel.getTotal();

	// аккуратно берём данные покупателя из модели
	const buyerData = buyerModel.getData();

	// type guard — проверяем, что все поля заполнены
	if (
		!buyerData.payment ||                // null не пройдёт
		!buyerData.address.trim() ||
		!buyerData.email.trim() ||
		!buyerData.phone.trim()
	) {
		console.error('Заполнены не все данные покупателя', buyerData);
		return;
	}

	// здесь TypeScript уже понимает, что:
	// payment: TPayment, address/email/phone: string
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
		.then(() => {
			const element = successTemplate.content.firstElementChild!.cloneNode(
				true
			) as HTMLElement;

			const successView = new SuccessView(element);
			const content = successView.render(total);

			// очищаем корзину и покупателя
			basketModel.clear();
			buyerModel.clear();

			modal.open(content);
		})
		.catch((error) => {
			console.error('Ошибка при оформлении заказа:', error);
			alert('Не удалось оформить заказ, попробуйте ещё раз.');
		});
});

// 15. Кнопка «За новыми покупками!» в окне успеха
events.on('success:close', () => {
	modal.close();
});
