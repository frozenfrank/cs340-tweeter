import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { User } from "tweeter-shared";
import { UserItemPresenter, UserItemView } from "../../presenters/UserItemPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import UserItem from "../userItem/UserItem";

interface Props {
  presenterGenerator: (view: UserItemView) => UserItemPresenter;
}

const UserItemScroller = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<User[]>([]);
  const [newItems, setNewItems] = useState<User[]>([]);

  const { displayedUser, authToken } = useUserInfo();

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  // Add new items whenever there are new items to add
  useEffect(() => {
    if(newItems.length) {
      setItems([...items, ...newItems]);
    }
  }, [newItems])

  const reset = async () => {
    setItems([]);
    setNewItems([]);
    items.length = 0;
    newItems.length = 0;
    presenter.reset();
  }

  const listener: UserItemView = {
    addItems: (newItems: User[]) => setNewItems(newItems),
    displayErrorMessage: (message: string) => displayErrorMessage(message),
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  const loadMoreItems = presenter.loadMoreItems.bind(presenter, authToken!, displayedUser!.alias);

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <UserItem value={item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default UserItemScroller;
