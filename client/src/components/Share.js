import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { newToast } from '../reducers/toastReducer';
import tasklistService from '../services/tasklist';

const Share = ({ listId }) => {
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();

  const share = event => {
    event.preventDefault();
    tasklistService.shareList(listId, username)
      .then(() => dispatch(newToast({ msg: 'Jaettu! ☺', type: 'info' })))
      .catch(e => dispatch(newToast({ msg: e.error })));
  };

  return (
    <div className="share-list">
      <form onSubmit={share}>
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <button type="submit">Jaa</button>
      </form>
    </div>
  );
};

export default Share;
