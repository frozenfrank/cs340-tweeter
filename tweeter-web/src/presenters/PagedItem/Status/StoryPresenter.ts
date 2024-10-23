import { StatusItemPresenter } from "./StatusItem";

export class StoryPresenter extends StatusItemPresenter {
  protected itemDescription = "story items";
  protected doLoadMoreItems = this.service.loadMoreStoryItems.bind(this);
}
