import TimeIntervalForm from './TimeIntervalForm';

const TaskTimeForm = ({
  frequency, setFrequency, frequencyMultiplyer, setFrequencyMultiplyer,
  afterFlexibility,
  setAfterFlexibility,
  afterFlexibilityMultiplyer,
  setAfterFlexibilityMultiplyer,
  beforeFlexibility,
  setBeforeFlexibility,
  beforeFlexibilityMultiplyer,
  setBeforeFlexibilityMultiplyer,
}) => <>
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
</>;

export default TaskTimeForm;
