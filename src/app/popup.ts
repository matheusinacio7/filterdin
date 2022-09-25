export class Popup {
  private readonly changeSomethingButton: HTMLButtonElement;

  constructor() {
    this.changeSomethingButton = document.getElementById('changeSomething') as HTMLButtonElement;
  }

  addEventListener<K extends keyof Popup.PopupEventListener>(event: K, listener: Popup.PopupEventListener[K]) {
    const handlers = {
      [Popup.PopupEvent.ChangeSomething]: this.handleAddSomethingListener.bind(this),
    };

    handlers[event](listener);
  }

  private handleAddSomethingListener(callback: () => void) {
    this.changeSomethingButton.addEventListener('click', callback);
  }
}

export namespace Popup {
  export enum PopupEvent {
    ChangeSomething,
  };

  export type PopupEventListener = {
    [PopupEvent.ChangeSomething]: () => void,
  };
}
