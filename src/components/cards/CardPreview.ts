import { BaseCard } from '../base/BaseCard';
import { IProduct } from '../../types';
import { events } from '../base/Events';

export class CardPreview extends BaseCard {
  private id!: string;

  constructor(container: HTMLElement) {
    super(container);

    // Кнопка купить / удалить
    if (this.buttonElement) {
      this.buttonElement.addEventListener('click', (event) => {
        event.stopPropagation();

        events.emit('product:toggle-from-preview', { id: this.id });
        // Презентер потом сам решит — добавить или удалить
      });
    }
  }

  render(data: IProduct): HTMLElement {
    this.id = data.id;

    this.title = data.title;
    this.price = data.price;
    this.category = data.category;
    this.image = data.image;

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
