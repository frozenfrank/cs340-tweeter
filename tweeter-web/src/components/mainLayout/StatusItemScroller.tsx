import InfiniteScroll from "react-infinite-scroll-component";
import { Status } from "tweeter-shared";
import StatusItem from "../statusItem/StatusItem";
import useItemScroller, { ItemScrollerProps } from "./ItemScrollerHook";


const StatusItemScroller = (props: ItemScrollerProps<Status>) => {
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
