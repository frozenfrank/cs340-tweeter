import { PagedData, UserDTO } from "tweeter-shared";
import { DataPage } from "../../../model/dto/DataPage";
import { FollowxStats } from "../../dto/FollowxStats";
import { FollowEntity } from "../dynamo/DynamoFollowRelationshipDAO";

export type PagedUserData = PagedData<UserDTO>;

export interface FollowDAO {
  /** Returns statistics pertaining to the total followers/followees of a user. */
  getFollowStats(alias: string): Promise<FollowxStats>;

  /** Records a new follow entry. */
  addFollow(followeeAlias: string, followerAlias: string): Promise<void>;

  /** Records a new follow entry. Succeeds when the relationship no longer exists. */
  removeFollow(followeeAlias: string, followerAlias: string): Promise<void>;

  /** Reports whether the {@linkcode followerAlias} is actually a follower of {@linkcode followeeAlias}. */
  getIsFollower(followeeAlias: string, followerAlias: string): Promise<boolean>;

  getFollowersPage(alias: string, pageSize: number, lastItem: UserDTO|null): Promise<PagedUserData>;
  getFolloweesPage(alias: string, pageSize: number, lastItem: UserDTO|null): Promise<PagedUserData>;

  /** Returns only the list of followers without additional information. */
  listFollowers(alias: string, pageSize: number, lastItem: FollowEntity|null): Promise<DataPage<FollowEntity>>;
}
