import { events } from '../base/Events';

export class BasketView {
  private container: HTMLElement;
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private submitButton: HTMLButtonElement;
  private emptyElement: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;

    this.listElement = container.querySelector('.basket__list')!;
    this.totalElement = container.querySelector('.basket__price')!;
    this.submitButton = container.querySelector('.basket__button')!;
    this.emptyElement = container.querySelector('.basket__empty')!;

    // кнопка "Оформить заказ"
    this.submitButton.addEventListener('click', () => {
      events.emit('basket:submit', {});
    });
  }

  // рендер корзины
  render(items: HTMLElement[], total: number) {
    this.listElement.replaceChildren(...items);
    this.totalElement.textContent = `${total} синапсов`;

    const isEmpty = items.length === 0;

    // показываем "Корзина пуста"
    this.emptyElement.classList.toggle('hidden', !isEmpty);

    // кнопка disabled, если корзина пустая
    this.submitButton.disabled = isEmpty;

    return this.container;
  }
}
