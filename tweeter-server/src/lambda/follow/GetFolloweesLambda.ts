import { PagedItemResponse, PagedItemRequest, UserDTO } from "tweeter-shared";
import { buildFollowService } from "../helper/factory";
import { packageResponse } from "../helper/helper";

export const handler = async (request: PagedItemRequest<UserDTO>): Promise<PagedItemResponse<UserDTO>> => {
  const service = buildFollowService();
  const [userDTO, hasMore] = await service.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);
  return packageResponse({
    items: userDTO,
    hasMore,
  });
};
