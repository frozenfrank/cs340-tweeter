import { useEffect, useState } from "react";
import { PagedItemPresenter, PagedItemView } from "../../presenters/PagedItem/PagedItemPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";

export interface ItemScrollerProps<T> {
  presenterGenerator: (view: PagedItemView<T>) => PagedItemPresenter<T, any>;
}

interface ItemScroller<T> {
  items: T[];
  hasMoreItems: boolean;
  loadMoreItems(): Promise<void>;
}

const useItemScroller = <T,U>(presenterGenerator: (view: PagedItemView<T>) => PagedItemPresenter<T, U>): ItemScroller<T> => {

  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<T[]>([]);
  const [newItems, setNewItems] = useState<T[]>([]);

  const { displayedUser, authToken } = useUserInfo();

  // Initialize the data whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  // Add new items whenever there are new items to add
  useEffect(() => {
    if(newItems.length) {
      setItems([...items, ...newItems]);
    }
  }, [newItems]);

  const reset = async () => {
    setItems([]);
    setNewItems([]);
    items.length = 0;
    newItems.length = 0;
    presenter.reset();
  }

  const listener: PagedItemView<T> = {
    addItems: newItems => setNewItems(newItems),
    displayErrorMessage: message => displayErrorMessage(message),
  };
  const [presenter] = useState(() => presenterGenerator(listener));

  const loadMoreItems = presenter.loadMoreItems.bind(presenter, authToken!, displayedUser!.alias);

  return {
    items,
    loadMoreItems,
    hasMoreItems: presenter.hasMoreItems,
  };
};

export default useItemScroller;
