import { BaseForm } from '../base/BaseForm';
import { events } from '../base/Events';

export class FormAdressDelivery extends BaseForm {
	private paymentButtons: NodeListOf<HTMLButtonElement>;
	private addressInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;
	private errorElement: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		// элементы именно из formElement
		this.paymentButtons =
			this.formElement.querySelectorAll<HTMLButtonElement>('.button_alt');
		this.addressInput =
			this.formElement.querySelector<HTMLInputElement>('input[name="address"]')!;
		this.submitButton =
			this.formElement.querySelector<HTMLButtonElement>('.order__button')!;
		this.errorElement =
			this.formElement.querySelector<HTMLElement>('.form__errors')!;

		// стартовое состояние — дальше идти нельзя
		this.setSubmitAvailable(false);

		// выбор способа оплаты
		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				const name = button.getAttribute('name');
				const payment: 'card' | 'cash' = name === 'cash' ? 'cash' : 'card';

				// визуальное выделение
				this.paymentButtons.forEach((b) =>
					b.classList.remove('button_alt-active')
				);
				button.classList.add('button_alt-active');

				// сообщаем презентеру, что поменялся способ оплаты
				events.emit('order:change-payment', { payment });
			});
		});

		// изменение адреса
		this.addressInput.addEventListener('input', () => {
			events.emit('order:change-address', {
				address: this.addressInput.value,
			});
		});

		// отправка формы (кнопка «Далее»)
		this.formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			// просто говорим презентеру: "пользователь хочет перейти на шаг 2"
			events.emit('order:submit-step1', {});
		});
	}

	/**
	 * Обновить состояние кнопки «Далее» и текст ошибки.
	 * Этот метод должен вызывать презентер после валидации модели Buyer.
	 */
	public setValidationState(options: {
		canSubmit: boolean;
		errorMessage?: string;
	}): void {
		this.setSubmitAvailable(options.canSubmit);
		this.errorElement.textContent = options.errorMessage ?? '';
	}

	private setSubmitAvailable(value: boolean): void {
		this.submitButton.disabled = !value;
	}

	// метод render без сложной логики — просто возвращает контейнер формы
	render(): HTMLElement {
		return this.container;
	}
}
