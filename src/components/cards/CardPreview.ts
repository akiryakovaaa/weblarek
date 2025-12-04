import { BaseCard } from '../base/BaseCard';
import { IProduct } from '../../types';
import { events } from '../base/Events';
import { CDN_URL } from '../../utils/constants';

export class CardPreview extends BaseCard {
	private id!: string;
	private descriptionElement: HTMLElement | null;
	private isFree: boolean = false; // товар "бесценно"

	constructor(container: HTMLElement) {
		super(container);

		this.descriptionElement = container.querySelector('.card__text');

		// обработчик кнопки
		if (this.buttonElement) {
			this.buttonElement.addEventListener('click', () => {
				// запрещаем покупку бесценного товара
				if (this.isFree || this.buttonElement?.disabled) return;

				events.emit('product:toggle-from-preview', { id: this.id });
			});
		}
	}

	// вызывается презентером
	public updateButton(items: IProduct[]): void {
		if (!this.buttonElement) return;

		// если товар бесценный → кнопка всегда disabled
		if (this.isFree) {
			this.setButtonDisabled(true, 'Недоступно');
			return;
		}

		const isInBasket = items.some((item) => item.id === this.id);

		if (isInBasket) {
			this.setButtonDisabled(false, 'Удалить из корзины');
		} else {
			this.setButtonDisabled(false, 'Купить');
		}
	}

	render(data: IProduct): HTMLElement {
		this.id = data.id;
		this.title = data.title;
		this.price = data.price;
		this.category = data.category;
		this.image = `${CDN_URL}/${data.image}`;

		// запоминаем, что товар бесплатный
		this.isFree = data.price === null;

		if (this.descriptionElement) {
			this.descriptionElement.textContent = data.description;
		}

		// кнопка всегда заблокирована для бесплатного товара
		if (this.buttonElement) {
			if (this.isFree) {
				this.setButtonDisabled(true, 'Недоступно');
			} else {
				this.setButtonDisabled(false, 'Купить');
			}
		}

		return this.container;
	}
}
