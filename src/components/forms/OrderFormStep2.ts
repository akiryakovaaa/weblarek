import { BaseForm } from '../base/BaseForm';
import { events } from '../base/Events';

export class OrderFormStep2 extends BaseForm {

  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLElement) {
    super(container);

    this.emailInput = container.querySelector('input[name="email"]')!;
    this.phoneInput = container.querySelector('input[name="phone"]')!;

    // изменение email
    this.emailInput.addEventListener('input', () => {
      events.emit('order:change-email', {
        email: this.emailInput.value
      });
    });

    // изменение телефона
    this.phoneInput.addEventListener('input', () => {
      events.emit('order:change-phone', {
        phone: this.phoneInput.value
      });
    });

    // отправка формы
    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      events.emit('order:submit-step2', {});
    });
  }
}
