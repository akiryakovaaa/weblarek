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
		this.items = this.items.filter((i) => i.id !== item.id);
		this.emitChanged();
	}

	// Очистить корзину
	clear(): void {
		this.items = [];
		this.emitChanged();
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

	// Есть ли товар в корзине
	hasItem(id: string): boolean {
		return this.items.some((item) => item.id === id);
	}

	// Служебный метод для события
	private emitChanged(): void {
		events.emit('basket:changed', {
			items: this.items,
		});
	}
}
