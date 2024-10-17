import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "../Presenter";

export interface ItemView<T> extends View {
  addItems(newItems: T[]): void;
}

export abstract class ItemPresenter<T> extends Presenter<ItemView<T>> {

  private PAGE_SIZE = 10;
  private _hasMoreItems = true;
  private lastItem: T | null = null;

  protected abstract itemDescription: string;

  get hasMoreItems() { return this._hasMoreItems; }

  protected abstract doLoadMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: T | null
  ): Promise<[T[], boolean]>;

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.doLoadMoreItems(
        authToken!,
        userAlias,
        this.PAGE_SIZE,
        this.lastItem
      );

      this._hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load ${this.itemDescription} because of exception: ${error}`
      );
    }
  };

  reset() {
    this.lastItem = null;
    this._hasMoreItems = true;
  }

}
