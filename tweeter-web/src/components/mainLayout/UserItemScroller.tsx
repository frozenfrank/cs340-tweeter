import InfiniteScroll from "react-infinite-scroll-component";
import { User } from "tweeter-shared";
import { ItemPresenter, ItemView } from "../../presenters/ItemPresenter";
import UserItem from "../userItem/UserItem";
import useItemScroller from "./ItemScrollerHook";

interface Props {
  presenterGenerator: (view: ItemView<User>) => ItemPresenter<User>;
}

const UserItemScroller = (props: Props) => {
  const {items, loadMoreItems, hasMoreItems} = useItemScroller(props.presenterGenerator);

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={hasMoreItems}
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
