# Story Service UML Diagram

## Prompt
A UML class diagram demonstrating your program's story service (however you get a set of statuses to display for a user's story).
The diagram should include major attributes, operations, and relationships between the classes throughout the process of executing the service.
The diagram should consist of the view, presenter, service, and domain classes that are relevant to the service.
If you have other classes that are important in implementing the service, include them in the diagram.
Include enough details to give the reader an understanding of your design's overall structure, but do not include every detail.
Including too much detail clutters the diagram and harms its readability.
If we want more details, we can always look at your source code.

## Diagram

### Domain Models Class Diagram

```mermaid

---
title: Tweeter — Domain Model Class Diagram
---
classDiagram

%% ######################
%% ### Domain Objects ###
%% ######################

namespace DomainObjects {
    class AuthToken {
        +string token
        +number timestamp
        +string alias
        +Generate(alias) AuthToken$
        +fromJson() AuthToken$
        +toJson() string
    }
    class User {
        +string firstName
        +string lastName
        +string alias
        +string imageUrl
        +string hashedPassword
    }

    class Status {
        +string post
        +User user
        +number timestamp
        +PostSegment[] segments
        +get formattedDate() string
    }
    class PostSegment {
        +string text
        +number startPosition
        +number endPosition
        +PostSegmentType type
    }
    class PostSegmentType {
        <<enumeration>>
        Text
        Alias
        URL
        Newline
    }
}

Status *-- "1.." PostSegment
PostSegment *-- "1" PostSegmentType

```

### Story Service Class Diagram

```mermaid
---
title: Tweeter — Story Service Class Diagram
---
classDiagram

%% ##########################################
%% ### Presenters and their relationships ###
%% ##########################################

namespace BasePresenters {
    class Presenter~V~ {
        <<Abstract>>
        +get view() V
        #doTryOperation()
    }
    class ServicePresenter~V, U~ {
        <<Abstract>>
        +get service() U
    }
    class PagedItemPresenter~T, U~ {
        <<Abstract>>
        +loadMoreItems(authToken, userAlias)
        +reset()
        #itemDescription*
        #doLoadMoreItems()*
        -pageSize int
        -lastItem T
        -pageSize int
    }
}

%% I would organize this to the tail of the file, but that messes with the rendering of the diagram
ItemScrollerHook --> PagedItemPresenter

Presenter <|-- ServicePresenter
ServicePresenter <|-- PagedItemPresenter

%% #########################################
%% ### Scrollers and their relationships ###
%% #########################################

namespace ItemScrollers {
    class ItemScroller~T~ {
        <<JSX>>
        -presenterGenerator(view)
    }
    class ItemScrollerHook~T~ {
        <<Hook>>
        -presenterGenerator(view)
        +T[] items
        +loadMoreItems()
        +bool hasMoreItems
    }
    class StatusItemScroller {
        <<JSX>>
    }
}

ItemScroller <|-- StatusItemScroller
StatusItemScroller *-- "*" StatusItem
ItemScroller *-- "1" ItemScrollerHook
StatusItem *-- "1" Post
StatusItem : +status Status
Post : +status Status

<<JSX>> StatusItem
<<JSX>> Post

%% ###############################################
%% ### (Some) Services and their relationships ###
%% ###############################################

namespace Services {
    class StatusService {
        +loadMoreFeedItems()
        +loadMoreStoryItems()
        +postStatus()
    }
}


%% ################################
%% ### Connecting Relationships ###
%% ################################

class StatusItemPresenter
<<Abstract>> StatusItemPresenter

PagedItemPresenter <|-- StatusItemPresenter
StatusItemPresenter <|.. StoryPresenter
StatusItemPresenter <|.. FeedPresenter

StatusService <.. StatusItemPresenter

```
