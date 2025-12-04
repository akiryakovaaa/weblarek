import { IProduct } from '../../types';
import { events } from '../base/Events';

export class Basket {
	private items: IProduct[] = [];

	// Добавить товар
	addItem(item: IProduct): void {
		if (!this.hasItem(item.id)) {
			this.items.push(item);
			this.emitChanged();
		}
	}

	// Удалить товар
	removeItem(item: IProduct): void {
		const newItems = this.items.filter((i) => i.id !== item.id);

		// чтобы не эмитить событие, если ничего не изменилось
		if (newItems.length !== this.items.length) {
			this.items = newItems;
			this.emitChanged();
		}
	}

	// Очистить корзину
	clear(): void {
		if (this.items.length > 0) {
			this.items = [];
			this.emitChanged();
		}
	}

	// Получить товары
	getItems(): IProduct[] {
		return this.items;
	}

	// Общая сумма
	getTotal(): number {
		return this.items.reduce(
			(sum, item) => sum + (item.price ?? 0),
			0
		);
	}

	// Количество товаров
	getCount(): number {
		return this.items.length;
	}

	// Проверка наличия товара
	hasItem(id: string): boolean {
		return this.items.some((item) => item.id === id);
	}

	// Вспомогательный метод — сообщает презентеру об изменении корзины
	private emitChanged(): void {
		events.emit('basket:changed', {
			items: this.items,
		});
	}
}
