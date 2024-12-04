
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { StatusDTO } from "tweeter-shared";
import { DataPage } from "../../../model/dto/DataPage";
import { FeedStoryDTO } from "../../dto/FeedStoryDTO";
import { FollowDAO } from "../interface/FollowDAO";
import { PagedStatusData, StatusDAO } from "../interface/StatusDAO";
import { DynamoDAO } from "./DynamoDAO";
import { FollowEntity } from "./DynamoFollowRelationshipDAO";

export class DynamoStatusDAO extends DynamoDAO<FeedStoryDTO> implements StatusDAO {
  private storyTableName = "tweeter-story";
  private feedTableName = "tweeter-feed";
  protected tableName = this.storyTableName;

  private aliasAttr = "alias";

  constructor(
    private followDao: FollowDAO,
  ) { super(); }


  async createStatus(status: StatusDTO): Promise<void> {
    const feedItem = this.makeFeedStoryItem(status);
    await this.putItem(feedItem, this.storyTableName);

    const followers = await this.getFollowersOf(status.user.alias);
    // TODO: Break this by posting in segments to queue
    this.postStatusToFeeds(feedItem, followers);
  }

  private makeFeedStoryItem(status: StatusDTO): FeedStoryDTO {
    const alias = status.user.alias;
    const timestamp = new Date(status.timestamp);
    return {
      alias: alias,
      timestamp_unique: timestamp.toISOString() + "--" + alias,
      status,
    };
  }

  private async getFollowersOf(alias: string): Promise<string[]> {
    const followerAliases: string[] = [];

    let lastItem: FollowEntity|undefined = undefined;
    let dataPage: DataPage<FollowEntity>;
    do {
      dataPage = await this.followDao.listFollowers(alias, 100, lastItem || null);
      lastItem = dataPage.values[dataPage.values.length];
      followerAliases.push(...dataPage.values.map(follow => follow.follower_handle));
    } while (dataPage.hasMorePages);

    return followerAliases;
  }

  private async postStatusToFeeds(feedItem: FeedStoryDTO, followers: string[]): Promise<void> {
    for (const follower of followers) {
      // TODO: Convert to batch write
      await this.putItem({...feedItem, alias: follower}, this.feedTableName);
      // TODO: Implement spaced backoff and wait to stay within write limit
    }
  }

  getFeedPage(alias: string, pageSize: number, lastItem: StatusDTO | null): Promise<PagedStatusData> {
    return this.getFeedItems(alias, pageSize, lastItem, this.feedTableName);
  }

  getStoryPage(alias: string, pageSize: number, lastItem: StatusDTO | null): Promise<PagedStatusData> {
    return this.getFeedItems(alias, pageSize, lastItem, this.storyTableName);
  }


  private readDataPage(command: QueryCommand): Promise<PagedStatusData> {
    return this.readPagedQueryCommand(command)
      .then(p => [p.values.map(f => f.status), p.hasMorePages]);
  }


  private getFeedItems(alias: string, pageSize: number, lastItem: StatusDTO | null, tableName: string): Promise<PagedStatusData> {
    const command = new QueryCommand({
      TableName: tableName,
      Limit: pageSize,
      KeyConditionExpression: this.aliasAttr + " = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      ExclusiveStartKey: !lastItem ? undefined : this.generateDefaultKey(lastItem.user.alias),
    });

    return this.readDataPage(command);
  }

}
