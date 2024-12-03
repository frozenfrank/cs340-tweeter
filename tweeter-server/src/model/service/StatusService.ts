import { FakeData, PagedData, Status, StatusDTO } from "tweeter-shared";
import { AuthService } from "./AuthService";

type PagedStatusData = PagedData<StatusDTO>;

export class StatusService {

  constructor(
    private authService: AuthService,
  ) { }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<PagedStatusData> {
    await this.authService.assertToken(token);
    // NOTE: You should be able to complete all the things normally occurring in the house.
    return this.getPageOfStatuses(lastItem, pageSize);
  };

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<PagedStatusData>  {
    await this.authService.assertToken(token);
    // NOTE: You should be able to complete all the things normally occurring in the house.
    return this.getPageOfStatuses(lastItem, pageSize);
  };

  private async getPageOfStatuses(lastItem: StatusDTO | null, pageSize: number): Promise<PagedStatusData> {
    const [statuses, hasMore] = await this.doGetPageOfStatus(lastItem, pageSize);
    const statusDTOs = statuses.map(s => s.dto);
    return [statusDTOs, hasMore];
  }

  private async doGetPageOfStatus(lastItem: StatusDTO | null, pageSize: number): Promise<PagedData<Status>> {
    return FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem)!,
      pageSize);
  }


  public async postStatus(
    token: string,
    newStatus: StatusDTO
  ): Promise<void> {
    await this.authService.assertToken(token);
    // TODO: Implement method
  };

}
