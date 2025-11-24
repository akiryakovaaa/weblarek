import { IProduct } from '../../types';

export class Basket {
  private items: IProduct[] = [];

  // Получение массива товаров корзины
  getItems(): IProduct[] {
    return this.items;
  }

  // Добавление товара в корзину
  addItem(item: IProduct): void {
    this.items.push(item);
  }

  // Удаление товара из корзины
  removeItem(item: IProduct): void {
    this.items = this.items.filter((i) => i.id !== item.id);
  }

  // Очистка корзины
  clear(): void {
    this.items = [];
  }

  // Общая стоимость товаров
  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  // Количество товаров в корзине
  getCount(): number {
    return this.items.length;
  }

  // Проверка наличия товара по id
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
