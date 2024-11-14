# Worklist

## Lambdas

Orchestrate end-to-end functionality for 14 endpoints. Numbers represent the _current state_ of each endpoint, assuming all previous states have been completed. If they haven't, then multiple numbers indicate multiple remaining items.
* **User Service** (4)
  - [ ] Register user [4]
  - [ ] Login user [4]
  - [ ] Logout user [4]
  - [ ] Get user [4]
* **Follow Service** (7)
  - [ ] Follow user [4]
  - [ ] Unfollow user [4]
  - [ ] Get followee count [4]
  - [ ] Get follower count [4]
  - [ ] Get is follower status [4]
  - [ ] load more followers [4]
  - [ ] load more followees [4]
* **Status service** (3)
  - [ ] load more feed items [4]
  - [ ] load more story items [2] X
  - [ ] post status [4]

Do the following for each of 14 endpoints. The numbers label the states.
1. ~Transform server service classes~
2. ~Prepare Login/Response Objects~
3. ~Test from API Gateway~
4. Test from web application (later)
5. Provide description documentation in API Gateway
6. Define integration responses for all relevant HTTP status codes (200, 400, 500, etc)
7. Enable CORS for each error response
8. Provide the `Access-Control-Allow-Origin` header
9. DONE

Along the way
- [x] Create User DTOs
- [x] Create Follow DTOs
- [x] Create Status DTOs
- [ ] Consider converting to `model.toDTO()` rather than `model.dto`.

## Client
- [x] Introduce a network layer
  - [x] Contains `Request` and `Response` objects that reflect the data transfer
  - [x] Contains a `ServerFacade` with methods for every endpoint
  - [x] Contains a `ClientCommunicator` class that translates HTTP
- [x] Update web services classes to call methods on `ServerFacade`
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
