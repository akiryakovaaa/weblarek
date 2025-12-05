import { IProduct } from '../../types';
import { events } from '../base/Events';

export class Basket {
	private items: IProduct[]; // хранение товаров корзины

	constructor() {
		// Корзина всегда должна начинаться пустой
		this.items = [];
	}

	// Получить список товаров корзины
	getItems(): IProduct[] {
		return this.items;
	}

	// Проверка наличия товара в корзине
	hasItem(id: string): boolean {
		return this.items.some((item) => item.id === id);
	}

	// Добавить товар
	addItem(item: IProduct): void {
		this.items.push(item);
		events.emit('basket:changed', { items: this.items });
	}

	// Удалить товар
	removeItem(item: IProduct): void {
		this.items = this.items.filter((i) => i.id !== item.id);
		events.emit('basket:changed', { items: this.items });
	}

	// Очистить корзину
	clear(): void {
		this.items = [];
		events.emit('basket:changed', { items: this.items });
	}

	// Получить суммарную стоимость
	getTotal(): number {
		return this.items.reduce((sum, item) => {
			if (item.price === null) return sum;
			return sum + item.price;
		}, 0);
	}

	// Количество товаров
	getCount(): number {
		return this.items.length;
	}
}
