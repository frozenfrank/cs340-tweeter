import { User } from "tweeter-shared";
import UserItem from "../userItem/UserItem";
import ItemScroller from "./ItemScroller";
import { ItemScrollerProps } from "./ItemScrollerHook";

const UserItemScroller = (props: ItemScrollerProps<User>) => {
  return (
    <ItemScroller
      presenterGenerator={props.presenterGenerator}
      makeItem={item => <UserItem value={item}></UserItem>}>
    </ItemScroller>
  );
};

export default UserItemScroller;
