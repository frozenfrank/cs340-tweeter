import { User } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { ItemPresenter } from "./ItemPresenter";


export class FollowerPresenter extends ItemPresenter<User> {
  private followService = new FollowService();

  public itemDescription = "followers";
  public doLoadMoreItems = this.followService.loadMoreFollowers.bind(this);
}
