import { IProduct } from '../../types';
import { events } from '../base/Events';

export class Products {
  private items: IProduct[] = [];
  private selected: IProduct | null = null;

  // сохранить весь каталог товаров
  setItems(items: IProduct[]): void {
    this.items = items;

    // событие: каталог товаров изменён
    events.emit('products:changed', {
      items: this.items,
    });
  }

  // получить весь каталог товаров
  getItems(): IProduct[] {
    return this.items;
  }

  // получить один товар по ID
  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  // сохранить выбранный товар (для превью/modals)
  setSelected(item: IProduct | null): void {
    this.selected = item;

    // событие: выбранный товар изменён
    events.emit('products:selected', {
      product: this.selected,
    });
  }

  // получить выбранный товар
  getSelected(): IProduct | null {
    return this.selected;
  }
}
