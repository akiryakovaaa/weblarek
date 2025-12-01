import { events } from './Events';

export class Modal {
  protected modalElement: HTMLElement;
  protected contentElement: HTMLElement;

  constructor() {
    this.modalElement = document.querySelector('.modal')!;
    this.contentElement = this.modalElement.querySelector('.modal__content')!;

    // закрытие по крестику
    const closeBtn = this.modalElement.querySelector('.modal__close');
    closeBtn?.addEventListener('click', () => {
      this.close();                    // сразу закрываем
      events.emit('modal:close', {});  // и шлём событие
    });

    // закрытие по клику вне контента (по фону)
    this.modalElement.addEventListener('click', (event) => {
      if (event.target === this.modalElement) {
        this.close();                    // закрываем
        events.emit('modal:close', {});  // и шлём событие
      }
    });
  }

  open(content: HTMLElement) {
    this.contentElement.replaceChildren(content);
    this.modalElement.classList.add('modal_active');

    events.emit('modal:open', {});
  }

  close() {
    this.modalElement.classList.remove('modal_active');
    this.contentElement.replaceChildren();
  }
}
