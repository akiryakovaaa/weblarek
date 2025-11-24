import { IProduct } from '../../types';

export class Products {
  private items: IProduct[] = [];
  private selected: IProduct | null = null;

  // Сохраняем массив товаров
  setItems(items: IProduct[]): void {
    this.items = items;
  }

  // Получаем массив всех товаров
  getItems(): IProduct[] {
    return this.items;
  }

  // Получаем один товар по id
  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  // Сохраняем товар для подробного отображения
  setSelected(item: IProduct): void {
    this.selected = item;
  }

  // Получаем товар для подробного отображения
  getSelected(): IProduct | null {
    return this.selected;
  }
}
