import { User } from "tweeter-shared";
import { PagedItemPresenter } from "../PagedItemPresenter";
import { FollowService } from "../../../model/service/FollowService";

export abstract class FollowxPresenter extends PagedItemPresenter<User, FollowService> {
  override buildService() { return new FollowService(this.server); }
}
