# Work List

This file contained my working progress counter to help me keep track of all the phase requirements.

## Previous Milestone Fixes

- [x] Items indicated on my repo issue board

## Database Population

- [x] Register 10000 users
  - [x] Upload a few more small sized profile pictures
  - [x] Use a round robin of my already uploaded profile pictures
  - [x] Prepare upload script
  - [x] Increase WCU limit on Follows table
  - [x] Run script
  - [x] Decrease WCU limit on Follows table

## Processing Architecture

- [x] Install post status queue
  - [x] Consider batch read follower aliases?
  - [x] Write follower aliases in chunks to processing queue
  - [x] Create queue
- [x] Install post status processing queue
  - [x] Fiddle with asynchronous levels
  - [x] Create lambda for reading from queue
  - [x] Install intentional backoff (not needed)

## Verify Performance

- [x] Perceived post status latency is < 1 second
- [x] New status finishes processing in < 120 seconds
- [x] Individual feed returns in < 1 second

### Review AWS region distribution

| State | Resource | Original Region | Updated region | Notes |
| -- | -------------  | -------- | ---------- | -----
| ✅ | Lambda         | us-east-1 | us-west-2 | Update `upload-lambdas.sh` and `update-layers.sh` to write to an arbitrary region. |
| ✅ | Lambda Layer   | us-east-1 | us-west-2 | Create a new lambda layer in a new region. |
| ✅ | Dynamo         | us-west-2 | us-west-2 | _Correct._ |
| ✅ | S3             | us-east-1 | us-west-2 | Create new bucket and update URLs. |
| ✅ | API Gateway    | us-east-1 | us-west-2 | Export API as OpenAI 3.0 with API Gateway extensions. Manually update lambdas to use `us-west-2` versions. |
| ✅ | SQS Queues     | us-west-2 | us-west-2 | _Correct._ |

## Testing

- [x] Create automated post status integration test
- [x] Consider disabling or deleting previous integration tests (for this class, not life)

**Pass off with TAs before 5pm**

## Tricky Resolutions

1. `403 AuthToken Missing` message from API Gateway
    - I had left off a base path which resulted in hitting the wrong endpoints.
    - The default behavior is to throw the `403` error, which was really not helpful.
    - c.f. `8bfde614176bfa03fbdf53635f5b520d76b54fef`
2. `undefined` values in SQS processing
    - Messy relationship between objects and JSON string.
    - I hadn't deserialized the JSON strings properly.
3. Disappearing call to `DynamoTableDAO.send()`
    - It came down to a missing `await` keyword.
    - I had installed a helper function at the root level for my SQS parsing,
      but that function didn't await the promise it launched off.
    - This lead to the lambda exiting as soon as any of the threads finished.
      Since the `client.send()` was slow, the timeout typically fell on this line,
      but that was all misleading.
    - In actuality, it was the missing `await` at the root level.
      I finally found the root problem as I carefully recompleted the assignment
      from scratch and observed that all the code worked in the main function
      but broke when I moved it into the SQS functions. This helped me isolate
      the root cause.
    - c.f. `5bc8645`
