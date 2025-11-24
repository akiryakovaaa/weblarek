import { IBuyer, TPayment } from '../../types';

export class Buyer {
  private payment: TPayment | null = null;
  private address = '';
  private email = '';
  private phone = '';

  // Сохранение данных (можно передать только часть полей)
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
  }

  // Получение всех данных покупателя
  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  // Очистка данных покупателя
  clear(): void {
    this.payment = null;
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  // Валидация данных
  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this.address.trim()) {
      errors.address = 'Укажите адрес';
    }
    if (!this.email.trim()) {
      errors.email = 'Укажите email';
    }
    if (!this.phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }
}
