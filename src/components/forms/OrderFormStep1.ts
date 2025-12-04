import { BaseForm } from '../base/BaseForm';
import { events } from '../base/Events';

type OrderStep1Errors = {
  address?: string;
  payment?: string;
  // если в модели есть ещё поля — добавь сюда
};

export class OrderFormStep1 extends BaseForm {
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorElement: HTMLElement;

  // нужно только для подсветки активной кнопки
  private selectedPayment: 'card' | 'cash' | null = null;

  // объект ошибок, который приходит из модели через presenter
  private errors: OrderStep1Errors = {};

  constructor(container: HTMLElement) {
    super(container);

    // берём элементы именно из formElement
    this.paymentButtons =
      this.formElement.querySelectorAll<HTMLButtonElement>('.button_alt');
    this.addressInput =
      this.formElement.querySelector<HTMLInputElement>('input[name="address"]')!;
    this.submitButton =
      this.formElement.querySelector<HTMLButtonElement>('.order__button')!;
    this.errorElement =
      this.formElement.querySelector<HTMLElement>('.form__errors')!;

    // выбор способа оплаты
    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const name = button.getAttribute('name');
        const payment: 'card' | 'cash' = name === 'cash' ? 'cash' : 'card';

        this.selectedPayment = payment;

        // визуально подсветить выбранную кнопку
        this.paymentButtons.forEach((b) =>
          b.classList.remove('button_alt-active')
        );
        button.classList.add('button_alt-active');

        // сообщаем презентеру об изменении модели покупателя
        events.emit('order:change-payment', { payment });
      });
    });

    // изменение адреса
    this.addressInput.addEventListener('input', () => {
      events.emit('order:change-address', {
        address: this.addressInput.value.trim(),
      });
    });

    // сюда presenter будет присылать ошибки из модели покупателя
    // (нужно в main.ts после валидации вызвать events.emit('order:step1-errors', errors))
    events.on<OrderStep1Errors>('order:step1-errors', (errors) => {
      this.errors = errors;
      this.updateFromErrors();
    });

    // отправка формы (кнопка "Далее")
    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!this.canSubmit()) {
        this.showError();
        return;
      }

      this.errorElement.textContent = '';
      events.emit('order:submit-step1', {});
    });
  }

  // можно ли перейти дальше? — смотрим только на ошибки из модели
  private canSubmit(): boolean {
    return !this.errors.address && !this.errors.payment;
  }

  // обновляем кнопку и текст ошибки
  private updateFromErrors(): void {
    const ok = this.canSubmit();
    this.submitButton.disabled = !ok;

    if (!ok) {
      this.showError();
    } else {
      this.errorElement.textContent = '';
    }
  }

  // показ сообщения об ошибке
  private showError(): void {
    if (this.errors.address) {
      this.errorElement.textContent = this.errors.address;
    } else if (this.errors.payment) {
      this.errorElement.textContent = this.errors.payment;
    } else {
      this.errorElement.textContent = '';
    }
  }
}
