import { useState } from 'react';
import { useDispatch } from 'react-redux';
import taskService from '../../services/task';
import { newToast } from '../../reducers/toastReducer';

const ConvertToChild = ({ task, siblings, updateTask }) => {
  const [newParentId, setNewParentId] = useState(-1);
  const dispatch = useDispatch();

  const { id, name } = task;

  const submit = event => {
    event.preventDefault();
    taskService.convertToChild(id, newParentId)
      .then(newParent => {
        updateTask(newParentId, newParent);
        dispatch(newToast({
          type: 'info',
          msg: `${name} muutettiin tehtävän ${newParent.name} alatehtäväksi`,
        }));
        updateTask(id, { delete: true });
      })
      .catch(error => { dispatch(newToast({ type: 'error', msg: error.error })); });
  };

  return <>
    <form>
      {siblings.filter(t => t.id !== id).map(({ id: parentId, name: parentName }) => <label key={parentId} htmlFor={`parent${parentId}`}>
        <input
          type='radio'
          id={`parent${parentId}`}
          value = { parentId }
          name="parent"
          onChange={() => setNewParentId(parentId)}
          checked={parentId === newParentId}
      />{parentName}
      </label>)}
      <button onClick={submit} disabled={newParentId === -1}>muuta</button>
    </form>
  </>;
};

export default ConvertToChild;
