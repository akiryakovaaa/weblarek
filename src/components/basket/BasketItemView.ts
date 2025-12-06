import { IProduct } from '../../types';
import { events } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export class BasketItemView {
	private container: HTMLElement;
	private indexElement: HTMLElement;
	private titleElement: HTMLElement;
	private priceElement: HTMLElement;
	private deleteButton: HTMLButtonElement;

	private id = '';

	constructor() {
		// клонируем шаблон через utils
		this.container = cloneTemplate<HTMLElement>('#card-basket');

		// ищем внутренние DOM-элементы ТОЛЬКО внутри контейнера
		this.indexElement = this.container.querySelector('.basket__item-index')!;
		this.titleElement = this.container.querySelector('.card__title')!;
		this.priceElement = this.container.querySelector('.card__price')!;
		this.deleteButton = this.container.querySelector('.basket__item-delete')!;

		// обработчик удаления из корзины
		this.deleteButton.addEventListener('click', () => {
			if (this.id) {
				events.emit('basket:item-remove', { id: this.id });
			}
		});
	}

	render(item: IProduct, index: number): HTMLElement {
		this.id = item.id;

		this.indexElement.textContent = String(index + 1);
		this.titleElement.textContent = item.title;
		this.priceElement.textContent = `${item.price ?? 0} синапсов`;

		return this.container;
	}
}
