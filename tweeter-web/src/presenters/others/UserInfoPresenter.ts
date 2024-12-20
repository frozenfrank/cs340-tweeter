import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { LoadingPresenter, LoadingView, MessageView } from "../Presenter";

export interface UserInfoView extends LoadingView, MessageView {
  setIsFollower(isFollower: boolean): void;
  setFollowerCount(count: number): void;
  setFolloweeCount(count: number): void;
}

export class UserInfoPresenter extends LoadingPresenter<UserInfoView, FollowService> {
  override buildService() { return new FollowService(this.server); }

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

  /// ### Set Num FollowX ###

  public setNumbFollowees = this.setNumFollowx.bind(
    this, x => this.view.setFolloweeCount(x), this.service.getFolloweeCount.bind(this.service), "get followees count");

  public setNumbFollowers = this.setNumFollowx.bind(
    this, x => this.view.setFollowerCount(x), this.service.getFollowerCount.bind(this.service), "get followers count");

  private setNumFollowx(
    setX: (count: number) => void,
    getRemoteX: (auth: AuthToken, user: User) => Promise<number>,
    actionName: string,

    // These intentionally placed last to be left unbound after setup
    authToken: AuthToken, displayedUser: User,
  ) {
    return this.doTryOperation<void>(
      async () => setX(await getRemoteX(authToken, displayedUser)),
      actionName);
  }

  /// ### Change Follow Status ###

  public followUser = this.changeFollowStatus.bind(
    this, this.service.follow.bind(this.service), "Following", "follow user", true);

  public unfollowUser = this.changeFollowStatus.bind(
    this, this.service.unfollow.bind(this.service), "Unfollowing", "unfollow user", false);

  private async changeFollowStatus(
    makeChange: (auth: AuthToken, user: User) => Promise<[number, number]>,
    actionVerbSentenceCase: string, actionName: string, endAsFollower: boolean,

    // Last to remain unbound
    authToken: AuthToken, displayedUser: User
  ) {
    await this.doTryOperation(async () => {
      this.view.displayInfoMessage(`${actionVerbSentenceCase} ${displayedUser.name}...`, 0);

      const [followerCount, followeeCount] = await makeChange(authToken, displayedUser);

      this.view.setIsFollower(endAsFollower);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, actionName);

    this.view.clearLastInfoMessage();
  }
}
