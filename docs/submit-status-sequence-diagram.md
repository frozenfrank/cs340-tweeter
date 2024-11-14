# Submit Status Sequence Diagram

An expanded, and layer-detailed sequence diagram portraying the transformations
that a status undertakes as it is transferred from the client to the server.

Individual layers are depicted without merging together to emphasize the **modularity**
and flexibility which this system supports. Changes can be introduced at any of the
provided layers to control and adjust the behavior of the entire product.

## Sequence Diagram

```mermaid
---
title: Tweeter — Send Status Entire Sequence Diagram
---
sequenceDiagram

%% CREDIT: Colors generated with https://www.fffuel.co/pppalette/

box rgb(255,191,223) Client
participant psc as «UI»<br>PostStatus Component
participant psp as «Client»<br>PostStatus Presenter
participant ss as «Client»<br>Status Service
participant sf as «Client»<br>Server Facade
participant cc as «Client»<br>Client Communicator
end

box rgb(142,173,204) Amazon
participant gate as «Amazon»<br>API Gateway
end

box rgb(173,204,142) Amazon Hosted — Server
participant lambda as «Server»<br>Lambda Func
participant sss as «Server»<br>Status Service
%% participant dao as «Server»<br>DAO
end

box rgb(142,173,204) Amazon
participant db as «Amazon»<br>DynamoDb
end

%% Begin interaction
note left of psc: User fires<br>submitPost()
activate psc

%% Within a Try Block
psc->>+psp: doPostStatus()
psp->>+psp: doTryOperation()
note over psc,psp: Presenter passes info to UI<br>via Observer pattern.
psp->>+psc: setIsLoading(true)
psc-->>-psp: void
psp->>+psc: displayInfoMessage()
psc->>-psp: void

    %% Begin traversing the layers to send to compute
    note over psp,cc: Begin layered descent to where work happens.
    psp->>+ss: postStatus(<br>AuthToken, Status)
    ss->>+sf: postStatus(<br>AuthToken, Status)
    sf->>+sf: doPost(PostStatusRequest)
    sf->>+cc: doPost(REQ)

        %% HTTP Internet
        note right of cc: Request over the internet
        cc->>+gate: HTTP POST /status/post<br>PostStatusRequest
        gate->>+lambda: handler(PostStatusRequest)

            %% Work happens
            lambda->>+sss: postStatus(token, status)
            note over sss,db: Actual work will happen here.<br>Store post in table and <br> distribute to followers.<br><br>Additional DAO layers will exist <br>to facilitate communication here.
            sss->>+db: getAuthToken()
            db-->>-sss: AuthToken

            break when AuthToken is invalid
                sss-->>gate: throw new Error('Bad Request')
                gate-->>cc: 400 Bad Request
                cc-->>psp: throw new Error('Client communicator failed: Bad Request')
                psp->>+psc: displayErrorMessage()
                psc-->>-psp: void
                psp-->>psp: void
            end

            sss->>db: savePost()
            loop Every follower
            sss->>db: addFeedEntry()
            end
            sss-->>-lambda: void
        
        lambda-->>-gate: TweeterResponse
        note right of cc: Response over the internet    
        gate-->>-cc: 200 TweeterResponse

    cc-->>-sf: RES
    sf-->>-sf: TweeterResponse
    sf-->>-ss: TweeterResponse
    ss-->>-psp: void
    %% End layer traversal

%% Signs of completion only occur on success
psp->>+psc: setPost()
psc-->>-psp: void
psp->>+psc: displayInfoMessage()
psc-->>-psp: void
psp-->>-psp: void
note over psp: Catch all errors here. Log <br>exceptional flows and proceed.
psp->>+psc: setIsLoading(false)
psc-->>-psp: void

%% FINALLY, this happens no matter what
psp->>+psc: clearLastInfoMessage()
psc-->>-psp: void
psp-->>-psc: void
note left of psc: Processing is complete

deactivate psc
```
