import { BaseCard } from '../base/BaseCard';
import { IProduct } from '../../types';
import { events } from '../base/Events';
import { CDN_URL, categoryMap } from '../../utils/constants';

export class CardCatalog extends BaseCard {
    private id: string = '';

    constructor(container: HTMLElement) {
        super(container);

        // клик по всей карточке — открыть превью
        container.addEventListener('click', () => {
            events.emit('product:select', { id: this.id });
        });

        // клик по кнопке "Купить"
        const button = this.buttonElement;
        if (button) {
            button.addEventListener('click', (event) => {
                event.stopPropagation();

                if (button.disabled) return; // "Недоступно" — ничего не делаем

                events.emit('product:add-to-basket', { id: this.id });
            });
        }
    }

    render(data: IProduct): HTMLElement {
        this.id = data.id;

        this.title = data.title;
        this.price = data.price;
        this.image = `${CDN_URL}/${data.image}`;
        this.category = data.category;

        // сбрасываем классы категории
        this.categoryElement.className = 'card__category';

        const map = categoryMap as Record<string, string>;
        const categoryClass = map[data.category];

        if (categoryClass) {
            this.categoryElement.classList.add(categoryClass);
        }

        this.categoryElement.textContent = data.category;

        // блокируем товар без цены
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
