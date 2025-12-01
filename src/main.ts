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
//   ИНИЦИАЛИЗАЦИЯ МОДЕЛЕЙ
// =======================

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();

// =======================
//   DOM и VIEW-объекты
// =======================

const gallery = document.querySelector<HTMLElement>('.gallery');
const catalogTemplate =
	document.querySelector<HTMLTemplateElement>('#card-catalog');
const previewTemplate =
	document.querySelector<HTMLTemplateElement>('#card-preview');
const basketTemplate =
	document.querySelector<HTMLTemplateElement>('#basket');

const basketButton = document.querySelector<HTMLButtonElement>('.header__basket');

const modal = new Modal();

// экземпляр View корзины (обёртка над разметкой из template)
const basketView = basketTemplate
	? new BasketView(
			basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement
	  )
	: null;

// =======================
//   ОБРАБОТКА СОБЫТИЙ
// =======================

// 1) Модель каталога изменилась → перерисовываем список карточек
events.on<{ items: IProduct[] }>('products:changed', ({ items }) => {
	if (!gallery || !catalogTemplate) return;

	const cardElements = items.map((product) => {
		// клонируем разметку карточки из темплейта
		const element = catalogTemplate.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;

		// создаём экземпляр вьюшки и заполняем её данными
		const card = new CardCatalog(element);
		return card.render(product);
	});

	gallery.replaceChildren(...cardElements);
});

// 2) Пользователь кликнул по карточке в каталоге → выбираем товар в модели
events.on<{ id: string }>('product:select', ({ id }) => {
	const product = productsModel.getItemById(id);
	if (!product) return;

	productsModel.setSelected(product);
});

// 3) В модели сменился выбранный товар → открываем модалку с превью
events.on<{ product: IProduct | null }>('products:selected', ({ product }) => {
	if (!product || !previewTemplate) return;

	const element = previewTemplate.content.firstElementChild!.cloneNode(
		true
	) as HTMLElement;
	const previewCard = new CardPreview(element);

	const content = previewCard.render(product);
	modal.open(content);
});

// 4) Нажали "Купить" в карточке каталога → добавляем товар в корзину
events.on<{ id: string }>('product:add-to-basket', ({ id }) => {
	const product = productsModel.getItemById(id);
	if (!product) return;

	basketModel.addItem(product);
});

// 5) Клик по иконке корзины в шапке → открыть корзину
basketButton?.addEventListener('click', () => {
	events.emit('basket:open', {});
});

// 6) Открытие корзины → рендерим её и показываем в модалке
events.on('basket:open', () => {
	if (!basketView) return;

	// превращаем товары корзины в <li>-элементы
	const itemsNodes = basketModel.getItems().map((item) => {
		const li = document.createElement('li');
		li.classList.add('basket__item');
		li.textContent = `${item.title} — ${
			item.price === null ? 'бесценно' : item.price + ' син. '
		}`;
		return li;
	});

	const total = basketModel.getTotal();
	const content = basketView.render(itemsNodes, total);
	modal.open(content);
});

// (дальше можно будет добавить обработчик basket:submit, формы заказа и т.д.)

// =======================
//   ЗАГРУЗКА ДАННЫХ С СЕРВЕРА
// =======================

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

// Получаем товары и сохраняем их в модель.
// Модель сама сэмитит `products:changed`, и каталог перерисуется.
larekApi
	.getProducts()
	.then((items) => {
		productsModel.setItems(items);
	})
	.catch((error) => {
		console.error('Ошибка при загрузке каталога с сервера:', error);
	});
