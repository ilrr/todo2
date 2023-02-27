/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import shoppingListService from '../services/shoppingList';
import FloatingForm from './FloatingForm';
// import tasklist from "../services/tasklist"
import Share from './Share';
import ShoppingListSection from './ShoppingListSection';
import TaskCard from './TaskCard';

const ShoppingList = () => {
  const { listId } = useParams();
  const userInfo = useSelector(({ user }) => user);
  const [sections, setSections] = useState([]);
  const [list, setList] = useState({});
  // const [edit, setEdit] = useState(false);
  const [insertSectionForm, setInsertSectionForm] = useState(false);
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
          <input type='color' onChange={({ target }) => setColor(target.value) } defaultValue={color} /> taustaväri <br />
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
          <h1>{list.name}</h1>
          <div className='shopping-list-wrapper'>
            {sections.map(section => <ShoppingListSection
            key={section.id}
            initialSection={section} />)
            }
            <div
              onClick={() => setInsertSectionForm(true)}
              style={{
                backgroundColor: 'darkgray',
                margin: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
              }}
            >
              <span style={{ }}>+</span>
            </div>
          </div>
          <button onClick={checkout}>Kassalle :)</button>
          <br/>
          <Share listId={listId} />
        </div>
      </> : (
        'Kirjaudu!'
      )}
    </div>
  );
};

export default ShoppingList;
