import { FollowxPresenter } from "./Followx";

export class FollowerPresenter extends FollowxPresenter {
  public itemDescription = "followers";
  public doLoadMoreItems = this.followService.loadMoreFollowers.bind(this);
}
