import { FollowxPresenter } from "./Followx";

export class FolloweePresenter extends FollowxPresenter {
  public itemDescription = "followees";
  public doLoadMoreItems = this.service.loadMoreFollowees.bind(this);
}
