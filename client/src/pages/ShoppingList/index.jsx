/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ShareIcon from '@mui/icons-material/Share';
import shoppingListService from '../../services/shoppingList';
import taskListService from '../../services/tasklist';
import FloatingForm from '../../components/FloatingForm';
// import tasklist from "../services/tasklist"
import Share from '../../components/Share';
import ShoppingListSection from './ShoppingListSection';
import { newToast } from '../../reducers/toastReducer';
import AddSection from './AddSection';
import './ShoppingList.css';
import DeleteListButton from '../../components/DeleteListButton';
import ShoppingListOptionsBar from './ShoppingListOptionBar';

const ShoppingList = () => {
  const { listId } = useParams();
  const userInfo = useSelector(({ user }) => user);
  const [sections, setSections] = useState([]);
  const [list, setList] = useState({});
  const [checkedLast, setCheckedLast] = useState(false);
  const [hideEmptySections, setHideEmptySections] = useState(false);

  const [insertSectionForm, setInsertSectionForm] = useState(false);
  const [shareForm, setShareForm] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkout = () => {
    shoppingListService.checkout(listId).then(setSections);
  };

  const setCheckedLastPersistent = () => {
    const tempCheckedLast = checkedLast;
    setCheckedLast(!tempCheckedLast);
    window.localStorage.setItem('checkedLast', !tempCheckedLast);
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

  useEffect(() => {
    const checkedLastLocalStorage = window.localStorage.getItem('checkedLast');
    if (checkedLastLocalStorage)
      setCheckedLast(checkedLastLocalStorage !== 'false');
    else
      window.localStorage.setItem('checkedLast', false);
  }, []);

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

            </div>
            <div className="shopping-list-wrapper">
              {(hideEmptySections
                ? sections.filter(({ shoppingListItems }) => shoppingListItems.length > 0)
                : sections)
                .map(section => (
                  <ShoppingListSection
                    key={section.id}
                    initialSection={section}
                    checkedLast={checkedLast} />
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
          <ShoppingListOptionsBar
            checkout={checkout}
            setCheckedLastPersistent={setCheckedLastPersistent}
            checkedLast={checkedLast}
            setHideEmptySections={setHideEmptySections}
            hideEmptySections={hideEmptySections}
            />
        </>
      ) : (
        'Kirjaudu!'
      )}
    </div>
  );
};

export default ShoppingList;
