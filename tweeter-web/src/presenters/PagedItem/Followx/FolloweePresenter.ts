import { FollowxPresenter } from "./Followx";

export class FolloweePresenter extends FollowxPresenter {
  protected override itemDescription = "followees";
  protected override doLoadMoreItems = this.service.loadMoreFollowees.bind(this);
}
