import { BaseCard } from '../base/BaseCard';
import { IProduct } from '../../types';
import { events } from '../base/Events';
import { CDN_URL } from '../../utils/constants';

export class CardCatalog extends BaseCard {
	private id!: string; // храним id товара

	constructor(container: HTMLElement) {
		super(container);

		// Клик по карточке -> открыть превью товара
		container.addEventListener('click', () => {
			events.emit('product:select', { id: this.id });
		});

		// Клик по кнопке "Купить"
		if (this.buttonElement) {
			this.buttonElement.addEventListener('click', (event) => {
				event.stopPropagation(); // чтобы не срабатывал выбор карточки
				events.emit('product:add-to-basket', { id: this.id });
			});
		}
	}

	// Заполнение карточки данными
	render(data: IProduct): HTMLElement {
		this.id = data.id;

		this.title = data.title;
		this.price = data.price;
		this.category = data.category;

		// ВАЖНО: формируем полный путь к картинке через CDN_URL
		this.image = `${CDN_URL}/${data.image}`;

		// Кнопка в зависимости от наличия цены
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
