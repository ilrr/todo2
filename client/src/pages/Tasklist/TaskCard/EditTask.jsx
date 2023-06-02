import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setDefaultInterval } from '../../../util/utils';
import taskService from '../../../services/task';
import { newToast } from '../../../reducers/toastReducer';
import TaskTimeForm from '../../../components/TaskTimeForm';

const EditTask = ({ task, update, setVisibility }) => {
  const [name, setName] = useState(task.name);
  const [completedAt, setCompletedAt] = useState(task.completedAt ? task.completedAt.split('T')[0] : new Date(Date.now()).toISOString().split('T')[0]);
  const [editCompletedAt, setEditCompletedAt] = useState(false);
  const [frequency, setFrequency] = useState(task.frequency);
  const [frequencyMultiplyer, setFrequencyMultiplyer] = useState(1);
  const [afterFlexibility, setAfterFlexibility] = useState(task.afterFlexibility);
  const [afterFlexibilityMultiplyer, setAfterFlexibilityMultiplyer] = useState(1);
  const [beforeFlexibility, setBeforeFlexibility] = useState(task.beforeFlexibility);
  const [beforeFlexibilityMultiplyer, setBeforeFlexibilityMultiplyer] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    setDefaultInterval(frequency, setFrequency, setFrequencyMultiplyer);
    setDefaultInterval(afterFlexibility, setAfterFlexibility, setAfterFlexibilityMultiplyer);
    setDefaultInterval(beforeFlexibility, setBeforeFlexibility, setBeforeFlexibilityMultiplyer);
  }, []);

  const submitEdits = event => {
    event.preventDefault();
    const newValues = {
      name,
      frequency: Math.round(Number(frequency) * frequencyMultiplyer),
      afterFlexibility: Math.round(Number(afterFlexibility) * afterFlexibilityMultiplyer),
      beforeFlexibility: Math.round(Number(beforeFlexibility) * beforeFlexibilityMultiplyer),
      completedAt: editCompletedAt ? `${completedAt}T16:00` : task.completedAt,
    };
    taskService.editTask(task.id, newValues).then(res => {
      dispatch(newToast({ msg: 'Tehtävä päivitetty', type: 'info' }));
      update(task.id, res.data);
      setVisibility(false);
    });
  };

  return (
    <div>
      <form onSubmit={submitEdits}>
        Tehtävän nimi:
        <input type="text" value={name} onChange={({ target }) => setName(target.value)} /> <br />
        <TaskTimeForm
          frequency={frequency}
          setFrequency={setFrequency}
          frequencyMultiplyer={frequencyMultiplyer}
          setFrequencyMultiplyer={setFrequencyMultiplyer}
          afterFlexibility={afterFlexibility}
          setAfterFlexibility={setAfterFlexibility}
          afterFlexibilityMultiplyer={afterFlexibilityMultiplyer}
          setAfterFlexibilityMultiplyer={setAfterFlexibilityMultiplyer}
          beforeFlexibility={beforeFlexibility}
          setBeforeFlexibility={setBeforeFlexibility}
          beforeFlexibilityMultiplyer={beforeFlexibilityMultiplyer}
          setBeforeFlexibilityMultiplyer={setBeforeFlexibilityMultiplyer}
        />
        <br/>
        <label>
          <input id="editCompletedAt" type="checkbox" value={editCompletedAt} onChange={() => setEditCompletedAt(v => !v) } />
          muuta viimeisin suoritusajankohta
        </label>
        {editCompletedAt
          ? <label>Suoritettu viimeksi <input type="date" value={completedAt} onChange={({ target }) => setCompletedAt(target.value)} /></label>
          : <br/>}
        <br/>
        <button type='submit'>Muokkaa</button>
      </form>
    </div>
  );
};

export default EditTask;
