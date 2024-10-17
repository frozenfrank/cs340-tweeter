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

  public async setIsFollowerStatus(
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

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ) {
    return this.doTryOperation(async () => {
      this.view.setFolloweeCount(await this.service.getFolloweeCount(authToken, displayedUser));
    }, "get followees count");
  };

  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ) {
    return this.doTryOperation(async () => {
      this.view.setFollowerCount(await this.service.getFollowerCount(authToken, displayedUser));
    }, "get followers count");
  };


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
