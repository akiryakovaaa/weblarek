import { BaseCard } from '../base/BaseCard';
import { IProduct } from '../../types';
import { events } from '../base/Events';
import { CDN_URL } from '../../utils/constants';

export class CardCatalog extends BaseCard {
	private id!: string;

	constructor(container: HTMLElement) {
		super(container);

		// клик по всей карточке — открыть превью
		container.addEventListener('click', () => {
			events.emit('product:select', { id: this.id });
		});

		// клик по кнопке "Купить" — добавить в корзину
		if (this.buttonElement) {
			this.buttonElement.addEventListener('click', (event) => {
				event.stopPropagation(); // чтобы не триггерить открытие превью
				if (this.buttonElement?.disabled) return; // если "Недоступно" — не шлём

				events.emit('product:add-to-basket', { id: this.id });
			});
		}
	}

	render(data: IProduct): HTMLElement {
		this.id = data.id;

		this.title = data.title;
		this.price = data.price;
		this.category = data.category;
		this.image = `${CDN_URL}/${data.image}`;

		// состояние кнопки
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
