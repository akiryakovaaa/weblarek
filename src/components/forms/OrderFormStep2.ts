import { BaseForm } from '../base/BaseForm';
import { events } from '../base/Events';

export class OrderFormStep2 extends BaseForm {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.emailInput = container.querySelector('input[name="email"]')!;
    this.phoneInput = container.querySelector('input[name="phone"]')!;

    // Ищем кнопку "Оплатить"
    const submit =
      (container.querySelector('button[type="submit"]') as HTMLButtonElement | null) ||
      (container.querySelector('.order__button') as HTMLButtonElement | null);

    if (!submit) {
      throw new Error('Кнопка отправки во второй форме заказа не найдена');
    }

    this.submitButton = submit;

    // --- валидация: просто оба поля не пустые ---
    const updateSubmitState = () => {
      const hasEmail = this.emailInput.value.trim().length > 0;
      const hasPhone = this.phoneInput.value.trim().length > 0;

      this.submitButton.disabled = !(hasEmail && hasPhone);
    };

    // начальное состояние
    updateSubmitState();

    // изменения email
    this.emailInput.addEventListener('input', () => {
      events.emit('order:change-email', {
        email: this.emailInput.value,
      });
      updateSubmitState();
    });

    // изменения телефона
    this.phoneInput.addEventListener('input', () => {
      events.emit('order:change-phone', {
        phone: this.phoneInput.value,
      });
      updateSubmitState();
    });

    // отправка формы (по кнопке "Оплатить")
    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      if (this.submitButton.disabled) {
        return;
      }

      // оба поля заполнены → сообщаем презентеру
      events.emit('order:submit-step2', {});
    });
  }

  render(): HTMLElement {
    return this.container;
  }
}
