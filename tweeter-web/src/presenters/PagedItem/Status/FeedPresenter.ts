import { StatusItemPresenter } from "./StatusItem";

export class FeedPresenter extends StatusItemPresenter {
  public itemDescription = "status items";
  public doLoadMoreItems = this.service.loadMoreFeedItems.bind(this);
}
