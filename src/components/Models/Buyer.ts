import { IBuyer } from '../../types';
import { events } from '../base/Events';

export class Buyer {
  private data: Partial<IBuyer> = {};

  // изменить данные покупателя
  setData(update: Partial<IBuyer>): void {
    this.data = { ...this.data, ...update };

    // событие: покупатель изменён
    events.emit('buyer:changed', {
      data: this.data,
    });
  }

  // получить данные покупателя
  getData(): Partial<IBuyer> {
    return this.data;
  }

  // очистить данные покупателя
  clear(): void {
    this.data = {};

    // событие: покупатель изменён
    events.emit('buyer:changed', {
      data: this.data,
    });
  }

  // проверка корректности данных
  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this.data.payment) errors.payment = 'Не указан способ оплаты';
    if (!this.data.address) errors.address = 'Не указан адрес';
    if (!this.data.email) errors.email = 'Не указан email';
    if (!this.data.phone) errors.phone = 'Не указан телефон';

    return errors;
  }
}
