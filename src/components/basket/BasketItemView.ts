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
		// Получаем шаблон
		const template = document.querySelector<HTMLTemplateElement>('#card-basket');
		if (!template) {
			throw new Error('Шаблон #card-basket не найден');
		}

		// Клонируем содержимое шаблона
		this.container = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		// Находим элементы
		this.indexElement = this.container.querySelector('.basket__item-index')!;
		this.titleElement = this.container.querySelector('.card__title')!;
		this.priceElement = this.container.querySelector('.card__price')!;
		this.deleteButton = this.container.querySelector('.basket__item-delete')!;

		// Слушатель удаления
		this.deleteButton.addEventListener('click', () => {
			if (this.id) {
				events.emit('basket:item-remove', { id: this.id });
			}
		});
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
