import { FakeData, FollowBidirectionalCount, PagedData, User, UserDTO } from "tweeter-shared";
import { AuthService } from "./AuthService";
import { FollowDAO } from "../dao/interface/FollowDAO";

export type PagedUserData = PagedData<UserDTO>;

export class FollowService {

  constructor(
    private authService: AuthService,
    private followDao: FollowDAO,
  ) { }

  public async follow(
    token: string,
    userToFollow: UserDTO,
  ): Promise<FollowBidirectionalCount> {
    await this.authService.assertToken(token);

    const actingUserAlias = "FAKE_ALIAS";
    console.warn("🏴‍☠️ Look up the alias of the user of the auth token");
    await this.followDao.addFollow(userToFollow.alias, actingUserAlias);

    return this.getBidirectionalCount(token, userToFollow);
  };

  public async unfollow(
    token: string,
    userToUnfollow: UserDTO,
  ): Promise<FollowBidirectionalCount> {
    await this.authService.assertToken(token);

    const actingUserAlias = "FAKE_ALIAS";
    console.warn("🏴‍☠️ Look up the alias of the user of the auth token");
    await this.followDao.addFollow(userToUnfollow.alias, actingUserAlias);

    return this.getBidirectionalCount(token, userToUnfollow);
  };

  private async getBidirectionalCount(
    token: string,
    otherUser: UserDTO,
  ): Promise<FollowBidirectionalCount> {
    await this.authService.assertToken(token);
    const followxStats = await this.followDao.getFollowStats(otherUser.alias);
    return [followxStats.followers, followxStats.followees];
  }

  public async getFollowerCount(
    token: string,
    user: UserDTO,
  ): Promise<number> {
    const [followers, _followees] = await this.getBidirectionalCount(token, user);
    return followers;
  };

  public async getFolloweeCount(
    token: string,
    user: UserDTO
  ): Promise<number> {
    const [_followers, followees] = await this.getBidirectionalCount(token, user);
    return followees;
  };

  public async getIsFollowerStatus(
    token: string,
    user: UserDTO,
    selectedUser: UserDTO
  ): Promise<boolean> {
    await this.authService.assertToken(token);
    return this.followDao.getIsFollower(selectedUser.alias, user.alias);
  };

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<PagedUserData> {
    await this.authService.assertToken(token);
    return this.getFakeData(userAlias, pageSize, lastItem);
  };

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<PagedUserData> {
    await this.authService.assertToken(token);
    return this.getFakeData(userAlias, pageSize, lastItem);
  };

  private async getFakeData(
    userAlias: string,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<PagedUserData> {
    const [users, hasMore] = await FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
    const dtos = users.map(u => u.dto);
    return [dtos, hasMore];
  }
}
