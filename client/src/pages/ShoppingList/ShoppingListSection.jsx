import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import shoppingListService from '../../services/shoppingList';
import FloatingForm from '../../components/FloatingForm';
import { newToast } from '../../reducers/toastReducer';

const ChangeColor = ({ section, setSection }) => {
  const [color, setColor] = useState(`#${section.color}`);
  // console.log(section);
  const dispatch = useDispatch();

  const submit = event => {
    event.preventDefault();
    // console.log(color);
    shoppingListService
      .setColor(section.id, color.slice(1))
      .then(() => {
        dispatch(newToast({ msg: 'väri vaihdettu :-)', type: 'info' }));
        setSection({ ...section, color: color.slice(1) });
      });
  };

  return <form onSubmit={submit}>
    <input
      type='color'
      defaultValue={color}
      onChange={({ target }) => setColor(target.value)}
    />
    <button type='submit'>Muuta väri</button>
  </form>;
};

const ShoppingListSection = ({ initialSection, checkedLast }) => {
  const [section, setSection] = useState(initialSection);
  const [colorForm, setColorForm] = useState(false);

  const insertItem = item => {
    setSection({ ...section, shoppingListItems: section.shoppingListItems.concat(item) });
  };

  const sortedItems = () => {
    if (checkedLast) {
      return [...section.shoppingListItems].sort(
        // eslint-disable-next-line no-nested-ternary
        (a, b) => (a.checked !== b.checked ? (a.checked ? 1 : -1) : 0),
      );
    }
    return section.shoppingListItems;
  };

  const AddItem = () => {
    const [name, setName] = useState('');
    const itemInputRef = useRef();

    const submitItem = event => {
      event.preventDefault();
      shoppingListService
        .newItem(section.id, { name })
        .then(data => {
          insertItem(data);
          // this is very 🤮 solution to restore focus into input field after rerender
          // will hopefully fix later...
          setTimeout(() => document.getElementById(`item-input-${initialSection.id}`).focus(), 1);
        });
    };

    return <form onSubmit={submitItem}>
      <input
        type="text"
        value={name}
        ref={itemInputRef}
        id={`item-input-${initialSection.id}`}
        onChange={({ target }) => setName(target.value)}
        style={{
          width: 'calc(100% - 10px)',
          border: '1px solid #333',
          backgroundColor: '#fff0',
          outline: '1px solid #ddd',
          borderRadius: '1px',
        }} />
    </form>;
  };

  const checkItem = (id, checked) => {
    setSection({
      ...section,
      shoppingListItems:
          section.shoppingListItems.map(item => (item.id === id ? { ...item, checked } : item)),
    });
    shoppingListService.checkItem(id, checked)
      .then(data => setSection({
        ...section,
        shoppingListItems:
          section.shoppingListItems.map(item => (item.id === data.id ? data : item)),
      }));
  };

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);

  return (
    <div
      style={{ backgroundColor: `#${section.color}` }}
      className="shopping-list-section">
      <span
        onClick={() => setColorForm(!colorForm)}
        style={{ float: 'right' }}>🎨</span>
      <h2>{section.name} </h2>
      <ul>
        {sortedItems().map(
          item => <a key={item.id} onClick={() => checkItem(item.id, !item.checked)}>
            <li className={item.checked ? 'checked' : ''}>
              {item.name}
            </li>
          </a>,
        )}
      </ul>
      <AddItem />
      {colorForm && <FloatingForm setVisibility={setColorForm}>
        <ChangeColor section={section} setSection={setSection} />
        </FloatingForm>}
    </div>
  );
};

export default ShoppingListSection;