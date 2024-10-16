import { User } from "tweeter-shared";
import { ItemPresenter } from "../ItemPresenter";
import { FollowService } from "../../../model/service/FollowService";

export abstract class FollowxPresenter extends ItemPresenter<User> {
  protected followService = new FollowService();
}
