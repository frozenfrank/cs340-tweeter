import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Status } from "tweeter-shared";
import { ItemPresenter, ItemView } from "../../presenters/ItemPresenter";
import StatusItem from "../statusItem/StatusItem";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";


interface Props {
  presenterGenerator: (view: ItemView<Status>) => ItemPresenter<Status>;
}

const StatusItemScroller = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<Status[]>([]);
  const [newItems, setNewItems] = useState<Status[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

  const { displayedUser, authToken } = useUserInfo();

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
  }, [displayedUser]);

  // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
  useEffect(() => {
    if(changedDisplayedUser) {
      loadMoreItems();
    }
  }, [changedDisplayedUser]);

  // Add new items whenever there are new items to add
  useEffect(() => {
    if(newItems) {
      setItems([...items, ...newItems]);
    }
  }, [newItems])

  const reset = async () => {
    setItems([]);
    setNewItems([]);
    presenter.reset();
    setChangedDisplayedUser(true);
  }

  const listener: ItemView<Status> = {
    addItems: newItems => setNewItems(newItems),
    displayErrorMessage: message => displayErrorMessage(message),
  };
  const [presenter] = useState(props.presenterGenerator(listener));

  const loadMoreItems = async () => {
    await presenter.loadMoreItems(authToken!, displayedUser!.alias);
    setChangedDisplayedUser(false);
  }

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
            <StatusItem status={item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
