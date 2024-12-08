import {
  Follow,
  FollowBidirectionalCount,
  FollowDTO,
  GetUserRequest,
  GetUserResponse,
  LoginUserRequest,
  PagedData,
  PagedItemRequest,
  PagedItemResponse,
  PostStatusRequest,
  RegisterUserRequest,
  SignedInUserResponse,
  Status,
  StatusDTO,
  TweeterRequest,
  TweeterResponse,
  User,
  UserDTO,
  UserRequestDouble,
  UserRequestSingle,
  ValueResponse
} from "tweeter-shared";
import { RudimentaryData } from "tweeter-shared/dist/model/net/response/ValueResponse";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://tjjqh0dxyg.execute-api.us-east-1.amazonaws.com/dev";
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  private FOLLOW_BASE = "/follow";
  private USER_BASE = "/user";
  private STATUS_BASE = "/status";

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

  public getIsFollowerStatus(request: UserRequestDouble): Promise<boolean> {
    return this.executePostForValue(request, this.FOLLOW_BASE + "/is");
  }

  public loadMoreFollowers(request: PagedItemRequest<User>): Promise<PagedData<User>> {
    return this.executePagedItemRequest<User, UserDTO>(request, this.FOLLOW_BASE + "/list/followers", this.upscaleUser);
  }

  public loadMoreFollowees(request: PagedItemRequest<User>): Promise<PagedData<User>> {
    return this.executePagedItemRequest<User, UserDTO>(request, this.FOLLOW_BASE + "/list/followees", this.upscaleUser);
  }

  // ### User Service ###

  public registerUser(request: RegisterUserRequest): Promise<SignedInUserResponse> {
    return this.executeAndExpectSignedInUser(request, this.USER_BASE + "/register");
  }

  public loginUser(request: LoginUserRequest): Promise<SignedInUserResponse> {
    return this.executeAndExpectSignedInUser(request, this.USER_BASE + "/login");
  }

  public logoutUser(request: TweeterRequest): Promise<TweeterResponse> {
    return this.doPost(request, this.USER_BASE + "/logout");
  }

  public async getUser<REQ extends GetUserRequest>(request: REQ): Promise<User | null> {
    const response = await this.doPost<REQ, GetUserResponse>(request, this.USER_BASE + "/get");
    return this.upscaleUser(response.user);
  }

  private async executeAndExpectSignedInUser<REQ>(request: REQ, endpoint: string): Promise<SignedInUserResponse> {
    // @ts-expect-error The registration requests do not have the 'token' expected by `TweeterRequest`.
    const result = await this.doPost<REQ, SignedInUserResponse>(request, endpoint);
    return {
      ...result,
      user: this.upscaleUser(result.user) as User
    };
  }

  // ### Status Service ###

  public loadMoreFeedItems(request: PagedItemRequest<Status>): Promise<PagedData<Status>> {
    return this.executePagedItemRequest<Status, StatusDTO>(request, this.STATUS_BASE + "/feed", this.upscaleStatus);
  }

  public loadMoreStoryItems(request: PagedItemRequest<Status>): Promise<PagedData<Status>> {
    return this.executePagedItemRequest<Status, StatusDTO>(request, this.STATUS_BASE + "/story", this.upscaleStatus);
  }

  public postStatus(request: PostStatusRequest): Promise<TweeterResponse> {
    return this.doPost(request, this.STATUS_BASE + "/post");
  }


  // ### Helper Entry Points ###

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

  // ### Internal Helpers ###

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
