import { BaseCard } from '../base/BaseCard';
import { IProduct } from '../../types';
import { events } from '../base/Events';

export class CardCatalog extends BaseCard {
  private id!: string; // храним только id товара

  constructor(container: HTMLElement) {
    super(container);

    // Клик по карточке (открыть превью товара)
    container.addEventListener('click', () => {
      events.emit('product:select', { id: this.id });
    });

    // Клик по кнопке "Купить"
    if (this.buttonElement) {
      this.buttonElement.addEventListener('click', (event) => {
        event.stopPropagation(); // не даём карточке триггернуть select
        events.emit('product:add-to-basket', { id: this.id });
      });
    }
  }

  // Метод заполнения карточки данными
  render(data: IProduct): HTMLElement {
    this.id = data.id; // сохраняем id товара

    this.title = data.title;
    this.price = data.price;
    this.category = data.category;
    this.image = data.image;

    // Обработка недоступных товаров
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
