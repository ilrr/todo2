import { useEffect, useRef, useState } from 'react';
import StartIcon from '@mui/icons-material/Start';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';

const toDate = date => Date.UTC(date.getYear(), date.getMonth(), date.getDate());

const dateToString = (date, offset = 0, showTime = false) => {
  // console.log(date);
  if (!date)
    return 'Ei vielä suoritettu';
  const now = new Date(Date.now());
  // console.log(now);
  const dMonth = (date.getYear() - now.getYear()) * 12
    + (date.getMonth() - now.getMonth())
    + (date.getDate() - now.getDate() + offset) / 30;

  if (dMonth >= 1)
    return `${Math.floor(dMonth)} kuukauden päästä`;
  if (dMonth <= -1)
    return `${Math.floor(-dMonth)} kuukautta sitten`;
  const timeString = showTime ? `klo ${date.toLocaleTimeString()}` : '';
  const dDay = (toDate(date) - toDate(now)) / (1000 * 60 * 60 * 24) + offset;
  if (dDay === 0)
    return `tänään ${timeString}`;
  if (dDay === 1)
    return `huomenna ${timeString}`;
  if (dDay === -1)
    return `eilen ${timeString}`;
  if (dDay >= 0)
    return `${dDay} päivän päästä`;
  if (dDay < 0)
    return `${-dDay} päivää sitten`;
  return 'outo juttu :|';
};

const TaskTimeInfo = props => {
  // const [height, setHeight] = useState(0);
  const [overflows, setOverflows] = useState(0);
  const ref = useRef(null);

  const {
    nextDeadline, beforeFlexibility, afterFlexibility,
  } = props;

  useEffect(() => {
    const onResize = () => setOverflows(
      !nextDeadline
      || ref.current.parentElement.offsetWidth < ref.current.parentElement.scrollWidth,
    );
    if (!overflows)
      onResize();
    // window.addEventListener('resize', onResize);
  });

  const dl = dateToString(props.nextDeadline);
  const earliest = dateToString(nextDeadline, -beforeFlexibility);
  const latest = dateToString(nextDeadline, afterFlexibility);

  return <div className={`task-time ${overflows ? 'stacked' : ''}`} ref={ref}>
    {nextDeadline
      ? <>
        <div className="time-box"><span> <span>{earliest}</span> <span className="time-symbol"> <StartIcon fontSize='small' /> </span> </span></div>
        <div className="time-box"><span style={{ textAlign: 'center' }}> {dl} </span></div>
        <div className="time-box"><span> <span className="time-symbol"> <KeyboardTabIcon fontSize='small' /> </span> <span>{latest}</span> </span></div>
      </>
      : <div className="time-box"><span> {dl} </span></div>}
  </div>;
};

export default TaskTimeInfo;
