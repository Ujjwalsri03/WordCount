import { useEffect, useRef, useState } from 'react';
import GridUI from './Layout';
import styles from '../styles.module.css';
import { areItemsFromSingleGroup } from '../utils/Helper';
import { StatusOptions } from '../utils/Types'; 

function Game({ itemGroups, allItems, columns = 2, groupSize }) {
  const [items, setItems] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState(null);
  const gridUIRef = useRef(null);

  // when items change, reset the game
  useEffect(() => {
    setItems(allItems);
    setAttempts(0);
    setStatus(null);
    if (gridUIRef.current) {
      gridUIRef.current.clearSelection();
    }
  }, [allItems]);

  // take action if items are from the same group on selection completion
  function onSelection(selected) {
    if (selected.length === groupSize) {
      setAttempts((prevAttempts) => prevAttempts + 1);
      const newStatus = areItemsFromSingleGroup(itemGroups, selected)
        ? StatusOptions.Success
        : StatusOptions.Failure;
      setStatus(newStatus);
      const timeoutId = setTimeout(() => unHighlight(selected, newStatus), 1000);
      return () => clearTimeout(timeoutId); // Cleanup timeout
    }
  }

  function unHighlight(itemsForRemoval, currentStatus) {
    if (currentStatus === StatusOptions.Success) {
      setItems((prevItems) =>
        prevItems.filter((item) => !itemsForRemoval.includes(item))
      );
    }
    setStatus(null);
    if (gridUIRef.current) {
      gridUIRef.current.clearSelection();
    }
  }

  return (
    <>
      {items.length ? (
        <GridUI
          items={items}
          cols={columns}
          onSelection={onSelection}
          status={status}
          ref={gridUIRef}
        />
      ) : (
        <p className={styles.center}>Well done. Reset to play again!</p>
      )}

      <p className={styles.center}>
        Attempts: <strong>{attempts}</strong>
      </p>
    </>
  );
}

export default Game;
