import { BaseCard } from '../base/BaseCard';
import { IProduct } from '../../types';
import { events } from '../base/Events';
import { CDN_URL, categoryMap } from '../../utils/constants';

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
				event.stopPropagation(); // чтобы не открывалось превью
				if (this.buttonElement?.disabled) return; // если "Недоступно" — ничего не делаем

				events.emit('product:add-to-basket', { id: this.id });
			});
		}
	}

	render(data: IProduct): HTMLElement {
		this.id = data.id;

		// базовые поля карточки
		this.title = data.title;
		this.price = data.price;
		this.image = `${CDN_URL}/${data.image}`;
		this.category = data.category;

		// ----- ЦВЕТНАЯ плашка категории -----
		const categoryElement = this.container.querySelector(
			'.card__category'
		) as HTMLElement | null;

		if (categoryElement) {
			// сбрасываем старые классы и добавляем базовый
			categoryElement.className = 'card__category';

			// ЯВНО говорим TS, что categoryMap — это Record<string, string>
			const map = categoryMap as Record<string, string>;
			const categoryClass = map[data.category];

			if (categoryClass) {
				categoryElement.classList.add(categoryClass);
			}

			// текст плашки
			categoryElement.textContent = data.category;
		}

		// ----- Кнопка "Купить" / "Недоступно" -----
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
