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

```mermaid
---
title: Story Service
---
classDiagram

class StatusService
class ItemScroller~ItemType~ {
    # ReactNode makeItem()
}
ItemScroller <|-- StatusItemScroller
StatusItem *-- Post

class Presenter~V~ {
    - view V
    # doTryOperation()
}
class ServicePresenter~V, U~ {
    - service U
}

Presenter <|-- ServicePresenter
ServicePresenter <|-- LoadingPresenter

LoadingPresenter <|-- PostStatusPresenter

```
