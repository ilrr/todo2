import { useState } from 'react';
import tasklistService from '../services/tasklist';

const Share = ({ listId }) => {
  const [username, setUsername] = useState('');

  const share = event => {
    event.preventDefault();
    tasklistService.shareList(listId, username)
      .then(() => alert('Jaettu! ☺'))
      .catch(alert);
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
