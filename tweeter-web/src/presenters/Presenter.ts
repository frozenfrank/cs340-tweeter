/// ### Standard Presenter ###

export interface View {
  displayErrorMessage(message: string): void;
}

export interface MessageView extends View {
  clearLastInfoMessage(): void;
  displayInfoMessage(message: string, duration: number): void;
}

export class Presenter<V extends View> {
  private _view: V;

  constructor(view: V) {
    this._view = view;
  }

  get view() { return this._view; }

  /**
   * Performs an operation asynchronously and displays a user notification in the event of an error.
   *
   * @param operation A potentially asynchronous operation to perform which is liable to throw errors
   * @param actionName The name of the operation for error message display purposes. I.E. "load data"
   * @returns A promise with the result of the operation, or a void successful promise after an error message is displayed to the user.
   */
  protected async doTryOperation<T>(operation: () => Promise<T>, actionName: string): Promise<T | void> {
    try {
      return await operation();
    } catch (error) {
      this.view.displayErrorMessage(`Failed to ${actionName} because of exception: ${error}`);
    }
  }
}

/// ### Service Presenter ###

export abstract class ServicePresenter<V extends View, U> extends Presenter<V> {
  private _service = this.buildService();

  abstract buildService(): U;

  get service() { return this._service; }
}

/// ### Loading Presenter ###

export interface LoadingView extends View {
  setIsLoading(isLoading: boolean): void;
}

/**
 * Since we are not allowed to perform multiple-inheritance, we will assume
 * that every item loading data will be using a service to load it.
 */
export abstract class LoadingPresenter<V extends LoadingView, U> extends ServicePresenter<V, U> {
  protected override async doTryOperation<T>(...args: Parameters<Presenter<V>["doTryOperation"]>): Promise<T | void> {
    this.view.setIsLoading(true);
    await super.doTryOperation.apply(this, args);
    this.view.setIsLoading(false);
  }
}
