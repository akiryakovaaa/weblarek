import { IApi, IProduct, IProductList, IOrder, IOrderResult } from '../../types';

export class LarekApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    // Получение массива товаров с сервера
    async getProducts(): Promise<IProduct[]> {
        const data = await this.api.get<IProductList>('/product/');
        return data.items;
    }

    // Отправка заказа на сервер
    async createOrder(order: IOrder): Promise<IOrderResult> {
        const data = await this.api.post<IOrderResult>('/order/', order);
        return data;
    }
}
