import { FeedStoryDTO } from "../../model/dto/FeedStoryDTO";

export interface PostStatusProcessingRequest {
  /** The constructed item to insert into the database. */
  feedItem: FeedStoryDTO;
  /** A list of known follower aliases to receive the particular status. */
  toFollowerAliases: string[];
}
