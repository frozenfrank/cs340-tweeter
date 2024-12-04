import { UserDTO } from "tweeter-shared";
import { FollowxStats } from "../../dto/FollowxStats";
import { FollowDAO, PagedUserData } from "../interface/FollowDAO";
import { UserDAO } from "../interface/UserDAO";
import { DataPage } from "../../../model/dto/DataPage";
import { DynamoFollowRelationshipDAO, FollowEntity } from "./DynamoFollowRelationshipDAO";
import { DynamoFollowStatsDAO } from "./DynamoFollowStatsDAO";

export class DynamoFollowDAO implements FollowDAO {
  private relationships = new DynamoFollowRelationshipDAO();
  private stats = new DynamoFollowStatsDAO();

  constructor(
    private userDao: UserDAO,
  ) { }

  getFollowStats(alias: string): Promise<FollowxStats> {
    return this.stats.getStats(alias);
  }

  addFollow(followeeAlias: string, followerAlias: string): Promise<void> {
    // TODO: Use a transaction to guarantee atomicity
    return Promise.all([
      this.stats.incrementValue(followeeAlias, true, 1),
      this.stats.incrementValue(followerAlias, false, 1),
      this.relationships.putFollow({
        follower_handle: followerAlias,
        followee_handle: followeeAlias,
      }),
    ]).then();
  }
  removeFollow(followeeAlias: string, followerAlias: string): Promise<void> {
    // TODO: Use a transaction to guarantee atomicity
    return Promise.all([
      this.stats.incrementValue(followeeAlias, true, -1),
      this.stats.incrementValue(followerAlias, false, -1),
      this.relationships.deleteFollow({
        follower_handle: followerAlias,
        followee_handle: followeeAlias,
      }),
    ]).then();
  }

  getIsFollower(followeeAlias: string, followerAlias: string): Promise<boolean> {
    return this.relationships.getSomeFollow({
      follower_handle: followerAlias,
      followee_handle: followeeAlias,
    }).then(followEntity => !!followEntity);
  }

  getFollowersPage(alias: string, pageSize: number, lastItem: UserDTO | null): Promise<PagedUserData> {
    return this.relationships.getPageOfFollowers(alias, pageSize, lastItem?.alias)
      .then(p => this.convertToPagedUserData(p, true));
  }
  getFolloweesPage(alias: string, pageSize: number, lastItem: UserDTO | null): Promise<PagedUserData> {
    return this.relationships.getPageOfFollowees(alias, pageSize, lastItem?.alias)
      .then(p => this.convertToPagedUserData(p, false));
  }

  listFollowers(alias: string, pageSize: number, lastItem: FollowEntity | null): Promise<DataPage<FollowEntity>> {
    return this.relationships.getPageOfFollowers(alias, pageSize, lastItem?.followee_name);
  }

  private convertToPagedUserData(dataPage: DataPage<FollowEntity>, followers: boolean): Promise<PagedUserData> {
    const alias_field = followers ? "follower_handle" : "followee_handle";
    const aliases = dataPage.values.map(u => u[alias_field]);
    return this.fetchUserData(aliases, dataPage.hasMorePages);
  }

  private async fetchUserData(aliases: string[], hasMoreData: boolean): Promise<PagedUserData> {
    const users = await Promise.all(
      aliases.map(alias => this.userDao.getByAlias(alias))
    );
    const existingUsers = users.filter(u => u) as UserDTO[];
    return [existingUsers, hasMoreData];
  }

}
