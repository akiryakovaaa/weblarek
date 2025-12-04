import { events } from '../base/Events';

export class BasketView {
	private container: HTMLElement;
	private listElement: HTMLElement;
	private totalElement: HTMLElement;
	private submitButton: HTMLButtonElement;

	private emptyElement: HTMLParagraphElement;

	constructor(container: HTMLElement) {
		this.container = container;

		this.listElement = container.querySelector('.basket__list')!;
		this.totalElement = container.querySelector('.basket__price')!;
		this.submitButton = container.querySelector('.basket__button')!;

		this.emptyElement = document.createElement('p');
		this.emptyElement.classList.add('basket__empty');
		this.emptyElement.textContent = 'Корзина пуста';

		this.submitButton.addEventListener('click', () => {
			events.emit('basket:submit', {});
		});
	}

	// Устанавливаем элементы списка и состояние «корзина пуста»
	setItems(items: HTMLElement[]): void {
		this.listElement.replaceChildren(...items);

		const isEmpty = items.length === 0;

		// ------ Размер корзины ------
		if (isEmpty) {
			this.container.style.height = '220px';
			this.container.style.maxHeight = '220px';
		} else {
			this.container.style.height = 'auto';
			this.container.style.maxHeight = 'none';
		}

		// ------ Надпись "Корзина пуста" ------
		if (isEmpty) {
			if (!this.listElement.contains(this.emptyElement)) {
				this.listElement.appendChild(this.emptyElement);
			}
		} else if (this.listElement.contains(this.emptyElement)) {
			this.emptyElement.remove();
		}

		// ------ Кнопка "Оформить" ------
		this.submitButton.disabled = isEmpty;

		// модалка не скроллится
		this.container.style.overflow = 'hidden';
		this.listElement.style.overflow = 'hidden';
	}

	// Устанавливаем общую стоимость
	setTotal(total: number): void {
		this.totalElement.textContent = `${total} синапсов`;
	}

	// render только возвращает контейнер
	render(): HTMLElement {
		return this.container;
	}
}
