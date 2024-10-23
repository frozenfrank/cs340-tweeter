import { StatusItemPresenter } from "./StatusItem";

export class FeedPresenter extends StatusItemPresenter {
  protected itemDescription = "status items";
  protected doLoadMoreItems = this.service.loadMoreFeedItems.bind(this);
}
