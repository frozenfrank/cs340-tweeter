/**
 * Represents a "follows" relationship between two users, in the DB.
 *
 * Key terms:
 * * **Follower**: The user who is following another user
 * * **Followee**: The user is is being followed by another user
 *
 * In this table, relationships between any pair of handlers
 * (`follower_handle` <-> `followee_handle`) can be retrieved.
 */
export interface FollowEntity {
  /** **Primary key** The handle of the follower. */
  "follower_handle": string;
  /** The name of the follower. */
  "follower_name"?: string;

  /** **Sort key** The handler of the followee. */
  "followee_handle": string;
  /** The name of the followee. */
  "followee_name"?: string;
}
