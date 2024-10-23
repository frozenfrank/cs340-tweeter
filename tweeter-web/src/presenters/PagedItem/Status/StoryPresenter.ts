import { StatusItemPresenter } from "./StatusItem";

export class StoryPresenter extends StatusItemPresenter {
  protected override itemDescription = "story items";
  protected override doLoadMoreItems = this.service.loadMoreStoryItems.bind(this);
}
