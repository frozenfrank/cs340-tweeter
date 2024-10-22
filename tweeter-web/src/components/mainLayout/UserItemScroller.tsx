import { User } from "tweeter-shared";
import UserItem from "../userItem/UserItem";
import ItemScroller from "./ItemScroller";
import { ItemScrollerProps } from "./ItemScrollerHook";

const UserItemScroller = (props: ItemScrollerProps<User>) => {
  return ItemScroller({
    ...props,
    makeItem: (item) => <UserItem value={item}></UserItem>,
  })
};

export default UserItemScroller;
