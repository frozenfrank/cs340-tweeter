import { Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { ItemPresenter } from "./ItemPresenter";

export class StoryPresenter extends ItemPresenter<Status> {
  private statusService = new StatusService();

  public itemDescription = "story items";
  public doLoadMoreItems = this.statusService.loadMoreStoryItems.bind(this);
}
