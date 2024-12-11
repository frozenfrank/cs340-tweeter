
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { PagedData, StatusDTO } from "tweeter-shared";
import { DataPage } from "../../../model/dto/DataPage";
import { FeedStoryDTO } from "../../dto/FeedStoryDTO";
import { FollowEntity } from "../../dto/FollowEntity";
import { FollowDAO } from "../interface/FollowDAO";
import { QueueClient } from "../interface/QueueClient";
import { PagedStatusData, StatusDAO } from "../interface/StatusDAO";
import { DynamoTableDAO } from "./DynamoDAO";
import { PostStatusProcessingRequest } from "../../../lambda/status/PostStatusProcessingRequest";

export class DynamoStatusDAO extends DynamoTableDAO<FeedStoryDTO> implements StatusDAO {
  private storyTableName = "tweeter-story";
  private feedTableName = "tweeter-feed";
  protected tableName = this.storyTableName;

  private aliasAttr = "alias";
  private timestampAttr = "timestamp_unique";

  private MAX_PENDING_PROMISES = 50;

  constructor(
    private followDao: FollowDAO,
    private postQueue: QueueClient,
    private postProcessingQueue: QueueClient,
  ) { super(); }

  /** Public API Endpoint that begins Create Status processing. Returns to posting user within 1 second. */
  createStatus(status: StatusDTO): Promise<void> {
    const start = new Date;
    const promises: Promise<unknown>[] = [];

    // Post to poster's story
    const feedItem = this.makeFeedStoryItem(status);
    promises.push(this.putItem(feedItem, this.storyTableName));

    // Kick off additional distributions
    promises.push(this.postQueue.sendJsonMessage(feedItem));

    const end = new Date();
    console.log(`Finished queuing status processing in ${(+end - +start)/1000} seconds.`);
    return Promise.all(promises).then();
  }

  /** Internal architecture role that downloads followers and distributes posting work to separate posting lambdas. */
  async fetchAndSpawnPosters(feedItem: FeedStoryDTO): Promise<void> {
    const start = new Date;

    const alias = feedItem.alias;
    let totalFollowers = 0;
    const promises: Promise<unknown>[] = [];

    const onbatch = (followers: string[]): void => {
      totalFollowers += followers.length;
      const message: PostStatusProcessingRequest = {
        feedItem: feedItem,
        toFollowerAliases: followers,
      };
      promises.push(this.postProcessingQueue.sendJsonMessage(message));
    };
    await this.getFollowersOf(alias, 100, onbatch);

    await Promise.all(promises);
    console.log(`Finished awaiting ${promises.length} promises`);

    const end = new Date();
    console.log(`Finished spawning posters for ${totalFollowers} followers of ${alias} in ${(+end - +start)/1000} seconds.`);
  }

  /** Responsible for posting the status to the feeds of a portion of followers. */
  postStatusToFollowers(feedItem: FeedStoryDTO, followers: string[]): Promise<void> {
    return this.postStatusToFeeds(feedItem, followers);
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

  /** Returns the followers, optionally feeding a callback with one page at a time.
   *  When {@linkcode onbatch} is provided, an empty list will be returned from the function. */
  private async getFollowersOf(alias: string, batchSize = 100, onbatch?: (followersBatch: string[]) => void): Promise<string[]> {
    const followerAliases: string[] = [];

    onbatch ||= ((followers) => followerAliases.push(...followers));

    let lastItem: FollowEntity|undefined = undefined;
    let dataPage: DataPage<FollowEntity>;
    do {
      dataPage = await this.followDao.listFollowers(alias, batchSize, lastItem || null);
      lastItem = dataPage.values[dataPage.values.length-1];
      onbatch(dataPage.values.map(follow => follow.follower_handle));
    } while (dataPage.hasMorePages);

    return followerAliases;
  }

  private async postStatusToFeeds(feedItem: FeedStoryDTO, followers: string[]): Promise<void> {
    let promises: Promise<unknown>[] = [];
    for (const follower of followers) {
      // TODO: Convert to batch write
      promises.push(this.putItem({...feedItem, alias: follower}, this.feedTableName));
      if (promises.length >= this.MAX_PENDING_PROMISES) {
        await Promise.all(promises);
        promises.length = 0;
      }
    }
    await Promise.all(promises);
  }

  /** Requires a special StatusDTO which has the {@linkcode timestamp_unique} field populated. */
  getFeedPage(alias: string, pageSize: number, lastItem: StatusDTO | null): Promise<PagedData<StatusDTO>> {
    return this.getFeedItems(alias, pageSize, lastItem, this.feedTableName);
  }

  /** Requires a special StatusDTO which has the {@linkcode timestamp_unique} field populated. */
  getStoryPage(alias: string, pageSize: number, lastItem: StatusDTO | null): Promise<PagedData<StatusDTO>> {
    return this.getFeedItems(alias, pageSize, lastItem, this.storyTableName);
  }


  private readDataPage(command: QueryCommand): Promise<PagedStatusData> {
    return this.readPagedQueryCommand(command)
      .then(p => [p.values.map(f => ({...f.status, timestamp_unique: f.timestamp_unique })), p.hasMorePages]);
  }


  private getFeedItems(alias: string, pageSize: number, lastItem: StatusDTO | null, tableName: string): Promise<PagedData<StatusDTO>> {
    const command = new QueryCommand({
      TableName: tableName,
      Limit: pageSize,
      KeyConditionExpression: this.aliasAttr + " = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      ScanIndexForward: false,
      ExclusiveStartKey: !lastItem ? undefined : this.makeKey(alias, lastItem.timestamp_unique!),
    });

    return this.readDataPage(command);
  }

  private makeKey(alias: string, timestamp_unique: string) {
    if (!timestamp_unique) {
      throw new Error(`Cannot generate DynamoStatusDAO unique key without a timestamp_unique field.`);
    }
    return {
      [this.aliasAttr]: alias,
      [this.timestampAttr]: timestamp_unique,
    }
  }

}
