import { AuthToken, User } from "tweeter-shared";

export interface UserItemView {
  addItems(newItems: User[]): void;
  displayErrorMessage(message: string): void;
}

export abstract class UserItemPresenter {

  private PAGE_SIZE = 10;
  private _hasMoreItems = true;
  private lastItem: User | null = null;

  protected abstract itemDescription: string;

  public constructor(
    private _view: UserItemView,
  ) { }

  get view() { return this._view; }
  get hasMoreItems() { return this._hasMoreItems; }

  protected abstract doLoadMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]>;

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
