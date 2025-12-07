import { events } from './Events';
import { ensureElement } from '../../utils/utils';

export class Modal {
  protected modalElement: HTMLElement;
  protected contentElement: HTMLElement;

  constructor() {
    this.modalElement = ensureElement<HTMLElement>('.modal');
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.modalElement);

    // закрытие по крестику
    const closeBtn = ensureElement<HTMLButtonElement>('.modal__close', this.modalElement);
    closeBtn.addEventListener('click', () => {
      this.close();
      events.emit('modal:close', {});
    });

    // закрытие по клику вне контента (по фону)
    this.modalElement.addEventListener('click', (event) => {
      if (event.target === this.modalElement) {
        this.close();
        events.emit('modal:close', {});
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
