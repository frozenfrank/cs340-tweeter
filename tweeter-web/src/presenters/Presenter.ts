export interface View {
  displayErrorMessage(message: string): void;
}

export interface MessageView extends View {
  clearLastInfoMessage(): void;
  displayInfoMessage(message: string, duration: number): void;
}

export class Presenter<V extends View=View> {
  private _view: V;

  constructor(view: V) {
    this._view = view;
  }

  get view() { return this._view; }
}
