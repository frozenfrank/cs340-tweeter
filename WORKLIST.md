# Worklist

## Lambdas

Orchestrate end-to-end functionality for 14 endpoints. Numbers represent the _current state_ of each endpoint, assuming all previous states have been completed. If they haven't, then multiple numbers indicate multiple remaining items.
* **User Service** (4)
  - [ ] Register user [1]
  - [ ] Login user [1]
  - [ ] Logout user [1]
  - [ ] Get user [1]
* **Follow Service** (7)
  - [ ] Follow user [1]
  - [ ] Unfollow user [1]
  - [ ] Get followee count [3]
  - [ ] Get follower count [1]
  - [ ] Get is follower status [1]
  - [ ] load more followers [1]
  - [ ] load more followees [1]
* **Status service** (3)
  - [ ] load more feed items [1]
  - [ ] load more story items [1]
  - [ ] post status [1]

Do the following for each of 14 endpoints. The numbers label the states.
1. Transform server service classes
2. Test from API Gateway
3. Test from web application (later)
4. Provide description documentation in API Gateway
5. Define integration responses for all relevant HTTP status codes (200, 400, 500, etc)
6. Enable CORS for each error response
7. Provide the `Access-Control-Allow-Origin` header
8. DONE

Along the way
- [x] Create User DTOs
- [ ] Create Follow DTOs
- [ ] Create Status DTOs

## Client
- [ ] Introduce a network layer
  - [ ] Contains `Request` and `Response` objects that reflect the data transfer
  - [ ] Contains a `ServerFacade` with methods for every endpoint
  - [x] Contains a `ClientCommunicator` class that translates HTTP
- [ ] Update web services classes to call methods on `ServerFacade`
- [ ] Ensure no further references to `FakeData` in web

**Pass off with TAs before 5pm**

## Other
- [ ] Export Swagger documentation
  - [ ] Publish the documentation
  - [ ] Download as swagger to turn in on Canvas
- [ ] Write **integration** tests to verify the system is working properly (only the following; success only):
  - [ ] Register
  - [ ] Get Followers
  - [ ] GetFollowingCount and/or GetFollowersCount
- [ ] Sequence diagram showing _successful_ `postStatus()` operation
  * Include `client` and `server` objects
  * Include "API Gateway" bridging requests
  * Start with `submitPost()` and end with `displayInfoMessage()`
- [ ] Turn in on Canvas
