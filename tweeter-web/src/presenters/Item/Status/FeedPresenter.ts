import { StatusItemPresenter } from "./StatusItem";

export class FeedPresenter extends StatusItemPresenter {
  public itemDescription = "status items";
  public doLoadMoreItems = this.statusService.loadMoreFeedItems.bind(this);
}
