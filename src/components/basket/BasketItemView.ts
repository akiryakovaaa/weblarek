import { IProduct } from '../../types';
import { events } from '../base/Events';

export class BasketItemView {
	private container: HTMLElement;
	private indexElement: HTMLElement;
	private titleElement: HTMLElement;
	private priceElement: HTMLElement;
	private deleteButton: HTMLButtonElement;

	private id = '';

	constructor() {
		this.container = document.createElement('li');
		this.container.classList.add('basket__item', 'card', 'card_compact');

		this.indexElement = document.createElement('span');
		this.indexElement.classList.add('basket__item-index');

		this.titleElement = document.createElement('span');
		this.titleElement.classList.add('card__title');

		this.priceElement = document.createElement('span');
		this.priceElement.classList.add('card__price');

		this.deleteButton = document.createElement('button');
		this.deleteButton.classList.add('basket__item-delete');
		this.deleteButton.type = 'button';
		this.deleteButton.setAttribute('aria-label', 'Удалить из корзины');

		this.deleteButton.addEventListener('click', () => {
			if (this.id) {
				events.emit('basket:item-remove', { id: this.id });
			}
		});

		this.container.append(
			this.indexElement,
			this.titleElement,
			this.priceElement,
			this.deleteButton
		);
	}

	// индекс нужен для нумерации (1,2,3,...)
	render(product: IProduct, index: number): HTMLElement {
		this.id = product.id;

		this.indexElement.textContent = String(index + 1);
		this.titleElement.textContent = product.title;
		this.priceElement.textContent =
			product.price === null ? 'Бесценно' : `${product.price} синапсов`;

		return this.container;
	}
}
