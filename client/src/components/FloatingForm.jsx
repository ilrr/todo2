const FloatingForm = ({ children, setVisibility }) => (
  <div
    className='add-instance-background'
    onClick={({ target }) => setVisibility(target.className !== 'add-instance-background')}
  >
    <div className='add-instance'>
      {children}
    </div>
  </div>
);

export default FloatingForm;
