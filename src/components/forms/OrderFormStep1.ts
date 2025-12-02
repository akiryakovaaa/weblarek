import { BaseForm } from '../base/BaseForm';
import { events } from '../base/Events';

export class OrderFormStep1 extends BaseForm {
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorElement: HTMLElement;

  private selectedPayment: 'card' | 'cash' | null = null;

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

    // стартовое состояние
    this.updateSubmitState();

    // выбор способа оплаты
    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const name = button.getAttribute('name');
        const payment: 'card' | 'cash' =
          name === 'cash' ? 'cash' : 'card';

        this.selectedPayment = payment;

        // визуальное выделение
        this.paymentButtons.forEach((b) =>
          b.classList.remove('button_alt-active')
        );
        button.classList.add('button_alt-active');

        // сообщаем презентеру
        events.emit('order:change-payment', { payment });

        this.updateSubmitState();
      });
    });

    // изменение адреса
    this.addressInput.addEventListener('input', () => {
      events.emit('order:change-address', {
        address: this.addressInput.value.trim(),
      });
      this.updateSubmitState();
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

  // можно ли перейти дальше?
  private canSubmit(): boolean {
    const hasAddress = this.addressInput.value.trim().length > 0;
    const hasPayment = this.selectedPayment !== null;
    return hasAddress && hasPayment;
  }

  // включить/выключить кнопку "Далее"
  private updateSubmitState() {
    const ok = this.canSubmit();
    this.submitButton.disabled = !ok;
    if (ok) {
      this.errorElement.textContent = '';
    }
  }

  // показать текст ошибки под кнопкой
  private showError() {
    if (!this.addressInput.value.trim()) {
      this.errorElement.textContent = 'Необходимо указать адрес';
    } else if (!this.selectedPayment) {
      this.errorElement.textContent = 'Выберите способ оплаты';
    } else {
      this.errorElement.textContent = '';
    }
  }
}
