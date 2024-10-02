import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter } from "./UserItemPresenter";


export class FollowerPresenter extends UserItemPresenter {
  private followService: FollowService = new FollowService();

  public itemDescription = "followers";
  public doLoadMoreItems = this.followService.loadMoreFollowers.bind(this);
}
