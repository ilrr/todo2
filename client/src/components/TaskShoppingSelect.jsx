/* eslint-disable no-unused-vars */

const RADIUS = '999px';
const BORDER_WIDTH = '0px';
const BORDER_COLOR = 'gray';
const PADDING = '2px 5px';
const OFF_BG = '#888';
const ON_BG = 'green';
const OFF_FG = '#666';
const ON_FG = 'black';

const TaskShoppingSelect = ({ isShopping, setIsShopping }) => {
  const onOffStyle = (onOff, left) => ({
    // color: onOff ? '#dd5555' : '#000000',
    color: onOff ? OFF_FG : ON_FG,
    fontWeight: 'bold', // onOff ? 'normal' : 'bold',
    // backgroundColor: onOff ? '#ff8888' : '#66dd66',
    backgroundColor: onOff ? OFF_BG : ON_BG,
    padding: PADDING,
    borderTop: `${BORDER_WIDTH} solid ${BORDER_COLOR}`,
    borderBottom: `${BORDER_WIDTH} solid ${BORDER_COLOR}`,
    borderLeft: `${BORDER_WIDTH} ${left ? 'solid' : 'none'} ${BORDER_COLOR}`,
    borderRight: `${BORDER_WIDTH} ${!left ? 'solid' : 'none'} ${BORDER_COLOR}`,
    borderRadius: left ? `${RADIUS} 0 0 ${RADIUS}` : `0 ${RADIUS} ${RADIUS} 0`,
  });

  return (
    <div onClick={() => setIsShopping(!isShopping)} style={{ userSelect: 'none', width: 'max-content' }}>
      <span style={onOffStyle(isShopping, true)}>TEHTÄVÄ</span>
      <span style={onOffStyle(!isShopping, false)}>OSTOS</span>
    </div>
  );
};

export default TaskShoppingSelect;
