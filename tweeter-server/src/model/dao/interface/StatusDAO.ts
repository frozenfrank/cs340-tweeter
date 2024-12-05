import { PagedData, StatusDTO } from "tweeter-shared";

export type PagedStatusData = PagedData<StatusDTO>;

export interface StatusDAO {
  /** At a minimum, schedules the status for creation. */
  createStatus(status: StatusDTO): Promise<void>;

  getStoryPage( alias: string, pageSize: number, lastItem: StatusDTO|null): Promise<PagedStatusData>;
  getFeedPage(  alias: string, pageSize: number, lastItem: StatusDTO|null): Promise<PagedStatusData>;
}
