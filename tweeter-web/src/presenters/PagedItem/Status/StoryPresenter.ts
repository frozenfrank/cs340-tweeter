import { StatusItemPresenter } from "./StatusItem";

export class StoryPresenter extends StatusItemPresenter {
  public itemDescription = "story items";
  public doLoadMoreItems = this.service.loadMoreStoryItems.bind(this);
}
