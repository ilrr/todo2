import { averageDaysInMonth } from '../util/utils';
import './TimeIntervalForm.css';

const TimeIntervalForm = ({
  value, setValue, multiplyer, setMultiplyer, before, after, partitive,
}) => (
  <div className="time-interval-form">
    {before}
    <input
      type="number"
      value={value}
      onChange={e => setValue(e.target.value)}
      min={partitive ? 0 : 1}
      step="any" />
    <label>
      <input
        type="radio"
        name={multiplyer.name}
        value={1}
        checked={multiplyer === 1}
        onChange={() => setMultiplyer(1)} />
      {partitive ? 'päivää' : 'päivässä'}
    </label>

    <label>
      <input
        type="radio"
        name={value.name}
        value={7}
        checked={multiplyer === 7}
        onChange={() => setMultiplyer(7)} />
      {partitive ? 'viikkoa' : 'viikossa'}
    </label>

    <label>
      <input
        type="radio"
        name={multiplyer.name}
        value={averageDaysInMonth}
        checked={multiplyer === averageDaysInMonth}
        onChange={() => setMultiplyer(averageDaysInMonth)} />
      {partitive ? 'kuukautta' : 'kuukaudessa'}
    </label>
    {after}
  </div>
);

export default TimeIntervalForm;
