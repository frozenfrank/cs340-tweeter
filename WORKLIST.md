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
- [ ] Implement DAOs
  - [ ] AuthDAO
  - [ ] UserDAO
    - [ ] Install Bcrypt
  - [ ] FollowDAO
    - [ ] Basic CRUD operations
    - [ ] Getting pages of followx
    - [ ] Provide the rest of the user data
  - [ ] ImageDAO
  - [ ] StatusDAO
- [ ] Use Abstract Factory pattern
- [x] Remove entirely FakeData
- [ ] Verify compliance with [User & session data](https://byu.instructure.com/courses/27157/pages/course-project-2) requirements


## Database

- [ ] Create DynamoDb tables/indexes
- [ ] Organize S3 bucket for uploading images

## Population

- [ ] Populate at least 10 items (follows, posts, etc...)
- [ ] Upload new lambdas to AWS

## Testing

- [ ] Verify error responses work
  - Test failed login

**Pass off with TAs before 5pm**
