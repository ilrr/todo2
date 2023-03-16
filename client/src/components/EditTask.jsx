import { useEffect, useState } from 'react';
import { setDefaultInterval } from '../util/utils';
import taskService from '../services/task';
import TimeIntervalForm from './TimeIntervalForm';

const EditTask = ({ task, update }) => {
  const [name, setName] = useState(task.name);
  const [frequency, setFrequency] = useState(task.frequency);
  const [frequencyMultiplyer, setFrequencyMultiplyer] = useState(1);
  const [afterFlexibility, setAfterFlexibility] = useState(task.afterFlexibility);
  const [afterFlexibilityMultiplyer, setAfterFlexibilityMultiplyer] = useState(1);
  const [beforeFlexibility, setBeforeFlexibility] = useState(task.beforeFlexibility);
  const [beforeFlexibilityMultiplyer, setBeforeFlexibilityMultiplyer] = useState(1);

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
    };
    taskService.editTask(task.id, newValues).then(res => update(task.id, res.data));
  };

  return (
    <div>
      <form onSubmit={submitEdits}>
        Tehtävän nimi:
        <input type="text" value={name} onChange={({ target }) => setName(target.value)} /> <br />
        <TimeIntervalForm
          before={
            <>
              {' '}
              Toistuvuus:
              <br /> kerran{' '}
            </>
          }
          value={frequency}
          setValue={setFrequency}
          multiplyer={frequencyMultiplyer}
          setMultiplyer={setFrequencyMultiplyer}
        />
        <TimeIntervalForm
          before={
            <>
              {' '}
              + <br />{' '}
            </>
          }
          value={afterFlexibility}
          setValue={setAfterFlexibility}
          multiplyer={afterFlexibilityMultiplyer}
          setMultiplyer={setAfterFlexibilityMultiplyer}
          partitive={true}
        />
        <TimeIntervalForm
          before={
            <>
              {' '}
              &minus; <br />{' '}
            </>
          }
          value={beforeFlexibility}
          setValue={setBeforeFlexibility}
          multiplyer={beforeFlexibilityMultiplyer}
          setMultiplyer={setBeforeFlexibilityMultiplyer}
          partitive={true}
        />
        <button type='submit'>Muokkaa</button>
      </form>
    </div>
  );
};

export default EditTask;
