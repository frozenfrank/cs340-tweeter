import { AuthToken } from "tweeter-shared";
import { ServicePresenter, View } from "../Presenter";

export interface PagedItemView<T> extends View {
  addItems(newItems: T[]): void;
}

export abstract class PagedItemPresenter<T, U> extends ServicePresenter<PagedItemView<T>, U> {

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
    return this.doTryOperation(async () => {
      const [newItems, hasMore] = await this.doLoadMoreItems(
        authToken!,
        userAlias,
        this.PAGE_SIZE,
        this.lastItem
      );

      this._hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, `load ${this.itemDescription}`);
  };

  reset() {
    this.lastItem = null;
    this._hasMoreItems = true;
  }

}
