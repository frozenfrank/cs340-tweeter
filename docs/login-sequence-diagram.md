# Login Sequence Diagram

## Prompt
A UML sequence diagram demonstrating what happens when a user successfully logs in.
* This diagram should start with the user initiating a login by pressing a button on the Login component.
* This diagram should at least span from the component to the Service and back (to the Listener/View).
* We have compiled a style guide of common errors to help you here.
* We have an example of a correct, unrelated, sequence diagram on the FAQ page.

## Diagram

```mermaid
---
title: Tweeter — Login Sequence Diagram
config:
  mirrorActors: false
---

sequenceDiagram

participant LoginComponent
participant LoginPresenter
participant UserService
participant FakeData

Note left of LoginComponent: User completes form<br>and click "Login"
activate LoginComponent
LoginComponent->>+LoginPresenter: isLoginDisabled(...)
LoginPresenter-->>-LoginComponent: false
LoginComponent->>+LoginPresenter: doLogin(alias, password, rememberMe)

%% Presenter Updates loading variable
note over LoginComponent,LoginPresenter: Call to UI occurs via View interface
LoginPresenter->>+LoginComponent: setIsLoading(true)
LoginComponent-->>-LoginPresenter: void
%% End presenter update loading

%% Service Handles login
LoginPresenter->>+UserService: login(alias, password)
UserService->>+FakeData: firstUser()
FakeData-->>-UserService: User
UserService->>+FakeData: authToken()
FakeData-->>-UserService: AuthToken
UserService-->>-LoginPresenter: [User, AuthToken]
note over UserService,FakeData: These objects are not abandoned.<br>They are preserved in <br>other data structures.
%% End Service login

%% Presenter finishes updating state
note over LoginComponent,LoginPresenter: Calls to UI occur via View interface
LoginPresenter->>+LoginComponent: updateUserInfo(User, User, AuthToken)
note right of LoginComponent: UI delegates this behavior<br> to UserInfoHook
LoginComponent-->>-LoginPresenter: void
LoginPresenter->>+LoginComponent: navigate(navigationUrl)
note right of LoginComponent: UI Delegates this behavior<br>to UseNavigateHook
LoginComponent-->>-LoginPresenter: void
%% End Presenter update state

%% Presenter Updates loading variable
LoginPresenter->>+LoginComponent: setIsLoading(false)
LoginComponent-->>-LoginPresenter: void
%% End presenter update loading

%% Presenter finishes
LoginPresenter-->>-LoginComponent: void

deactivate LoginComponent

```
