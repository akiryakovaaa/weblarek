import { events } from '../base/Events';

export class SuccessView {
  private container: HTMLElement;
  private orderIdElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    this.container = container;

    this.orderIdElement = container.querySelector('.success__id')!;
    this.closeButton = container.querySelector('.success__close')!;

    this.closeButton.addEventListener('click', () => {
      events.emit('order:success-close', {});
    });
  }

  render(orderId: string): HTMLElement {
    this.orderIdElement.textContent = orderId;
    return this.container;
  }
}
