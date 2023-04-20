import { useEffect, useState } from 'react';
import taskService from '../services/task';
import { setDefaultInterval } from '../util/utils';
import TimeIntervalForm from './taskCard/TimeIntervalForm';

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

  // useEffect(()=>{
  //   if (presets) {
  //     setName(presets.name)
  //     if (Math.round(presets.frequency + 0.5) % averageDaysInMonth <= 1) {
  //       setFrequency(presets.frequency / averageDaysInMonth)
  //       setFrequencyMultiplyer(averageDaysInMonth)
  //     } else if (presets.frequency % 7 === 0) {
  //       setFrequency(presets.frequency / 7)
  //       setFrequencyMultiplyer(7)
  //     } else {
  //       setFrequency(presets.frequency)
  //     }
  // }}, [setName, setFrequency, setFrequencyMultiplyer, averageDaysInMonth, presets])

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
    taskService.newTask(tasklistId, taskToAdd).then(appendTask);
  };

  return (
    <div>
      <form onSubmit={submitTask}>
        {presets && <h2>Luodaan kopio tehtävästä ”{presets.name}”</h2>}
        Tehtävän nimi:
        <input type="text" value={name} onChange={e => setName(e.target.value)} /> <br />
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
        <div style={{ display: 'inline-block' }}>
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
        </div>
        <br />
        <button type="submit">Lisää</button>
      </form>
    </div>
  );
};

export default AddTask;
