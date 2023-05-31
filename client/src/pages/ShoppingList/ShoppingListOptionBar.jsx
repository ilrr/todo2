import ListOptionsBar from '../../components/ListOptionBar';

const ShoppingListOptionsBar = props => {
  const {
    checkout, setCheckedLastPersistent, checkedLast, setHideEmptySections, hideEmptySections,
  } = props;
  return <ListOptionsBar
    labels={['merkityt viimeisenä', 'piilota tyhjät', 'poista merkityt']}
    actions={[setCheckedLastPersistent, () => setHideEmptySections(!hideEmptySections), checkout]}
    selected={[checkedLast, hideEmptySections, false]}
    />;
};

export default ShoppingListOptionsBar;
