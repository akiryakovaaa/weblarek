import { events } from '../base/Events';

export class Page {
	private gallery: HTMLElement | null;
	private basketButton: HTMLButtonElement | null;
	private basketCounter: HTMLElement | null;

	constructor() {
		this.gallery = document.querySelector<HTMLElement>('.gallery');
		this.basketButton =
			document.querySelector<HTMLButtonElement>('.header__basket');
		this.basketCounter =
			document.querySelector<HTMLElement>('.header__basket-counter');

		this.basketButton?.addEventListener('click', () => {
			events.emit('basket:open', {});
		});
	}

	// витрина каталога
	setCatalog(items: HTMLElement[]) {
		if (!this.gallery) return;
		this.gallery.replaceChildren(...items);
	}

	// счётчик товаров в шапке
	setBasketCounter(count: number) {
		if (!this.basketCounter) return;
		this.basketCounter.textContent = String(count);
	}
}
