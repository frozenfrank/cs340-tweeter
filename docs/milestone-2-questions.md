# Milestone 2 Documentation Questions

## Prompt
Answer the following questions:
1. Pick one place where you use the observer pattern. 
    * Which class was the subject?
    * Which class was the observer? 
    * Which layer did the subject belong to and which layer did the observer belong to? (Model, View, or Presenter layer)
1. Pick one place where you used generics. 
    * What class was it in? 
    * What classes can the generic type `T` be?
1. Pick one place where you used the template method pattern. 
    * Show the template method. What class is it in? 
    * Show the step of the algorithm that is deferred to the class's subclass. What class is it in?

## Answers

1. **Observer Pattern**
    * Demonstrated with the `LoadingPresenter (parent class of RegisterPresenter) <=> Register Component`
    * `LoadingPresenter` is the subject (presenter layer)
    * `Register` Componet is the observer (view layer)
    * Example:
        * ```ts
          export abstract class LoadingPresenter<V extends LoadingView, U> extends ServicePresenter<V, U> {
            protected override async doTryOperation<T>(...args: Parameters<Presenter<V>["doTryOperation"]>): Promise<T | void> {
              this.view.setIsLoading(true);                  // **NOTIFY OBSERVER**
              await super.doTryOperation.apply(this, args);
              this.view.setIsLoading(false);                 // **NOTIFY OBSERVER**
            }
          }
          ```
1. **Generics**
    * Demonstrated with `mockPresenter()`, a helper util introduced for testing purposes
        * It does not reside in a class, but in a util file to be used by test scripts
        * It uses two generic variables:
            * `V extends View` can be any subclass of the `View` class including: `MessageView`, `LoadingView`, `PagedItemView`, `LoginView`, etc...
            * `P extends Presenter<V>` much be a `Presenter` class which requires can accept the previously defined `V` type variable.
                * In the easy case, this is just the corresponding `Presenter` that accompanies a particular `View`.
                * Generically speaking, it could also accept some subclass of the corresponding `Presenter` as long as it can accept the particular subclass of `View` provided before.
        * Example:
            * ```ts
                /// tweeter-web/test/utils.ts
                export function mockPresenter<V extends View, P extends Presenter<V>>(presenterGenerator: (view: V) => P) {
                  // Prepare mock view
                  const mockPresenterView = mock<V>();
                  const mockStatusPresenterInstance = instance(mockPresenterView) as V;
                
                  // Prepare presenter spy
                  const presenterSpy = spy(presenterGenerator(mockStatusPresenterInstance));
                  const presenterInstance = instance(presenterSpy);
                
                  // Return results
                  return {mockPresenterView, presenterInstance, presenterSpy};
                }
              
                // USAGE
                const {mockPresenterView, presenterInstance, presenterSpy} 
                  = mockPresenter((view: RegisterView) => new RegisterPresenter(view));
              ```
1. **Template Method Pattern**
    * Demonstrated in `PagedItemPresenter` (inherited by the `FeedPresenter`, `StoryPresenter`, `FollowersPresenter`, etc...)
    * Template method example:
       * ```ts
          /// tweeter-web/src/presenters/PagedItem/PagedItemPresenter.ts
          public async loadMoreItems(authToken: AuthToken, userAlias: string) {
            return this.doTryOperation(async () => {
              const [newItems, hasMore] = await this.doLoadMoreItems(        // **DELEGATES TO AN ABSTRACT METHOD IMPLEMENTED BY CHILD CLASSES**
                authToken!,
                userAlias,
                this.pageSize,
                this.lastItem
              );
        
              this._hasMoreItems = hasMore;
              this.lastItem = newItems[newItems.length - 1];
              this.view.addItems(newItems);
            }, `load ${this.itemDescription}`);
          };
         ```
        * It resides in the `PagedItemPresenter` base class which is subclassed by every other paged item presenter.
    * Implemented step of template method example:
        * ```ts
          /// tweeter-web/src/presenters/PagedItem/Followx/FolloweePresenter.ts
          export class FolloweePresenter extends FollowxPresenter {
            protected override itemDescription = "followees";
            protected override doLoadMoreItems = this.service.loadMoreFollowees.bind(this);  // **IMPLEMENTS THE REQUIRED, ABSTRACT METHOD**
          }
          ```
        * ```ts
          /// tweeter-web/src/model/service/FollowService.ts
          // Target of the `.bind()` call above:
          public async loadMoreFollowees(
            authToken: AuthToken,
            userAlias: string,
            pageSize: number,
            lastItem: User | null
          ): Promise<[User[], boolean]> {
            return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
          };
          ```
        * This example is located in the `FolloweePresenter` class.
