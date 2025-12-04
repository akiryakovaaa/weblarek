import { BaseForm } from '../base/BaseForm';
import { events } from '../base/Events';

export class FormContact extends BaseForm {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorElement: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);

    this.emailInput = container.querySelector('input[name="email"]')!;
    this.phoneInput = container.querySelector('input[name="phone"]')!;

    // блок для текста ошибки под кнопкой (как в первой форме)
    this.errorElement =
      (container.querySelector('.form__errors') as HTMLElement | null) ?? null;

    // Ищем кнопку "Оплатить"
    const submit =
      (container.querySelector('button[type="submit"]') as HTMLButtonElement | null) ||
      (container.querySelector('.order__button') as HTMLButtonElement | null);

    if (!submit) {
      throw new Error('Кнопка отправки во второй форме заказа не найдена');
    }

    this.submitButton = submit;

    // --- локальная простая валидация: оба поля не пустые ---
    const updateSubmitState = () => {
      const hasEmail = this.emailInput.value.trim().length > 0;
      const hasPhone = this.phoneInput.value.trim().length > 0;

      this.submitButton.disabled = !(hasEmail && hasPhone);
      // локальная валидация без текста ошибки
      if (this.errorElement && this.submitButton.disabled) {
        this.errorElement.textContent = '';
      }
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

  // метод, который дергает presenter после валидации модели Buyer
  public setValidationState(options: { canSubmit: boolean; errorMessage?: string }) {
    const { canSubmit, errorMessage } = options;

    this.submitButton.disabled = !canSubmit;

    if (this.errorElement) {
      this.errorElement.textContent = errorMessage ?? '';
    }
  }

  render(): HTMLElement {
    return this.container;
  }
}
