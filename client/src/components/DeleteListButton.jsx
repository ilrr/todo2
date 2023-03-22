import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { newToast } from '../reducers/toastReducer';
import tasklistService from '../services/tasklist';
import FloatingForm from './FloatingForm';

const DeleteListButton = props => {
  const [deleteListForm, setDeleteListForm] = useState(false);
  const dispatch = useDispatch();
  const { listId } = props;
  const navigate = useNavigate();

  return (
    <>
      <span
        onClick={() => setDeleteListForm(true)}
        style={{
          cursor: 'pointer',
        }}>
        <DeleteForeverOutlinedIcon htmlColor="darkred" />
      </span>

      {deleteListForm && (
        <FloatingForm setVisibility={setDeleteListForm}>
          <p>Haluatko varmasti poistaa listan?</p>
          <button
            onClick={() => {
              tasklistService
                .deleteList(listId)
                .then(() => {
                  setDeleteListForm(false);
                  dispatch(newToast({ msg: 'Lista poistettu', type: 'info' }));
                  navigate('/');
                })
                .catch(({ error }) => dispatch(newToast({ msg: error })));
            }}>
            poista
          </button>
          <button onClick={() => setDeleteListForm(false)}>peruuta</button>
        </FloatingForm>
      )}
    </>
  );
};

export default DeleteListButton;
