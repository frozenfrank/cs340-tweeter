import { StatusItemPresenter } from "./StatusItem";

export class StoryPresenter extends StatusItemPresenter {
  public itemDescription = "story items";
  public doLoadMoreItems = this.statusService.loadMoreStoryItems.bind(this);
}
