import { BaseCard } from '../base/BaseCard';
import { IProduct } from '../../types';
import { events } from '../base/Events';
import { CDN_URL } from '../../utils/constants';

export class CardPreview extends BaseCard {
	private id!: string;

	constructor(container: HTMLElement) {
		super(container);

		// кнопка в модалке
		if (this.buttonElement) {
			this.buttonElement.addEventListener('click', (event) => {
				event.stopPropagation();
				if (this.buttonElement?.disabled) return;

				events.emit('product:toggle-from-preview', { id: this.id });
			});
		}
	}

	render(data: IProduct): HTMLElement {
		this.id = data.id;

		this.title = data.title;
		this.price = data.price;
		this.category = data.category;
		this.image = `${CDN_URL}/${data.image}`;

		if (this.buttonElement) {
			if (data.price === null) {
				this.setButtonDisabled(true, 'Недоступно');
			} else {
				this.setButtonDisabled(false, 'Купить');
			}
		}

		return this.container;
	}
}
