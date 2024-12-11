import { StatusDTO } from "tweeter-shared";
import { PagedStatusData, StatusDAO } from "../dao/interface/StatusDAO";
import { FeedStoryDTO } from "../dto/FeedStoryDTO";
import { AuthService } from "./AuthService";


export class StatusService {

  constructor(
    private authService: AuthService,
    private statusDao: StatusDAO,
  ) { }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<PagedStatusData> {
    await this.authService.assertToken(token);
    return this.statusDao.getFeedPage(userAlias, pageSize, lastItem);
  };

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<PagedStatusData>  {
    await this.authService.assertToken(token);
    return this.statusDao.getStoryPage(userAlias, pageSize, lastItem);
  };


  public async postStatus(
    token: string,
    newStatus: StatusDTO
  ): Promise<void> {
    await this.authService.assertToken(token);
    await this.statusDao.createStatus(newStatus);
  };

  public postStatusSpawn(feedItem: FeedStoryDTO): Promise<void> {
    // NOTE: No required authentication because it is not publicly accessible
    return this.statusDao.fetchAndSpawnPosters(feedItem);
  }

  public postStatusProcessing(
    feedItem: FeedStoryDTO,
    followers: string[],
  ): Promise<void> {
    // NOTE: No required authentication because it is not publicly accessible
    return this.statusDao.postStatusToFollowers(feedItem, followers);
  }

}
