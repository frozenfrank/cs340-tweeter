import { Status } from "tweeter-shared";
import StatusItem from "../statusItem/StatusItem";
import ItemScroller from "./ItemScroller";
import { ItemScrollerProps } from "./ItemScrollerHook";

const StatusItemScroller = (props: ItemScrollerProps<Status>) => {
  return ItemScroller({
    ...props,
    makeItem: item => <StatusItem status={item}></StatusItem>,
  });
};

export default StatusItemScroller;
