import { BaseForm } from '../base/BaseForm';
import { events } from '../base/Events';

export class OrderFormStep2 extends BaseForm {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    // Берём элементы ИМЕННО из formElement
    this.emailInput =
      this.formElement.querySelector<HTMLInputElement>('input[name="email"]')!;
    this.phoneInput =
      this.formElement.querySelector<HTMLInputElement>('input[name="phone"]')!;

    // В шаблоне обычно просто кнопка type="submit"
    this.submitButton =
      this.formElement.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    this.errorElement =
      this.formElement.querySelector<HTMLElement>('.form__errors')!;

    // Стартовое состояние кнопки
    this.updateSubmitState();

    // Изменение email
    this.emailInput.addEventListener('input', () => {
      events.emit('order:change-email', {
        email: this.emailInput.value.trim(),
      });
      this.updateSubmitState();
    });

    // Изменение телефона
    this.phoneInput.addEventListener('input', () => {
      events.emit('order:change-phone', {
        phone: this.phoneInput.value.trim(),
      });
      this.updateSubmitState();
    });

    // Отправка формы (кнопка "Оплатить")
    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!this.canSubmit()) {
        this.showError();
        return;
      }

      this.errorElement.textContent = '';
      events.emit('order:submit-step2', {});
    });
  }

  // Проверяем, можно ли активировать кнопку
  private canSubmit(): boolean {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();

    if (!email || !phone) return false;

    // Простейшие проверки, чтобы хоть как-то фильтровать
    const emailOk = email.includes('@');
    const phoneOk = /\d{5,}/.test(phone);

    return emailOk && phoneOk;
  }

  // Включаем/выключаем кнопку и чистим ошибку
  private updateSubmitState() {
    const ok = this.canSubmit();

    if (this.submitButton) {
      this.submitButton.disabled = !ok;
    }

    if (ok && this.errorElement) {
      this.errorElement.textContent = '';
    }
  }

  // Показать текст ошибки под кнопкой
  private showError() {
    if (!this.errorElement) return;

    if (!this.emailInput.value.trim()) {
      this.errorElement.textContent = 'Необходимо указать Email';
    } else if (!this.phoneInput.value.trim()) {
      this.errorElement.textContent = 'Необходимо указать телефон';
    } else {
      this.errorElement.textContent = 'Проверьте корректность Email и телефона';
    }
  }
}
