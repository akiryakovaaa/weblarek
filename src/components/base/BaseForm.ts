import { events } from './Events';

export abstract class BaseForm {
  protected container: HTMLElement;
  protected formElement: HTMLFormElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.formElement = container.querySelector('form') as HTMLFormElement;

    // обработка изменений в полях
    this.formElement.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      events.emit('form:change', {
        name: target.name,
        value: target.value
      });
    });
  }

  // используется для отображения формы внутри модалки
  render(): HTMLElement {
    return this.container;
  }
}
