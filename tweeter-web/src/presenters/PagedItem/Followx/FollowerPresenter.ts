import { FollowxPresenter } from "./Followx";

export class FollowerPresenter extends FollowxPresenter {
  protected itemDescription = "followers";
  protected doLoadMoreItems = this.service.loadMoreFollowers.bind(this);
}
