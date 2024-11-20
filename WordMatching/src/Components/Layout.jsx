import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../styles.module.css';

// Utility component to render a grid layout
const Layout = forwardRef(function Layout({ items, cols, onSelection, status }, ref) {
  const [selected, setSelected] = useState([]);

  // Mark the selection and inform the parent
  const markSelection = (item) => {
    if (status) {
      return;
    }

    let newSelected = [];
    if (selected.includes(item)) {
      newSelected = selected.filter((i) => i !== item);
    } else {
      newSelected = [...selected, item];
    }

    setSelected(newSelected);
    onSelection(newSelected);
  };

  const clearSelection = () => {
    setSelected([]);
  };

  // Expose clearSelection method to the parent
  useImperativeHandle(ref, () => ({ clearSelection }));

  return (
    <section
      data-status={status}
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {items.map((item) => {
        const isSelected = selected.includes(item);
        const className = `${styles.itemBtn} ${isSelected ? styles.highlight : ''} ${
          isSelected && status ? styles[status] : ''
        }`;
        return (
          <button key={item} className={className} onClick={() => markSelection(item)}>
            {item}
          </button>
        );
      })}
    </section>
  );
});

export default Layout;
