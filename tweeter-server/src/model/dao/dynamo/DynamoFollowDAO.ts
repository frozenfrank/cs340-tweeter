import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  PutCommandOutput,
  QueryCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";
import { DataPage, DynamoDAO } from "./DynamoDAO";


/**
 * Represents a "follows" relationship between two users.
 *
 * Key terms:
 * * **Follower**: The user who is following another user
 * * **Followee**: The user is is being followed by another user
 *
 * In this table, relationships between any pair of handlers
 * (`follower_handle` <-> `followee_handle`) can be retrieved.
 */
interface Follow {
  /** **Primary key** The handle of the follower. */
  "follower_handle": string;
  /** The name of the follower. */
  "follower_name": string;

  /** **Sort key** The handler of the followee. */
  "followee_handle": string;
  /** The name of the followee. */
  "followee_name": string;
}

type FollowHandles = Pick<Follow, "followee_handle" | "follower_handle">;


export class FollowDAO extends DynamoDAO<Follow> {
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
  async putFollow(follow: Follow): Promise<PutCommandOutput> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        ...follow
      }
    });

    return this.send(command);
  }

  /** Get a particular follow relationship, or `null` if it doesn't exist. */
  async getSomeFollow(followHandles: FollowHandles, consistentRead = false): Promise<Follow|null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: this.generateFollowKey(followHandles),
      ConsistentRead: consistentRead,
    });

    return this.sendGetCommand(command);
  }

  /** Updates the names of the follower and followee, if it exists, given their handles are provided. */
  async updateFollow(withUpdatedFollowNames: Follow): Promise<void> {
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

    this.send(command);
  }

  /** Deletes the indicated "follow" relationship, if it exists. */
  async deleteFollow(followHandles: FollowHandles): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: this.generateFollowKey(followHandles),
      ReturnValues: "NONE",
    });

    this.send(command);
  }

  /** Gets a single page of followees of a particular user. */
  getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<Follow>> {
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
  getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<Follow>> {
    const command = new QueryCommand({
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
    });

    return this.readPagedQueryCommand(command);
  }


  override readItem(item: Record<string, any>): Follow {
    return item as Follow; // Easy for now because the `Follow` interface exactly matches the database.
  }

  private generateFollowKey(followHandles: FollowHandles): Record<string, any> {
    return {
      [this.followerHandleAttr]: followHandles.follower_handle,
      [this.followeeHandleAttr]: followHandles.followee_handle,
    };
  }

}
