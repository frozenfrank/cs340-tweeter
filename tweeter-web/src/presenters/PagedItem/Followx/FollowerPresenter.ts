import { FollowxPresenter } from "./Followx";

export class FollowerPresenter extends FollowxPresenter {
  protected override itemDescription = "followers";
  protected override doLoadMoreItems = this.service.loadMoreFollowers.bind(this);
}
