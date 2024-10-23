import { StatusItemPresenter } from "./StatusItem";

export class FeedPresenter extends StatusItemPresenter {
  protected override itemDescription = "status items";
  protected override doLoadMoreItems = this.service.loadMoreFeedItems.bind(this);
}
