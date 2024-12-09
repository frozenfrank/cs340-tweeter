import { PagedData, StatusDTO } from "tweeter-shared";
import { FeedStoryDTO } from "../../dto/FeedStoryDTO";

export type PagedStatusData = PagedData<StatusDTO>;

export interface StatusDAO {
  /** At a minimum, schedules the status for creation. */
  createStatus(status: StatusDTO): Promise<void>;
  /** Posts a status the the feed of all {@linkcode followers}. */
  postStatusToFollowers(feedItem: FeedStoryDTO, followers: string[]): Promise<void>;

  getStoryPage( alias: string, pageSize: number, lastItem: StatusDTO|null): Promise<PagedStatusData>;
  getFeedPage(  alias: string, pageSize: number, lastItem: StatusDTO|null): Promise<PagedStatusData>;
}
