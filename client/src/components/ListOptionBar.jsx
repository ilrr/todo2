import './ListOptionBar.css';

const ListOptionsBar = ({
  labels, actions, selected,
}) => <div className="list-options-bar">
  {labels.map((label, i) => <button
    onClick={actions[i]}
    className={selected[i] ? 'selected' : ''}
    key={i}>
    {label}
  </button>)
    }
</div>;

export default ListOptionsBar;
