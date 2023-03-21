import { useState } from 'react';
import shoppingListService from '../services/shoppingList';
import FloatingForm from './FloatingForm';

const AddSection = ({
  listId, sections, setSections, setInsertSectionForm,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#ffffff');

  const submitSection = event => {
    event.preventDefault();
    const newSection = { name, color: color.slice(1) };
    shoppingListService
      .newSection(listId, newSection)
      .then(data => setSections(sections.concat({ ...data, shoppingListItems: [] })));
    setInsertSectionForm(false);
  };

  return (
    <FloatingForm setVisibility={setInsertSectionForm}>
      <form onSubmit={submitSection}>
        <h3>Lisää uusi osa</h3>
        <input type="text" onChange={({ target }) => setName(target.value)} /> <br />
        Taustaväri:{' '}
        <input
          type="color"
          onChange={({ target }) => setColor(target.value)}
          defaultValue={color} />{' '}
        <br />
        <button type="submit">Lisää</button>
      </form>
    </FloatingForm>
  );
};

export default AddSection;
