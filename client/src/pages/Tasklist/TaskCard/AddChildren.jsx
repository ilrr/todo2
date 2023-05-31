import { useState } from 'react';
import { useDispatch } from 'react-redux';
import taskService from '../../../services/task';
import { newToast } from '../../../reducers/toastReducer';

const AddChildren = ({ task, update, setVisibility }) => {
  const [newChildren, setNewChildren] = useState(['']);
  const dispatch = useDispatch();

  const submitChildren = event => {
    event.preventDefault();
    if (newChildren.some(n => n !== '')) {
      taskService.createChildren(task.id, newChildren)
        .then(data => {
          dispatch(newToast({ msg: `${data.addedCount} johdannaistehtävää luotu`, type: 'info' }));
          update(task.id, data);
          setVisibility(false);
        });
    } else
      dispatch(newToast({ msg: 'määritä vähintään yksi alatehtävä', type: 'warn' }));
  };

  const textFieldKeyDown = event => {
    if (event.key === 'Enter')
      setNewChildren(newChildren.concat(''));
  };

  const setChildName = (indexToUpdate, updatedName) => {
    setNewChildren(
      newChildren.map((name, index) => (index === indexToUpdate ? updatedName : name)),
    );
  };

  return <>
    <h2>{task.name}</h2>
    {newChildren.map((childName, childIndex) => <div key={`${task.id}-${childIndex}`}>
      <input
        type='text'
        value={childName}
        onChange={e => setChildName(childIndex, e.target.value)}
        onKeyDown={textFieldKeyDown}
        autoFocus
        ></input>
    </div>)}
    <button type='button' onClick={e => { e.preventDefault(); setNewChildren(newChildren.concat('')); }}>+</button>
    <form onSubmit={submitChildren}>
      <button type='submit'>Lisää johdannaistehtävät</button>
    </form>

  </>;
};

export default AddChildren;
