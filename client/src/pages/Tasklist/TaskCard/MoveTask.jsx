import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { newToast } from '../../../reducers/toastReducer';
import tasklistService from '../../../services/tasklist';
import taskService from '../../../services/task';

const MoveTask = ({ task, update }) => {
  const [tasklists, setTasklists] = useState([]);
  const { name, tasklistId, id } = task;
  const [newListId, setNewListId] = useState(tasklistId);
  const dispatch = useDispatch();

  useEffect(() => {
    tasklistService
      .getTasklists()
      .then(data => {
        setTasklists(data.tasklists);
      })
      .catch(({ error }) => dispatch(newToast(error)));
  }, []);

  const submitMove = event => {
    event.preventDefault();
    if (tasklistId !== newListId) {
      taskService.moveTask(id, newListId)
        .then(() => {
          dispatch(newToast({ msg: 'Tehtävä siirretty', type: 'info' }));
          update(id, { delete: true });
        })
        .catch(({ error }) => dispatch(newToast(error)));
    }
  };

  return (<>
    <h2>Siirretään ”{name}”</h2>
    <div>valitse lista</div>
    <form onSubmit={submitMove}>
      {tasklists
        .filter(list => list.type !== 'SHOPPING')
        .map(list => <label key={list.id} htmlFor={`list${list.id}`}>
          <input
            type="radio"
            id={`list${list.id}`}
            value={list.id}
            name="tasklist"
            onChange={() => setNewListId(list.id)}
            checked={list.id === newListId}
          />
          {list.name}
        </label>)
      }
      <button type="submit">Siirrä</button>
    </form>
  </>);
};

export default MoveTask;
