export interface View {
  displayErrorMessage(message: string): void;
}

export class Presenter<V extends View=View> {
  private _view: V;

  constructor(view: V) {
    this._view = view;
  }

  get view() { return this._view; }
}
