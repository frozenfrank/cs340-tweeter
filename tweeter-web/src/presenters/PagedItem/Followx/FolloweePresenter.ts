import { FollowxPresenter } from "./Followx";

export class FolloweePresenter extends FollowxPresenter {
  protected itemDescription = "followees";
  protected doLoadMoreItems = this.service.loadMoreFollowees.bind(this);
}
