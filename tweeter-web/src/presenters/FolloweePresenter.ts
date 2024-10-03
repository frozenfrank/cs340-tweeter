import { User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { ItemPresenter } from "./ItemPresenter";


export class FolloweePresenter extends ItemPresenter<User> {
  private followService = new FollowService();

  public itemDescription = "followees";
  public doLoadMoreItems = this.followService.loadMoreFollowees.bind(this);
}
