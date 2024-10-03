import { Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { ItemPresenter } from "./ItemPresenter";

export class FeedPresenter extends ItemPresenter<Status> {
  private statusService = new StatusService();

  public itemDescription = "status items";
  public doLoadMoreItems = this.statusService.loadMoreFeedItems.bind(this);
}
