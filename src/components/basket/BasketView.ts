import { events } from '../base/Events';

export class BasketView {
	private container: HTMLElement;
	private listElement: HTMLElement;
	private totalElement: HTMLElement;
	private submitButton: HTMLButtonElement;

	// создаём placeholder-плашку сами, т.к. в index.html её нет
	private emptyElement: HTMLParagraphElement;

	constructor(container: HTMLElement) {
		this.container = container;

		this.listElement = container.querySelector('.basket__list')!;
		this.totalElement = container.querySelector('.basket__price')!;
		this.submitButton = container.querySelector('.basket__button')!;

		// создаём "Корзина пуста", если корзина пуста
		this.emptyElement = document.createElement('p');
		this.emptyElement.classList.add('basket__empty');
		this.emptyElement.textContent = 'Корзина пуста';
		this.emptyElement.style.padding = '10px 0';
		this.emptyElement.style.opacity = '0.6';

		// кнопка "Оформить"
		this.submitButton.addEventListener('click', () => {
			events.emit('basket:submit', {});
		});
	}

	// рендер корзины
	render(items: HTMLElement[], total: number) {
		// очищаем список
		this.listElement.replaceChildren(...items);

		// устанавливаем цену
		this.totalElement.textContent =
			total === 0 ? '0 синапсов' : `${total} синапсов`;

		// корзина пуста?
		const isEmpty = items.length === 0;

		// если пусто — показываем текст
		if (isEmpty) {
			if (!this.listElement.contains(this.emptyElement)) {
				this.listElement.appendChild(this.emptyElement);
			}
		} else {
			if (this.listElement.contains(this.emptyElement)) {
				this.emptyElement.remove();
			}
		}

		// выключаем кнопку оформления
		this.submitButton.disabled = isEmpty;

		return this.container;
	}
}
