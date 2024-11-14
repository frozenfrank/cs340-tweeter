import { UserDTO } from "../dto/UserDTO";

export type PagedData<T> = [T[], boolean];

export type PagedUserData = PagedData<UserDTO>;

export type FollowBidirectionalCount = [followerCount: number, followeeCount: number];
