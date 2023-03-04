/* eslint-disable no-unused-vars */
const TaskShoppingSelect = ({ isShopping, setIsShopping }) => {
  const onOffStyle = (onOff, left) => ({
    color: onOff ? '#dd5555' : '#000000',
    fontWeight: 'bold', // onOff ? 'normal' : 'bold',
    backgroundColor: onOff ? '#ff8888' : '#66dd66',
    padding: '2px',
    borderTop: '2px solid black',
    borderBottom: '2px solid black',
    borderLeft: `2px ${left ? 'solid' : 'none'} black`,
    borderRight: `2px ${!left ? 'solid' : 'none'} black`,
    borderRadius: left ? '4px 0 0 4px' : '0 4px 4px 0',
  });

  return (
    <div onClick={() => setIsShopping(!isShopping)} style={{ userSelect: 'none', width: 'max-content' }}>
      <span style={onOffStyle(isShopping, true)}>TEHTÄVÄ</span>
      <span style={onOffStyle(!isShopping, false)}>OSTOS</span>
    </div>
  );
};

export default TaskShoppingSelect;
