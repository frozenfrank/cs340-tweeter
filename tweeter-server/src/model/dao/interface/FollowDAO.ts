import { FollowxStats } from "../../dto/FollowxStats";

export interface FollowDAO {
  /** Returns statistics pertaining to the total followers/followees of a user. */
  getFollowStats(alias: string): Promise<FollowxStats>;

  /** Records a new follow entry. */
  addFollow(followeeAlias: string, followerAlias: string): Promise<void>;

  /** Records a new follow entry. Succeeds when the relationship no longer exists. */
  removeFollow(followeeAlias: string, followerAlias: string): Promise<void>;

  /** Reports whether the {@linkcode followerAlias} is actually a follower of {@linkcode followeeAlias}. */
  getIsFollower(followeeAlias: string, followerAlias: string): Promise<boolean>;
}
