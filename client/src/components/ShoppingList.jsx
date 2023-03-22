/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ShareIcon from '@mui/icons-material/Share';
import shoppingListService from '../services/shoppingList';
import taskListService from '../services/tasklist';
import FloatingForm from './FloatingForm';
// import tasklist from "../services/tasklist"
import Share from './Share';
import ShoppingListSection from './ShoppingListSection';
import { newToast } from '../reducers/toastReducer';
import AddSection from './AddSection';
import './ShoppingList.css';
import DeleteListButton from './DeleteListButton';

const ShoppingList = () => {
  const { listId } = useParams();
  const userInfo = useSelector(({ user }) => user);
  const [sections, setSections] = useState([]);
  const [list, setList] = useState({});

  const [insertSectionForm, setInsertSectionForm] = useState(false);
  const [shareForm, setShareForm] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkout = () => {
    shoppingListService.checkout(listId).then(setSections);
  };

  useEffect(() => {
    if (userInfo.token) {
      let listInfo;
      shoppingListService
        .getListInfo(listId)
        .then(l => {
          setList(l);
          listInfo = l;
        })
        .then(() => {
          if (listInfo.type === 'SHOPPING')
            shoppingListService.getItems(listId).then(setSections);
          else
            navigate(`/lista/${listId}`);
        })
        .catch(e => navigate('/error', { state: e }));
    }
  }, [userInfo.token, listId]);

  return (
    <div>
      {userInfo.token ? (
        <>
          <div className="shopping-list">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginLeft: '10px',
                marginRight: '10px',
              }}>
              <h1 style={{ width: 'max-content' }}>
                {list.name}
                <span onClick={() => setShareForm(true)} style={{ cursor: 'pointer' }}>
                  <ShareIcon htmlColor="darkslategray" />
                </span>
                <DeleteListButton listId={listId} />
              </h1>
              <button onClick={checkout} style={{ margin: '10px 0 10px auto' }}>
                Poista merkityt
              </button>
            </div>
            <div className="shopping-list-wrapper">
              {sections.map(section => (
                <ShoppingListSection key={section.id} initialSection={section} />
              ))}
              <div onClick={() => setInsertSectionForm(true)} className="add-section new">
                <span style={{}}>+</span>
              </div>
            </div>
            {insertSectionForm
            && <AddSection
              listId={listId}
              sections={sections}
              setSections={setSections}
              setInsertSectionForm={setInsertSectionForm}
              />}

            {shareForm && (
              <FloatingForm setVisibility={setShareForm}>
                <Share listId={listId} />
                <button onClick={() => { setShareForm(false); }}>peruuta</button>
              </FloatingForm>
            )}

          </div>
        </>
      ) : (
        'Kirjaudu!'
      )}
    </div>
  );
};

export default ShoppingList;
