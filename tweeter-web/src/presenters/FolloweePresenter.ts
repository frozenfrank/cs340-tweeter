import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter } from "./UserItemPresenter";


export class FolloweePresenter extends UserItemPresenter {
  private followService: FollowService = new FollowService();

  public itemDescription = "followees";
  public doLoadMoreItems = this.followService.loadMoreFollowees.bind(this);
}
