import { FollowBidirectionalCount, UserDTO } from "tweeter-shared";
import { FollowDAO, PagedUserData } from "../dao/interface/FollowDAO";
import { AuthService } from "./AuthService";

export class FollowService {

  constructor(
    private authService: AuthService,
    private followDao: FollowDAO,
  ) { }

  public async follow(
    token: string,
    userToFollow: UserDTO,
  ): Promise<FollowBidirectionalCount> {
    const auth = await this.authService.assertToken(token);

    const actingUserAlias = auth.alias;
    await this.followDao.addFollow(userToFollow.alias, actingUserAlias);

    return this.getBidirectionalCount(token, userToFollow);
  };

  public async unfollow(
    token: string,
    userToUnfollow: UserDTO,
  ): Promise<FollowBidirectionalCount> {
    const auth = await this.authService.assertToken(token);

    const actingUserAlias = auth.alias;
    await this.followDao.removeFollow(userToUnfollow.alias, actingUserAlias);

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
    return this.followDao.getFollowersPage(userAlias, pageSize, lastItem);
  };

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<PagedUserData> {
    await this.authService.assertToken(token);
    return this.followDao.getFolloweesPage(userAlias, pageSize, lastItem);
  };
}
