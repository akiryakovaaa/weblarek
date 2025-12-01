import { IProduct } from '../../types';
import { events } from '../base/Events';

export class Basket {
  private items: IProduct[] = [];

  // Добавить товар
  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this.items.push(item);

      // событие: корзина изменилась
      events.emit('basket:changed', {
        items: this.items,
      });
    }
  }

  // Удалить товар
  removeItem(item: IProduct): void {
    this.items = this.items.filter((i) => i.id !== item.id);

    // событие: корзина изменилась
    events.emit('basket:changed', {
      items: this.items,
    });
  }

  // Очистить корзину
  clear(): void {
    this.items = [];

    // событие: корзина изменилась
    events.emit('basket:changed', {
      items: this.items,
    });
  }

  // Получить товары
  getItems(): IProduct[] {
    return this.items;
  }

  // Получить сумму
  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  // Проверить наличие товара
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

  // Количество товаров
  getCount(): number {
    return this.items.length;
  }
}
