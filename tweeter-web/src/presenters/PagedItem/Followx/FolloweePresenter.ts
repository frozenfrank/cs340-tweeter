import { FollowxPresenter } from "./Followx";

export class FolloweePresenter extends FollowxPresenter {
  public itemDescription = "followees";
  public doLoadMoreItems = this.followService.loadMoreFollowees.bind(this);
}
