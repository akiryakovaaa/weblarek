import { Component } from './Component';
import { IProduct } from '../../types';
import { ensureElement, ensureAllElements } from '../../utils/utils';

// Базовый класс для всех карточек товара
export abstract class BaseCard extends Component<IProduct> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected buttonElement?: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    // Ищем элементы карточки только через утилиты
    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

    // Кнопка может отсутствовать, поэтому используем ensureAllElements
    const [button] = ensureAllElements<HTMLButtonElement>('.card__button', container);
    this.buttonElement = button ?? undefined;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? 'Бесценно' : `${value} синапсов`;
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
  }

  set image(src: string) {
    this.setImage(this.imageElement, src, this.titleElement.textContent ?? '');
  }

  setButtonDisabled(disabled: boolean, text?: string) {
    if (!this.buttonElement) return;
    this.buttonElement.disabled = disabled;
    if (text) this.buttonElement.textContent = text;
  }
}
