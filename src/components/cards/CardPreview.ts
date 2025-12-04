import { BaseCard } from '../base/BaseCard';
import { IProduct } from '../../types';
import { events } from '../base/Events';
import { CDN_URL } from '../../utils/constants';

export class CardPreview extends BaseCard {
	private id!: string;
	private descriptionElement: HTMLElement | null;

	constructor(container: HTMLElement) {
		super(container);

		this.descriptionElement = container.querySelector('.card__text');

		// клик по кнопке "Купить / Удалить"
		if (this.buttonElement) {
			this.buttonElement.addEventListener('click', () => {
				events.emit('product:toggle-from-preview', { id: this.id });
			});
		}

	}

	// делаем метод публичным, чтобы вызывать его из presenter
	public updateButton(items: IProduct[]): void {
		if (!this.buttonElement) return;

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

		if (this.descriptionElement) {
			this.descriptionElement.textContent = data.description;
		}

		if (this.buttonElement) {
			this.setButtonDisabled(false, 'Купить');
		}

		return this.container;
	}
}
