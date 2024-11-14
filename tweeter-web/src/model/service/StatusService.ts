import { AuthToken, PagedData, Status } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService {

  constructor(private server: ServerFacade) { }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<PagedData<Status>> {
    return this.server.loadMoreFeedItems({
      token: authToken.token, userAlias,
      pageSize, lastItem,
    });
  };

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<PagedData<Status>>  {
    return this.server.loadMoreStoryItems({
      token: authToken.token, userAlias,
      pageSize, lastItem,
    });
  };


  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    await this.server.postStatus({
      token: authToken.token,
      status: newStatus.dto,
    });
  };

}
