import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import taskService from '../../services/task';
import { setDefaultInterval } from '../../util/utils';
import { newToast } from '../../reducers/toastReducer';
import TaskTimeForm from '../../components/TaskTimeForm';

const AddTask = ({
  tasklistId, appendTask, presets, setShowForm,
}) => {
  const defaultName = '';

  const [name, setName] = useState(defaultName);
  const [frequency, setFrequency] = useState(1);
  const [frequencyMultiplyer, setFrequencyMultiplyer] = useState(1);
  const [afterFlexibility, setAfterFlexibility] = useState(0);
  const [afterFlexibilityMultiplyer, setAfterFlexibilityMultiplyer] = useState(1);
  const [beforeFlexibility, setBeforeFlexibility] = useState(0);
  const [beforeFlexibilityMultiplyer, setBeforeFlexibilityMultiplyer] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => {
    if (presets) {
      setName(presets.name);
      setDefaultInterval(presets.frequency, setFrequency, setFrequencyMultiplyer);
      setDefaultInterval(
        presets.afterFlexibility,
        setAfterFlexibility,
        setAfterFlexibilityMultiplyer,
      );
      setDefaultInterval(
        presets.beforeFlexibility,
        setBeforeFlexibility,
        setBeforeFlexibilityMultiplyer,
      );
    }
  }, [presets]);

  const submitTask = event => {
    event.preventDefault();
    const taskToAdd = {
      name,
      frequency: Math.round(Number(frequency) * frequencyMultiplyer),
      afterFlexibility: Math.round(Number(afterFlexibility) * afterFlexibilityMultiplyer),
      beforeFlexibility: Math.round(Number(beforeFlexibility) * beforeFlexibilityMultiplyer),
      hasSubtasks: false,
    };
    setName('');
    setFrequency(1);
    setShowForm(false);
    taskService.newTask(tasklistId, taskToAdd).then(task => {
      appendTask(task);
      dispatch(newToast({ msg: `”${task.name}” luotu`, type: 'info' }));
    });
  };

  return (
    <div>
      <form onSubmit={submitTask}>
        {presets && <h2>Luodaan kopio tehtävästä ”{presets.name}”</h2>}
        Tehtävän nimi:
        <input type="text" value={name} onChange={e => setName(e.target.value)} /> <br />
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
        <br />
        <button type="submit">Lisää</button>
      </form>
    </div>
  );
};

export default AddTask;
