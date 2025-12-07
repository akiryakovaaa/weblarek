import { IProduct } from '../../types';
import { events } from '../base/Events';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class BasketItemView {
  private container: HTMLElement;
  private indexElement: HTMLElement;
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;
  private deleteButton: HTMLButtonElement;

  private id = '';

  constructor() {
    // клонируем шаблон через утилиту
    this.container = cloneTemplate<HTMLElement>('#card-basket');

    // находим внутренние DOM-элементы
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    // обработчик удаления из корзины
    this.deleteButton.addEventListener('click', () => {
      if (this.id) {
        events.emit('basket:item-remove', { id: this.id });
      }
    });
  }

  // индекс нужен для нумерации (1,2,3,...)
  render(product: IProduct, index: number): HTMLElement {
    this.id = product.id;

    this.indexElement.textContent = String(index + 1);
    this.titleElement.textContent = product.title;
    this.priceElement.textContent =
      product.price === null ? 'Бесценно' : `${product.price} синапсов`;

    return this.container;
  }
}
