import { useEffect, useRef, useState } from 'react';
import StartIcon from '@mui/icons-material/Start';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import { dateToString } from '../../../util/dateUtils.tsx';

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
