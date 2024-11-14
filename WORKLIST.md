# Worklist

## Lambdas

Orchestrate end-to-end functionality for 14 endpoints. Numbers represent the _current state_ of each endpoint, assuming all previous states have been completed. If they haven't, then multiple numbers indicate multiple remaining items.
* **User Service** (4)
  - [ ] Register user [5]
  - [ ] Login user [5]
  - [ ] Logout user [5]
  - [ ] Get user [5]
* **Follow Service** (7)
  - [ ] Follow user [5]
  - [ ] Unfollow user [5]
  - [ ] Get followee count [5]
  - [ ] Get follower count [5]
  - [ ] Get is follower status [5]
  - [ ] load more followers [5]
  - [ ] load more followees [5]
* **Status service** (3)
  - [ ] load more feed items [5]
  - [ ] load more story items [5]
  - [ ] post status [5]

Do the following for each of 14 endpoints. The numbers label the states.
1. ~Transform server service classes~
2. ~Prepare Login/Response Objects~
3. ~Test from API Gateway~
4. Define integration responses for all relevant HTTP status codes (200, 400, 500, etc)
  * Enable CORS while creating the resource
  * Add a "method" that correlates to the lambda function
  * Add the "Method responses" to the "POST" method
    * 400 — header: `Access-Control-Allow-Origin`
    * 500 — header: `Access-Control-Allow-Origin`
  * Click "Enable CORS" again on the "resource" (not method)
    * Select _all_ options: 4XX, 5XX, OPTIONS, and POST
  * Add the "Integration responses" to the "POST" method
    * **400**: `^\[Bad Request\].*`
    * **500**: `^\[Server Error\].*`
    * Add the header: `Access-Control-Allow-Origin '*'`
5. Provide description documentation in API Gateway
7. Test from web application (later)
8. DONE

Along the way
- [x] Create User DTOs
- [x] Create Follow DTOs
- [x] Create Status DTOs
- [x] Consider converting to `model.toDTO()` rather than `model.dto`.

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
