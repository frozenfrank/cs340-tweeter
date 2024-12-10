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
  - [ ] Fiddle with asynchronous levels
  - [x] Create lambda for reading from queue
  - [ ] Install intentional backoff

## Verify Performance

- [x] Perceived post status latency is < 1 second
- [ ] New status finishes processing in < 120 seconds
- [x] Individual feed returns in < 1 second


| State | Resource | Current Region | Desired Region | Updated region |
| ----- | ----- | ----- | ----- | ----- |
| ✅ | Lambda | us-east-1 | us-west-2 | us-east-1 |
| ✅ | Lambda Layer | us-east-1 | us-west-2 | both |
| ✅ | Dynamo | us-west-2 | us-west-2 |
| 🟡 | S3 | us-east-1 | us-west-2 |
| ❌ | API Gateway | us-east-1 | us-west-2 |
| ✅ | SQS Queues | us-west-2 | us-west-2 | us-east-1 |

## Testing

- [ ] Create automated post status integration test
- [ ] Consider disabling or deleting previous integration tests (for this class, not life)

**Pass off with TAs before 5pm**
