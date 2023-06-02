import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import TuneIcon from '@mui/icons-material/Tune';
import shoppingListService from '../../services/shoppingList';
import Modal from '../../components/Modal';
import { newToast } from '../../reducers/toastReducer';

const EditSection = ({
  section, setSection, color, setColor, deleteSelf,
}) => {
  // console.log(section);
  const [newName, setNewName] = useState(section.name);
  const [toggleDeletion, setToggleDeletion] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setColor(`#${section.color}`);
  }, []);

  const submit = event => {
    event.preventDefault();
    // console.log(color);
    if (!toggleDeletion) {
      shoppingListService
        .updateSection(section.id, { name: newName, color: color.slice(1) })
        .then(data => {
          dispatch(newToast({ msg: 'Osio muokattu :-)', type: 'info' }));
          setSection(data);
        })
        .catch(error => dispatch(newToast({ msg: error.error })));
    } else {
      shoppingListService.deleteSection(section.id)
        .then(() => {
          dispatch(newToast({ msg: `”${section.name}” poistettu!`, type: 'info' }));
          deleteSelf();
        })
        .catch(error => dispatch(newToast({ msg: error.error })));
    }
  };

  return <form onSubmit={submit}>
    <label>
      <input type="checkbox" value={toggleDeletion} onChange={() => setToggleDeletion(v => !v)} />
      poista osio
    </label>
    {!toggleDeletion
      && <>
        <label>
          nimi:
          <input type="text" value={newName} onChange={({ target }) => setNewName(target.value)} />
        </label>
        <label>taustaväri: <input
          type='color'
          defaultValue={`#${section.color}`}
          onChange={({ target }) => setColor(target.value)}
      /></label>
      </>
    }
    <button type='submit'>{toggleDeletion ? 'Poista' : 'Muokkaa' }</button>
  </form>;
};

const ShoppingListSection = ({ initialSection, checkedLast, deleteSection }) => {
  const [section, setSection] = useState(initialSection);
  const [toggleEditButton, setToggleEditButton] = useState(false);
  const [colorForm, setColorForm] = useState(false);
  const [color, setColor] = useState(`#${section.color}`);

  useEffect(() => {
    setColorForm(false);
  }, [section]);

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
      { toggleEditButton && <span
        onClick={() => setColorForm(!colorForm)}
        style={{
          float: 'right', width: '24px', marginLeft: '-24px', marginRight: '-6px',
        }}>
        <TuneIcon />
      </span> }
      <h2 onClick={() => setToggleEditButton(v => !v)}>{section.name}</h2>
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
      {colorForm && <Modal setVisibility={setColorForm} innerStyle={{ backgroundColor: color, minHeight: '50%' }}>
        <EditSection
          section={section}
          setSection={setSection}
          color={color}
          setColor={setColor}
          deleteSelf={deleteSection} />
        </Modal>}
    </div>
  );
};

export default ShoppingListSection;
