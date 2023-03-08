/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ShareIcon from '@mui/icons-material/Share';
import shoppingListService from '../services/shoppingList';
import FloatingForm from './FloatingForm';
// import tasklist from "../services/tasklist"
import Share from './Share';
import ShoppingListSection from './ShoppingListSection';

const ShoppingList = () => {
  const { listId } = useParams();
  const userInfo = useSelector(({ user }) => user);
  const [sections, setSections] = useState([]);
  const [list, setList] = useState({});
  // const [edit, setEdit] = useState(false);
  const [insertSectionForm, setInsertSectionForm] = useState(false);
  const [share, setShare] = useState(false);
  const navigate = useNavigate();

  const AddSection = () => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#ffffff');

    const submitSection = event => {
      event.preventDefault();
      const newSection = { name, color: color.slice(1) };
      shoppingListService.newSection(listId, newSection)
        .then(data => setSections(sections.concat({ ...data, shoppingListItems: [] })));
      setInsertSectionForm(false);
    };

    return <FloatingForm setVisibility={setInsertSectionForm}>
        <form onSubmit={submitSection}>
          <h3>Lisää uusi osa</h3>
          <input type='text' onChange={({ target }) => setName(target.value)} /> <br />
          Taustaväri: <input type='color' onChange={({ target }) => setColor(target.value) } defaultValue={color} /> <br />
          <button type='submit'>Lisää</button>
        </form>
    </FloatingForm>;
  };

  const checkout = () => {
    shoppingListService.checkout(listId).then(setSections);
  };

  useEffect(() => {
    if (userInfo.token) {
      let listInfo;
      shoppingListService.getListInfo(listId)
        .then(l => { setList(l); listInfo = l; })
        .then(() => {
          if (listInfo.type === 'SHOPPING') shoppingListService.getItems(listId).then(setSections);
          else navigate(`/lista/${listId}`);
        })
        .catch(e => navigate('/error', { state: e }));
    }
  }, [userInfo.token, listId]);

  return (
    <div>
      {userInfo.token ? <>
        <>{insertSectionForm && <AddSection /> }</>
        <div className="shopping-list">
          <div style={{
            display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginLeft: '10px', marginRight: '10px',
          }}>
            <h1 style={{ width: 'max-content' }}>{list.name}<span onClick={() => setShare(true)} style={{ cursor: 'pointer' }}> <ShareIcon htmlColor='darkslategray' />  </span></h1>
            <button onClick={checkout} style={{ margin: '10px 0 10px auto' }}>Poista merkityt</button>
          </div>
          <div className='shopping-list-wrapper'>
            {sections.map(section => <ShoppingListSection
            key={section.id}
            initialSection={section} />)
            }
            <div
              onClick={() => setInsertSectionForm(true)}
              className='add-section'
            >
              <span style={{ }}>+</span>
            </div>
          </div>
          <br/>
          {share
            && <FloatingForm setVisibility={setShare}>
             <Share listId={listId} />
            </FloatingForm>}
        </div>
      </> : (
        'Kirjaudu!'
      )}
    </div>
  );
};

export default ShoppingList;
