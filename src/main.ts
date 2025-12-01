import './scss/styles.scss';


import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';

import { Api } from './components/base/Api';
import { LarekApi } from './components/Api/LarekApi';


// Проверка модели каталога
const productsModel = new Products();

productsModel.setItems(apiProducts.items);
console.log('Каталог товаров:', productsModel.getItems());

console.log(
  'Первый товар по ID:',
  productsModel.getItemById(apiProducts.items[0].id)
);

productsModel.setSelected(apiProducts.items[1]);
console.log('Выбранный товар:', productsModel.getSelected());

// ---------- Проверка модели корзины ----------
const basketModel = new Basket();

basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);

console.log('Корзина:', basketModel.getItems());
console.log('Сумма корзины:', basketModel.getTotal());
console.log('Количество товаров:', basketModel.getCount());
console.log(
  'Есть ли товар №1:',
  basketModel.hasItem(apiProducts.items[0].id)
);

basketModel.removeItem(apiProducts.items[0]);
console.log(
  'После удаления первого товара:',
  basketModel.getItems()
);

basketModel.clear();
console.log('Корзина после очистки:', basketModel.getItems());

// ---------- Проверка модели покупателя ----------
const buyerModel = new Buyer();

buyerModel.setData({ payment: 'card' });
buyerModel.setData({ address: 'Москва, Ленина 1' });
buyerModel.setData({ email: 'test@mail.ru' });
buyerModel.setData({ phone: '+79999999999' });

console.log('Данные покупателя:', buyerModel.getData());
console.log('Ошибки валидации (должны быть пустыми):', buyerModel.validate());

buyerModel.clear();
console.log('Покупатель после очистки:', buyerModel.getData());
console.log(
  'Ошибки валидации после очистки:',
  buyerModel.validate()
);

// ---------- Работа с сервером ----------
import {API_URL} from './utils/constants';

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

larekApi.getProducts()
    .then((items) => {
        productsModel.setItems(items);
        console.log('Каталог товаров (с сервера):', productsModel.getItems());
    })
    .catch((error) => {
        console.error('Ошибка при загрузке каталога с сервера:', error);
    });
