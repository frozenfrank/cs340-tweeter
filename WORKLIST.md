# Work List

This file contained my working progress counter to help me keep track of all the phase requirements.

## Data Access Layer

- [x] Define DAOs
  - [x] AuthDAO
  - [x] UserDAO
  - [x] FollowDAO
  - [x] ImageDAO
  - [x] StatusDAO
- [x] use DAOs
  - [x] AuthDAO
    - [x] Store alias in AuthToken
  - [x] UserDAO
  - [x] FollowDAO
  - [x] ImageDAO
  - [x] StatusDAO
- [x] Implement DAOs
  - [x] AuthDAO
  - [x] UserDAO
    - [x] Provide implementation
    - [x] Install Bcrypt
  - [x] FollowDAO
    - [x] Basic CRUD operations
    - [x] Getting pages of followx
    - [x] Follow stats
    - [x] Provide the rest of the user data
  - [x] ImageDAO
  - [x] StatusDAO
- [x] Use Abstract Factory pattern
- [x] Remove entirely FakeData
- [x] Verify compliance with [User & session data](https://byu.instructure.com/courses/27157/pages/course-project-2) requirements


## Database

- [x] Create DynamoDb tables/indexes
- [x] Organize S3 bucket for uploading images

## Population

- [ ] Populate at least 10 items (follows, posts, etc...)
- [x] Upload new lambdas to AWS

## Testing

- [ ] Verify error responses work
  - Test failed login

**Pass off with TAs before 5pm**
