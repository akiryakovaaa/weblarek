import { events } from '../base/Events';

export class BasketView {
	private container: HTMLElement;
	private listElement: HTMLElement;
	private totalElement: HTMLElement;
	private submitButton: HTMLButtonElement;

	// элемент "Корзина пуста"
	private emptyElement: HTMLParagraphElement;

	constructor(container: HTMLElement) {
		this.container = container;

		this.listElement = container.querySelector('.basket__list') as HTMLElement;
		this.totalElement = container.querySelector('.basket__price') as HTMLElement;
		this.submitButton = container.querySelector('.basket__button') as HTMLButtonElement;

		// создаём надпись "Корзина пуста"
		this.emptyElement = document.createElement('p');
		this.emptyElement.classList.add('basket__empty');
		this.emptyElement.textContent = 'Корзина пуста';

		// обработчик кнопки "Оформить"
		this.submitButton.addEventListener('click', () => {
			events.emit('basket:submit', {});
		});
	}

	// ---------- РЕНДЕР ----------
	render(items: HTMLElement[], total: number): HTMLElement {
		// обновляем список товаров
		this.listElement.replaceChildren(...items);

		// обновляем сумму
		this.totalElement.textContent = `${total} синапсов`;

		// проверка на пустую корзину
		if (items.length === 0) {
			// показываем плейсхолдер
			if (!this.listElement.contains(this.emptyElement)) {
				this.listElement.appendChild(this.emptyElement);
			}
		} else {
			// убираем плейсхолдер
			if (this.listElement.contains(this.emptyElement)) {
				this.emptyElement.remove();
			}
		}

		// блокируем кнопку если корзина пустая
		this.submitButton.disabled = items.length === 0;

		return this.container;
	}
}
