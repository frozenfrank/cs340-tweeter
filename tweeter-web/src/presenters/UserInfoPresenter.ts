import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { LoadingPresenter, LoadingView, MessageView } from "./Presenter";

export interface UserInfoView extends LoadingView, MessageView {
  setIsFollower(isFollower: boolean): void;
  setFollowerCount(count: number): void;
  setFolloweeCount(count: number): void;
}

export class UserInfoPresenter extends LoadingPresenter<UserInfoView, FollowService> {
  override buildService() { return new FollowService(); }

  public setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    return this.doTryOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(authToken, currentUser, displayedUser)
        );
      }
    }, "determine follower status");
  };

  public setNumbFollowees = this.setNumFollowx.bind(
    this, this.view.setFolloweeCount, this.service.getFolloweeCount, "get followees count");

  public setNumbFollowers = this.setNumFollowx.bind(
    this, this.view.setFollowerCount, this.service.getFollowerCount, "get followers count");

  private setNumFollowx(
    setX: (count: number) => void,
    getRemoteX: (auth: AuthToken, user: User) => Promise<number>,
    actionName: string,

    // These intentionally placed last to be left unbound after config
    authToken: AuthToken,
    displayedUser: User,
  ) {
    return this.doTryOperation<void>(
      async () => setX(await getRemoteX(authToken, displayedUser)),
      actionName);
  }


  public async followUser(authToken: AuthToken, displayedUser: User) {
    await this.doTryOperation(async () => {
      this.view.displayInfoMessage(`Following ${displayedUser.name}...`, 0);

      const [followerCount, followeeCount] = await this.service.follow(
        authToken!,
        displayedUser!
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "follow user");

    this.view.clearLastInfoMessage();
  }

  public async unfollowUser(authToken: AuthToken, displayedUser: User) {
    await this.doTryOperation(async () => {
      this.view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.service.unfollow(
        authToken,
        displayedUser
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "unfollow user");

    this.view.clearLastInfoMessage();
  }
}
