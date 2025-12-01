import { BaseForm } from '../base/BaseForm';
import { events } from '../base/Events';

export class OrderFormStep1 extends BaseForm {

  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;

  constructor(container: HTMLElement) {
    super(container);

    this.paymentButtons = container.querySelectorAll('.button_alt');
    this.addressInput = container.querySelector('input[name="address"]')!;

    // выбор способа оплаты
    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const payment = button.dataset.payment!;

        // визуальное выделение
        this.paymentButtons.forEach((b) =>
          b.classList.remove('button_alt-active')
        );
        button.classList.add('button_alt-active');

        // уведомляем презентер
        events.emit('order:change-payment', { payment });
      });
    });

    // изменение адреса
    this.addressInput.addEventListener('input', () => {
      events.emit('order:change-address', {
        address: this.addressInput.value,
      });
    });

    // отправка формы
    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      events.emit('order:submit-step1', {});
    });
  }
}
