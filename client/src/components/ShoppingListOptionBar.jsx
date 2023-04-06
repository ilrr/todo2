import './ShoppingListOptionBar.css';

const ShoppingListOptionsBar = props => {
  const {
    checkout, setCheckedLastPersistent, checkedLast, setHideEmptySections, hideEmptySections,
  } = props;
  return <div className="shopping-list-options-bar">
    <button onClick={setCheckedLastPersistent} className={checkedLast ? 'selected' : ''}>
      merkityt viimeisenä
    </button>
    <button onClick={() => setHideEmptySections(!hideEmptySections) } className={hideEmptySections ? 'selected' : ''}>
      piilota tyhjät
    </button>
    <button onClick={checkout} >
      Poista merkityt
    </button>
  </div>;
};

export default ShoppingListOptionsBar;
