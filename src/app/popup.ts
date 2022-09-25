export class Popup {
  private readonly addFilterForm: HTMLFormElement;
  private readonly filterToAddField: HTMLInputElement;
  private readonly filterListElement: HTMLOListElement;
  private readonly listeners: {[K in keyof Popup.PopupEventListener]: Array<Popup.PopupEventListener[K]>};
  private readonly filters: Array<string>;

  constructor() {
    this.filterListElement = document.getElementById('filter-list') as HTMLOListElement;
    this.addFilterForm = document.getElementById('add-filter-form') as HTMLFormElement;
    this.filterToAddField = document.getElementById('filter-to-add') as HTMLInputElement;
    this.listeners = {
      [Popup.PopupEvent.ChangeSomething]: [],
      [Popup.PopupEvent.FilterAdded]: [],
      [Popup.PopupEvent.FilterDeleted]: [],
    };
    this.filters = [];
    this.setupListeners();
  }

  private setupListeners() {
    this.addFilterForm.addEventListener('submit', this.handleAddFilter.bind(this));
  }

  private handleAddFilter(event: SubmitEvent) {
    event.preventDefault();
    const filterText = this.filterToAddField.value;
    this.filters.push(filterText);
    const newFilter = this.createFilter(filterText);
    this.appendFilter(newFilter);
    this.listeners[Popup.PopupEvent.FilterAdded].forEach((listener) => {
      listener(filterText, this.filters);
    });
  }

  addEventListener<K extends keyof Popup.PopupEventListener>(event: K, listener: Popup.PopupEventListener[K]) {
    this.listeners[event].push(listener);
  }

  loadFilters(filters: Array<string>) {
    filters.forEach((filter) => {
      const newFilterElement = this.createFilter.bind(this)(filter);
      this.appendFilter.bind(this)(newFilterElement);
      this.filters.push(filter);
    });
  }

  private createFilter(filterText: string) {
    const filterElement = document.createElement('li');
    filterElement.dataset.value = filterText;

    const spanElement = document.createElement('span');
    spanElement.innerText = filterText;
    filterElement.appendChild(spanElement);

    const deleteFilterElementButton = document.createElement('button');
    deleteFilterElementButton.innerText = 'X';
    deleteFilterElementButton.addEventListener('click', () => {
      this.deleteFilter.bind(this)(filterElement);
    });
    filterElement.appendChild(deleteFilterElementButton);
    
    return filterElement;
  }

  private appendFilter(filterElement: HTMLLIElement) {
    this.filterListElement.appendChild(filterElement);
  }

  private deleteFilter(filterElement: HTMLLIElement) {
    const filterString = filterElement.dataset.value as string;
    this.filters.splice(this.filters.indexOf(filterString), 1);
    filterElement.parentElement?.removeChild(filterElement);
    this.listeners[Popup.PopupEvent.FilterDeleted].forEach((listener) => {
      listener(filterString, this.filters);
    });
  }
}

export namespace Popup {
  export enum PopupEvent {
    ChangeSomething,
    FilterAdded,
    FilterDeleted,
  };

  export type PopupEventListener = {
    [PopupEvent.ChangeSomething]: () => void,
    [PopupEvent.FilterAdded]: (addedFilter: string, allFilters: Array<string>) => void,
    [PopupEvent.FilterDeleted]: (deletedFilter: string, allRemainingFilters: Array<string>) => void,
  };
}
