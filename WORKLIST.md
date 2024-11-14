# Work List

This file contained my working progress counter to help me keep track of all the phase requirements.

## Lambdas

Orchestrate end-to-end functionality for 14 endpoints. Numbers represent the _current state_ of each endpoint, assuming all previous states have been completed. If they haven't, then multiple numbers indicate multiple remaining items.
* **User Service** (4)
  - [x] Register user [7]
  - [x] Login user [7]
  - [x] Logout user [7]
  - [x] Get user [7]
* **Follow Service** (7)
  - [x] Follow user [7]
  - [x] Unfollow user [7]
  - [x] Get followee count [7]
  - [x] Get follower count [7]
  - [x] Get is follower status [7]
  - [x] load more followers [7]
  - [x] load more followees [7]
* **Status service** (3)
  - [x] load more feed items [7]
  - [x] load more story items [7]
  - [x] post status [7]

Do the following for each of 14 endpoints. The numbers label the states.
1. ~Transform server service classes~
2. ~Prepare Login/Response Objects~
3. ~Test from API Gateway~
4. ~Define integration responses for all relevant HTTP status codes (200, 400, 500, etc)~
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
5. ~Provide description documentation in API Gateway~
6. ~Test from web application (later)~
7. **DONE**

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
- [x] Ensure no further references to `FakeData` in web

**Pass off with TAs before 5pm**

## Other
- [x] Export Swagger documentation
  - [x] Publish the documentation
  - [x] Download as swagger to turn in on Canvas
- [x] Write **integration** tests to verify the system is working properly (only the following; success only):
  - [x] Register
  - [x] Get Followers
  - [x] GetFollowingCount and/or GetFollowersCount
- [x] Sequence diagram showing _successful_ `postStatus()` operation
  * Include `client` and `server` objects
  * Include "API Gateway" bridging requests
  * Start with `submitPost()` and end with `displayInfoMessage()`
- [x] Turn in on Canvas
