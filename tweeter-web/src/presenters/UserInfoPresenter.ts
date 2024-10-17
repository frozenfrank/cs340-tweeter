import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsLoading(isLoading: boolean): void;
  setIsFollower(isFollower: boolean): void;
  setFollowerCount(count: number): void;
  setFolloweeCount(count: number): void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService = new FollowService();

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
          await this.followService.getIsFollowerStatus(authToken, currentUser, displayedUser)
        );
      }
    }, "determine follower status");
  };

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ) {
    return this.doTryOperation(async () => {
      this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
    }, "get followees count");
  };

  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ) {
    return this.doTryOperation(async () => {
      this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
    }, "get followers count");
  };


  public async followUser(authToken: AuthToken, displayedUser: User) {
    await this.doTryOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.follow(
        authToken!,
        displayedUser!
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "follow user");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }

  public async unfollowUser(authToken: AuthToken, displayedUser: User) {
    await this.doTryOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.unfollow(
        authToken,
        displayedUser
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "unfollow user");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }
}
