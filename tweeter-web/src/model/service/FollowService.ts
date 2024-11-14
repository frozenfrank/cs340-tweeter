import { AuthToken, User, FakeData, FollowBidirectionalCount, PagedData } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";


export class FollowService {

  constructor(private server: ServerFacade) { }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<FollowBidirectionalCount> {
    return this.server.follow({
      user: userToFollow,
      token: authToken.token
    });
  };

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<FollowBidirectionalCount> {
    return this.server.unfollow({
      token: authToken.token, user: userToUnfollow,
    });
  };

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.server.getFollowerCount({
      token: authToken.token, user
    });
  };

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.server.getFolloweeCount({
      token: authToken.token, user
    });
  };

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return this.server.getIsFollowerStatus({
      token: authToken.token, user: user, user2: selectedUser,
    });
  };

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<PagedData<User>> {
    return this.server.loadMoreFollowers({
      token: authToken.token, userAlias, pageSize, lastItem
    });
  };

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<PagedData<User>> {
    return this.server.loadMoreFollowees({
      token: authToken.token, userAlias, pageSize, lastItem
    });
  };
}
