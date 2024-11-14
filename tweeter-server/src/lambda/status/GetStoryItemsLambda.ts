import { PagedItemRequest, PagedItemResponse, StatusDTO } from "tweeter-shared";
import { buildStatusService } from "../helper/factory";
import { packageResponse } from "../helper/helper";

export const handler = async (request: PagedItemRequest<StatusDTO>): Promise<PagedItemResponse<StatusDTO>> => {
  const service = buildStatusService();
  const [userDTO, hasMore] = await service.loadMoreStoryItems(request.token, request.userAlias, request.pageSize, request.lastItem);
  return packageResponse({
    items: userDTO,
    hasMore,
  });
};
