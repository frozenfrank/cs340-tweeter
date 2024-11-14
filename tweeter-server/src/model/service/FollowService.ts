import { FakeData, FollowBidirectionalCount, PagedData, PagedUserData, User, UserDTO } from "tweeter-shared";

export class FollowService {

  public async follow(
    token: string,
    userToFollow: UserDTO,
  ): Promise<FollowBidirectionalCount> {
    // TODO: Fulfill actual behavior
    return this.getBidirectionalCount(token, userToFollow);
  };

  public async unfollow(
    token: string,
    userToUnfollow: UserDTO,
  ): Promise<FollowBidirectionalCount> {
    // TODO: Fulfill actual behavior
    return this.getBidirectionalCount(token, userToUnfollow);
  };

  private async getBidirectionalCount(
    token: string,
    otherUser: UserDTO,
  ): Promise<FollowBidirectionalCount> {
    return Promise.all([
      this.getFollowerCount(token, otherUser),
      this.getFolloweeCount(token, otherUser),
    ]);
  }

  public async getFollowerCount(
    token: string,
    user: UserDTO,
  ): Promise<number> {
    // TODO: Fulfill actual behavior
    return FakeData.instance.getFollowerCount(user.alias);
  };

  public async getFolloweeCount(
    token: string,
    user: UserDTO
  ): Promise<number> {
    // TODO: Fulfill actual behavior
    return FakeData.instance.getFolloweeCount(user.alias);
  };

  public async getIsFollowerStatus(
    token: string,
    user: UserDTO,
    selectedUser: UserDTO
  ): Promise<boolean> {
    // TODO: Fulfill actual behavior
    return FakeData.instance.isFollower();
  };

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<PagedUserData> {
    return this.getFakeData(userAlias, pageSize, lastItem);
  };

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<PagedUserData> {
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
