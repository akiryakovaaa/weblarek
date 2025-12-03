import { IBuyer } from '../../types';
import { events } from '../base/Events';

export class Buyer {
	private data: IBuyer = {
		payment: null,
		address: '',
		email: '',
		phone: '',
	};

	/**
	 * Устанавливает новые данные покупателя
	 */
	setData(update: Partial<IBuyer>): void {
		this.data = { ...this.data, ...update };

		// событие: данные покупателя изменены
		events.emit('buyer:changed', {
			data: this.data,
		});
	}

	/**
	 * Возвращает данные покупателя (строго типизированные)
	 */
	getData(): IBuyer {
		return this.data;
	}

	/**
	 * Полная очистка данных покупателя
	 */
	clear(): void {
		this.data = {
			payment: null,
			address: '',
			email: '',
			phone: '',
		};

		events.emit('buyer:changed', {
			data: this.data,
		});
	}

	/**
	 * Проверка корректности данных
	 */
	validate(): Record<string, string> {
		const errors: Record<string, string> = {};

		if (!this.data.payment) {
			errors.payment = 'Не указан способ оплаты';
		}
		if (!this.data.address?.trim()) {
			errors.address = 'Не указан адрес';
		}
		if (!this.data.email?.trim()) {
			errors.email = 'Не указан email';
		}
		if (!this.data.phone?.trim()) {
			errors.phone = 'Не указан телефон';
		}

		return errors;
	}
}
