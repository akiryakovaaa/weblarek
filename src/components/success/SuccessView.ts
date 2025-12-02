import { events } from '../base/Events';

export class SuccessView {
	private container: HTMLElement;
	private button: HTMLButtonElement | null;
	private descriptionElement: HTMLElement | null;

	constructor(container: HTMLElement) {
		this.container = container;

		// Кнопка "За новыми покупками!"
		this.button =
			(container.querySelector('.success__button') as HTMLButtonElement) ||
			(container.querySelector('button[type="button"]') as HTMLButtonElement) ||
			(container.querySelector('button') as HTMLButtonElement);

		// Элемент с текстом "Списано ... синапсов" (если нужно обновлять текст)
		this.descriptionElement =
			(this.container.querySelector('.success__description') as HTMLElement) ||
			(this.container.querySelector('.modal__description') as HTMLElement) ||
			null;

		// Навешиваем обработчик на кнопку
		if (this.button) {
			this.button.addEventListener('click', () => {
				// сообщаем презентеру, что пользователь хочет вернуться к покупкам
				events.emit('order:success-close', {});
			});
		}
	}

	// totalText — строка с суммой, которую можно показать в окне успеха
	render(totalText?: string) {
		if (this.descriptionElement && totalText) {
			this.descriptionElement.textContent = totalText;
		}
		return this.container;
	}
}
