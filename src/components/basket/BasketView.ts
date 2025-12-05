import { events } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class BasketView {
	private container: HTMLElement;
	private listElement: HTMLElement;
	private totalElement: HTMLElement;
	private submitButton: HTMLButtonElement;

	private emptyElement: HTMLParagraphElement;

	constructor(container: HTMLElement) {
		this.container = container;

		// ищем элементы через утилиту из utils.ts
		this.listElement = ensureElement<HTMLElement>('.basket__list', container);
		this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
		this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', container);

		this.emptyElement = document.createElement('p');
		this.emptyElement.classList.add('basket__empty');
		this.emptyElement.textContent = 'Корзина пуста';

		this.submitButton.addEventListener('click', () => {
			events.emit('basket:submit', {});
		});

		// начальное состояние: пустая корзина маленькой высоты,
		// надпись "Корзина пуста" и неактивная кнопка "Оформить"
		this.setItems([]);
		this.setTotal(0);
	}

	// Устанавливаем элементы списка и состояние «корзина пуста»
	setItems(items: HTMLElement[]): void {
		this.listElement.replaceChildren(...items);

		const isEmpty = items.length === 0;

		// ------ Надпись "Корзина пуста" ------
		if (isEmpty) {
			if (!this.listElement.contains(this.emptyElement)) {
				this.listElement.appendChild(this.emptyElement);
			}
		} else if (this.listElement.contains(this.emptyElement)) {
			this.emptyElement.remove();
		}

		// ------ Размер корзины ------
		// компактная высота как на макете
		if (isEmpty) {
			this.container.style.height = '220px';
		} else {
			this.container.style.height = 'auto';
		}
		// ограничиваем высоту, чтобы корзина не раздувалась на весь экран
		this.container.style.maxHeight = '260px';

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
