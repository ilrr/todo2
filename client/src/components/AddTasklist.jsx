import { useState } from 'react';
import shoppingListService from '../services/shoppingList';
import tasklistService from '../services/tasklist';
import Modal from './Modal';
import TaskShoppingSelect from './TaskShoppingSelect';

// eslint-disable-next-line no-unused-vars
const AddTasklist = ({ setShowNewListForm: setVisibility }) => {
  const defaultName = '';

  const [name, setName] = useState(defaultName);
  const [isShopping, setIsShopping] = useState(false);

  const submitTasklist = event => {
    event.preventDefault();
    if (isShopping)
      shoppingListService.newList(name).then(({ id }) => { window.location.href = `/ostoslista/${id}`; });
    else
      tasklistService.newList(name).then(({ id }) => { window.location.href = `/lista/${id}`; });

    setName('');
  };

  return (
    <Modal setVisibility={setVisibility}>
      Luo uusi tehtävälista:
      <form onSubmit={submitTasklist}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          /> <br />
        <TaskShoppingSelect isShopping={isShopping} setIsShopping={setIsShopping} />
        <button type="submit">Luo</button>
      </form>
    </Modal>
  );
};

export default AddTasklist;
