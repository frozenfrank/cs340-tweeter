import {
  Follow,
  FollowBidirectionalCount,
  FollowDTO,
  PagedData,
  PagedItemRequest,
  PagedItemResponse,
  Status,
  StatusDTO,
  TweeterRequest,
  TweeterResponse,
  User,
  UserDTO,
  UserRequestSingle,
  ValueResponse
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
import { RudimentaryData } from "tweeter-shared/dist/model/net/response/ValueResponse";

export class ServerFacade {
  private SERVER_URL = "TODO: Set this value.";
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  private FOLLOW_BASE = "/follow";

  private upscaleStatus = (dto: StatusDTO | null)  => Status.fromDto(dto);
  private upscaleUser   = (dto: UserDTO | null)    => User.fromDto(dto);
  private upscaleFollow = (dto: FollowDTO | null)  => Follow.fromDto(dto);

  // ### Follow Service ###

  public follow(request: UserRequestSingle): Promise<FollowBidirectionalCount> {
    return this.executePostForValue(request, this.FOLLOW_BASE + "/add");
  }

  public unfollow(request: UserRequestSingle): Promise<FollowBidirectionalCount> {
    return this.executePostForValue(request, this.FOLLOW_BASE + "/remove");
  }

  public getFollowerCount(request: UserRequestSingle): Promise<number> {
    return this.executePostForValue(request, this.FOLLOW_BASE + "/count/followers");
  }

  public getFolloweeCount(request: UserRequestSingle): Promise<number> {
    return this.executePostForValue(request, this.FOLLOW_BASE + "/count/followees");
  }

  public getIsFollowerStatus(request: UserRequestSingle): Promise<number> {
    return this.executePostForValue(request, this.FOLLOW_BASE + "/is");
  }

  public loadMoreFollowers(request: PagedItemRequest<User>): Promise<PagedData<User>> {
    return this.executePagedItemRequest<User, UserDTO>(request, this.FOLLOW_BASE + "/list/followers", this.upscaleUser);
  }

  public loadMoreFollowees(request: PagedItemRequest<User>): Promise<PagedData<User>> {
    return this.executePagedItemRequest<User, UserDTO>(request, this.FOLLOW_BASE + "/list/followees", this.upscaleUser);
  }


  // ### Entry Points ###

  private async executePagedItemRequest<MODEL extends {}, DTO extends {}>(
    request: PagedItemRequest<MODEL>,
    endpoint: string,
    upscale: (dto: DTO) => MODEL|null,
  ): Promise<PagedData<MODEL>> {
    const flattenedRequest = this.flattenToDto(request) as unknown as PagedItemRequest<DTO>;
    const response = await this.doPost<PagedItemRequest<DTO>, PagedItemResponse<DTO>>(flattenedRequest, endpoint);
    if (!response.items) {
      throw new Error(`No items found`);
    }

    // Upscale back to client model classes
    const items = response.items.map(upscale) as MODEL[];
    return [items, response.hasMore];
  }

  private async executePostForValue<
    R extends TweeterRequest,
    T extends RudimentaryData
  >(request: R, endpoint: string): Promise<T> {
    const response = await this.doPost<R, ValueResponse<T>>(request, endpoint);
    return this.returnValue(response);
  }

  private async doPost<REQ extends TweeterRequest, RES extends TweeterResponse>(request: REQ, endpoint: string): Promise<RES> {
    request = this.flattenToDto(request);
    const response = await this.clientCommunicator.doPost<REQ,RES>(request, endpoint);
    this.rejectOnError(response);
    return response;
  }

  // ### Helpers ###

  /** Returns a new object with domain objects flattened into DTO objs.
   * Only works at the top level. */
  private flattenToDto<T extends {}>(obj: T): T {
    const out = {...obj} as T;
    for (const k in obj) {
      out[k] = (out[k] as any)?.dto ?? out[k];
    }
    return out;
  }

  private rejectOnError(response: TweeterResponse): void | never {
    if (!response.success) {
      console.error(response);
      throw new Error(response.message);
    }
  }

  private returnValue<T extends RudimentaryData>(response: ValueResponse<T>): T {
    return response.value;
  }
}
