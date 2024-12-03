import { UserDTO } from "tweeter-shared";
import { FollowxStats } from "../../dto/FollowxStats";
import { FollowDAO, PagedUserData } from "../interface/FollowDAO";
import { DynamoFollowRelationshipDAO, FollowEntity } from "./DynamoFollowRelationshipDAO";
import { DataPage } from "./DynamoDAO";

export class DynamoFollowDAO implements FollowDAO {
  private relationships = new DynamoFollowRelationshipDAO();

  getFollowStats(alias: string): Promise<FollowxStats> {
    throw new Error("Method not implemented.");
  }

  addFollow(followeeAlias: string, followerAlias: string): Promise<void> {
    return this.relationships.putFollow({
      follower_handle: followerAlias,
      followee_handle: followeeAlias,
    }).then();
  }
  removeFollow(followeeAlias: string, followerAlias: string): Promise<void> {
    return this.relationships.deleteFollow({
      follower_handle: followerAlias,
      followee_handle: followeeAlias,
    });
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

  private convertToPagedUserData(dataPage: DataPage<FollowEntity>, followers: boolean): PagedUserData {
    const users: UserDTO[] = dataPage.values.map((entity): UserDTO => {
      const alias = followers ? entity.follower_handle : entity.followee_handle;
      const name = (followers ? entity.follower_name : entity.followee_name) || alias;

      // TODO: I'll need to actually fetch this information rather than force it into the wrong shape
      return {
        firstName: name,
        lastName: name,
        alias,
        imageUrl: "",
        passwordHash: ""
      }
    });
    return [users, dataPage.hasMorePages];
  }

}
