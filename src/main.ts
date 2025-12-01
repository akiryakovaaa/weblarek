import './scss/styles.scss';

import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { CardCatalog } from './components/cards/CardCatalog';
import { CardPreview } from './components/cards/CardPreview';
import { BasketView } from './components/basket/BasketView';

import { Modal } from './components/base/Modal';
import { events } from './components/base/Events';

import { Api } from './components/base/Api';
import { LarekApi } from './components/Api/LarekApi';
import { API_URL } from './utils/constants';
import { IProduct } from './types';

// =======================
//   МОДЕЛИ
// =======================

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer(); // пока просто инициализируем, пригодится для форм

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
//   ВСПОМОГАТЕЛЬНОЕ: открыть корзину
// =======================

function openBasket() {
	if (!basketView) return;

	const itemsNodes = basketModel.getItems().map((item, index) => {
		// <li class="basket__item card card_compact">
		const li = document.createElement('li');
		li.classList.add('basket__item', 'card', 'card_compact');

		// номер позиции
		const indexSpan = document.createElement('span');
		indexSpan.classList.add('basket__item-index');
		indexSpan.textContent = String(index + 1);

		// название товара
		const titleSpan = document.createElement('span');
		titleSpan.classList.add('card__title');
		titleSpan.textContent = item.title;

		// цена товара
		const priceSpan = document.createElement('span');
		priceSpan.classList.add('card__price');
		priceSpan.textContent =
			item.price === null ? 'Бесценно' : `${item.price} синапсов`;

		// кнопка удаления
		const deleteBtn = document.createElement('button');
		deleteBtn.classList.add('basket__item-delete');
		deleteBtn.type = 'button';
		deleteBtn.setAttribute('aria-label', 'Удалить из корзины');

		// удаляем товар при клике
		deleteBtn.addEventListener('click', () => {
			basketModel.removeItem(item);
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

// 5. Нажали "Купить" в модалке превью → добавить/убрать из корзины
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

// (дальше можно будет добавить обработку basket:submit и формы заказа)

// =======================
//   ЗАГРУЗКА ДАННЫХ
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
