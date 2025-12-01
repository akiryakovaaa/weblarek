import { BaseCard } from '../base/BaseCard';
import { IProduct } from '../../types';
import { events } from '../base/Events';
import { CDN_URL } from '../../utils/constants';

export class CardPreview extends BaseCard {
	private id!: string;

	constructor(container: HTMLElement) {
		super(container);

		// Кнопка "Купить / Удалить" внутри превью
		if (this.buttonElement) {
			this.buttonElement.addEventListener('click', (event) => {
				event.stopPropagation();

				// Презентер решит, добавить или удалить
				events.emit('product:toggle-from-preview', { id: this.id });
			});
		}
	}

	render(data: IProduct): HTMLElement {
		this.id = data.id;

		this.title = data.title;
		this.price = data.price;
		this.category = data.category;

		// Картинка — тоже через CDN_URL
		this.image = `${CDN_URL}/${data.image}`;

		// Логика кнопки как и в каталоге: если нет цены — недоступно
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
