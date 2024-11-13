import { FakeData, PagedData, Status, StatusDTO } from "tweeter-shared";

type PagedStatusData = PagedData<StatusDTO>;

export class StatusService {

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<PagedStatusData> {
    // NOTE: You should be able to complete all the things normally occurring in the house.
    return this.getPageOfStatuses(lastItem, pageSize);
  };

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<PagedStatusData>  {
    // NOTE: You should be able to complete all the things normally occurring in the house.
    return this.getPageOfStatuses(lastItem, pageSize);
  };

  private async getPageOfStatuses(lastItem: StatusDTO | null, pageSize: number): Promise<PagedStatusData> {
    return FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem)!,
      pageSize);
  }


  public async postStatus(
    token: string,
    newStatus: StatusDTO
  ): Promise<void> {
    // TODO: Implement method
  };

}
