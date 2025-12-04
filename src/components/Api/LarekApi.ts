import { IApi, IProduct, IProductList, IOrder, IOrderResult } from '../../types';

export class LarekApi {
	private api: IApi;

	constructor(api: IApi) {
		this.api = api;
	}

	async getProducts(): Promise<IProduct[]> {
		const data = await this.api.get<IProductList>('/product/');
		return data.items;
	}

	async createOrder(order: IOrder): Promise<IOrderResult> {
		const data = await this.api.post<IOrderResult>('/order/', order);
		return data;
	}
}
