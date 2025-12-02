import { events } from './Events';

export abstract class BaseForm {
  protected container: HTMLElement;
  protected formElement: HTMLFormElement;

  constructor(container: HTMLElement) {
    this.container = container;

    // контейнер может быть самой <form>, а может обёрткой
    const form =
      container instanceof HTMLFormElement
        ? container
        : (container.querySelector('form') as HTMLFormElement | null);

    if (!form) {
      throw new Error('Form element not found in BaseForm');
    }

    this.formElement = form;

    // общий обработчик (можно оставить, он не мешает)
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
