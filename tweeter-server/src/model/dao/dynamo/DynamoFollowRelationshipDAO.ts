import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DataPage } from "../../../model/dto/DataPage";
import { FollowEntity } from "../../dto/FollowEntity";
import { DynamoTableDAO } from "./DynamoDAO";

type FollowHandles = Pick<FollowEntity, "followee_handle" | "follower_handle">;


export class DynamoFollowRelationshipDAO extends DynamoTableDAO<FollowEntity> {
  protected override readonly tableName = "tweeter-follows";

  private readonly followerHandleAttr = "follower_handle";
  private readonly followeeHandleAttr = "followee_handle";
  private readonly followerNameAttr = "follower_name";
  private readonly followeeNameAttr = "followee_name";
  private readonly followeeIndexName = "follows-index";

  /**
   * Records a new
   * @param followee The person being followed
   * @param follower The person following another
   */
  putFollow(follow: FollowEntity): Promise<void> {
    return this.putItem(follow);
  }

  /** Get a particular follow relationship, or `null` if it doesn't exist. */
  getSomeFollow(followHandles: FollowHandles, consistentRead = false): Promise<FollowEntity|null> {
    return this.getItem(this.generateFollowKey(followHandles), consistentRead);
  }

  /** Updates the names of the follower and followee, if it exists, given their handles are provided. */
  updateFollow(withUpdatedFollowNames: FollowEntity): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: this.generateFollowKey(withUpdatedFollowNames),
      UpdateExpression: `set ${this.followeeNameAttr} = :fee, ${this.followerNameAttr} = :fer`,
      ExpressionAttributeValues: {
        ":fee": withUpdatedFollowNames.followee_handle,
        ":fer": withUpdatedFollowNames.follower_handle,
      },
      ReturnValues: "NONE",
    });

    return this.send(command).then();
  }

  /** Deletes the indicated "follow" relationship, if it exists. */
  deleteFollow(followHandles: FollowHandles): Promise<void> {
    return this.deleteItem(this.generateFollowKey(followHandles)).then();
  }

  /** Gets a single page of followees of a particular user. */
  getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<FollowEntity>> {
    const command = new QueryCommand({
      TableName: this.tableName,
      Limit: pageSize,
      KeyConditionExpression: this.followerHandleAttr + " = :fer",
      ExpressionAttributeValues: {
        ":fer": followerHandle,
      },
      ExclusiveStartKey: lastFolloweeHandle === undefined ? undefined : this.generateFollowKey({
        follower_handle: followerHandle,
        followee_handle: lastFolloweeHandle,
      }),
    });

    return this.readPagedQueryCommand(command);
  }

  /** Gets a single page of followers of a particular user. */
  getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<FollowEntity>> {
    const params = {
      TableName: this.tableName,
      Limit: pageSize,
      KeyConditionExpression: this.followeeHandleAttr + " = :fee",
      ExpressionAttributeValues: {
        ":fee": followeeHandle,
      },
      IndexName: this.followeeIndexName,
      ExclusiveStartKey: lastFollowerHandle === undefined ? undefined : this.generateFollowKey({
        followee_handle: followeeHandle,
        follower_handle: lastFollowerHandle,
      }),
    };
    const command = new QueryCommand(params);
    console.log(`DynamoFollowRelationshipDAO: getPageOfFollowers(). Very fine (${typeof  followeeHandle}; ${typeof pageSize}; ${typeof lastFollowerHandle}): ` + JSON.stringify(params));
    return this.readPagedQueryCommand(command);
  }

  private generateFollowKey(followHandles: FollowHandles): Record<string, any> {
    return {
      [this.followerHandleAttr]: followHandles.follower_handle,
      [this.followeeHandleAttr]: followHandles.followee_handle,
    };
  }

}
