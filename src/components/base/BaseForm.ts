import { events } from './Events';
import { ensureElement } from '../../utils/utils';

export abstract class BaseForm {
  protected container: HTMLElement;
  protected formElement: HTMLFormElement;

  constructor(container: HTMLElement) {
    this.container = container;

    const form =
      container instanceof HTMLFormElement
        ? container
        : ensureElement<HTMLFormElement>('form', container);

    this.formElement = form;

    // общий обработчик
    this.formElement.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      if (!target.name) return;

      events.emit('form:change', {
        name: target.name,
        value: target.value,
      });
    });
  }

  render(): HTMLElement {
    return this.container;
  }
}
