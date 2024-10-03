import { Status } from "tweeter-shared";
import StatusItem from "../statusItem/StatusItem";
import ItemScroller from "./ItemScroller";
import { ItemScrollerProps } from "./ItemScrollerHook";

const StatusItemScroller = (props: ItemScrollerProps<Status>) => {
  return (
    <ItemScroller
      presenterGenerator={props.presenterGenerator}
      makeItem={item => <StatusItem status={item}></StatusItem>}>
    </ItemScroller>
  );
};

export default StatusItemScroller;
