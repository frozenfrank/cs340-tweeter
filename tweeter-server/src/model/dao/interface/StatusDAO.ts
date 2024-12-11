import { PagedData, StatusDTO } from "tweeter-shared";
import { FeedStoryDTO } from "../../dto/FeedStoryDTO";

export type PagedStatusData = PagedData<StatusDTO>;

export interface StatusDAO {
  /** Public API Endpoint that begins Create Status processing. Returns to posting user within 1 second. */
  createStatus(status: StatusDTO): Promise<void>;
  /** Internal architecture role that downloads followers and distributes posting work to separate posting lambdas. */
  fetchAndSpawnPosters(feedItem: FeedStoryDTO): Promise<void>;
  /** Internally responsible for posting the status to the feeds of a portion of followers. */
  postStatusToFollowers(feedItem: FeedStoryDTO, followers: string[]): Promise<void>;

  getStoryPage( alias: string, pageSize: number, lastItem: StatusDTO|null): Promise<PagedStatusData>;
  getFeedPage(  alias: string, pageSize: number, lastItem: StatusDTO|null): Promise<PagedStatusData>;
}
