import { Component } from './Component';
import { IProduct } from '../../types';

// Базовый класс для всех карточек товара
export abstract class BaseCard extends Component<IProduct> {
  // Элементы разметки карточки
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected buttonElement?: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    // Ищем и сохраняем элементы разметки
    this.titleElement = container.querySelector('.card__title')!;
    this.priceElement = container.querySelector('.card__price')!;
    this.categoryElement = container.querySelector('.card__category')!;
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
    this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement | null || undefined;
  }

  // Сеттеры — только обновляют DOM, данные не храним
  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    // сюда позже добавим классы из categoryMap
  }

  set image(src: string) {
    this.setImage(this.imageElement, src, this.titleElement.textContent ?? '');
  }

  setButtonDisabled(disabled: boolean, text?: string) {
    if (!this.buttonElement) return;
    this.buttonElement.disabled = disabled;
    if (text) {
      this.buttonElement.textContent = text;
    }
  }
}
