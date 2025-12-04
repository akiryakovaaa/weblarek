import { events } from '../base/Events';

export class SuccessView {
	private container: HTMLElement;
	private button: HTMLButtonElement | null;
	private descriptionElement: HTMLElement | null;

	constructor(container: HTMLElement) {
		this.container = container;

		this.button =
			(container.querySelector('.success__button') as HTMLButtonElement) ||
			(container.querySelector('button[type="button"]') as HTMLButtonElement) ||
			(container.querySelector('button') as HTMLButtonElement);

		this.descriptionElement =
			(this.container.querySelector('.success__description') as HTMLElement) ||
			(this.container.querySelector('.modal__description') as HTMLElement) ||
			null;

		if (this.button) {
			this.button.addEventListener('click', () => {
				events.emit('success:close', {});
			});
		}
	}

	/**
	 * total — сумма заказа (в синапсах)
	 */
	render(total: number = 0): HTMLElement {
	const priceElement = this.container.querySelector('.order-success__description');

	if (priceElement) {
		priceElement.textContent = `Списано ${total} синапсов`;
	}

	return this.container;
}

}
