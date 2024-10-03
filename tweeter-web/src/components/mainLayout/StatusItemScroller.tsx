import InfiniteScroll from "react-infinite-scroll-component";
import { Status } from "tweeter-shared";
import { ItemPresenter, ItemView } from "../../presenters/ItemPresenter";
import StatusItem from "../statusItem/StatusItem";
import useItemScroller from "./ItemScrollerHook";


interface Props {
  presenterGenerator: (view: ItemView<Status>) => ItemPresenter<Status>;
}

const StatusItemScroller = (props: Props) => {
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
            <StatusItem status={item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
