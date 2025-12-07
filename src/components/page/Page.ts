import { events } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Page {
	private gallery: HTMLElement;
	private basketButton: HTMLButtonElement;
	private basketCounter: HTMLElement;

	constructor() {
		this.gallery = ensureElement<HTMLElement>('.gallery');
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket');
		this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');

		this.basketButton.addEventListener('click', () => {
			events.emit('basket:open', {});
		});
	}

	// витрина каталога
	setCatalog(items: HTMLElement[]) {
		this.gallery.replaceChildren(...items);
	}

	// счётчик товаров в шапке
	setBasketCounter(count: number) {
		this.basketCounter.textContent = String(count);
	}
}
