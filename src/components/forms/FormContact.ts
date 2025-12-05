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

    this.errorElement =
      (container.querySelector('.form__errors') as HTMLElement | null) ?? null;

    const submit =
      (container.querySelector('button[type="submit"]') as HTMLButtonElement | null) ||
      (container.querySelector('.order__button') as HTMLButtonElement | null);

    if (!submit) {
      throw new Error('Кнопка отправки во второй форме заказа не найдена');
    }

    this.submitButton = submit;

    // Локальная проверка заполненности полей
    const updateSubmitState = () => {
      const hasEmail = this.emailInput.value.trim().length > 0;
      const hasPhone = this.phoneInput.value.trim().length > 0;

      this.submitButton.disabled = !(hasEmail && hasPhone);

      if (this.errorElement && this.submitButton.disabled) {
        this.errorElement.textContent = '';
      }
    };

    // Инициализация состояния кнопки
    updateSubmitState();

    // ----- события ввода -----

    this.emailInput.addEventListener('input', () => {
      events.emit('order:change-email', {
        email: this.emailInput.value,
      });
      updateSubmitState();
    });

    this.phoneInput.addEventListener('input', () => {
      events.emit('order:change-phone', {
        phone: this.phoneInput.value,
      });
      updateSubmitState();
    });

    // ----- отправка формы -----
    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      if (this.submitButton.disabled) {
        return;
      }

      events.emit('order:submit-step2', {});
    });
  }

  /**
   * Обновление данных формы (вызывается из presenter при buyer:changed)
   */
  public updateFields(data: { email?: string; phone?: string }) {
    if (data.email !== undefined) {
      this.emailInput.value = data.email;
    }

    if (data.phone !== undefined) {
      this.phoneInput.value = data.phone;
    }

    // синхронизация состояния кнопки
    const hasEmail = this.emailInput.value.trim().length > 0;
    const hasPhone = this.phoneInput.value.trim().length > 0;

    this.submitButton.disabled = !(hasEmail && hasPhone);

    if (this.errorElement && this.submitButton.disabled) {
      this.errorElement.textContent = '';
    }
  }

  /**
   * Установка состояния валидации от модели Buyer
   */
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
