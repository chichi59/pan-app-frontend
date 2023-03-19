import styles from '../css/AddIngredients.module.css'
import React from 'react'


function AddIngredients({ingList, handleEdit, handleDelete, handleSubmit}){
    const inputRef = React.useRef();

    const [ing, setIng] = React.useState({
        quantity: "",
        unit: "",
        ingredient: ""
    })

    const [currEditing, setCurrEditing] = React.useState(-1)


    function handleChange(e){
        const value = e.target.value;
        const name = e.target.name;

        const newIng = {...ing, [name]:value}
        setIng(newIng);

    }

    function ingReset(){
        const ingReset = {
            quantity: "",
            unit: "",
            ingredient: ""
        };

        setIng(ingReset);
    }


    function pressedEnter(e){
        if(e.key === 'Enter'){
            handleSubmit(ing.quantity, ing.unit, ing.ingredient);
            ingReset();
            return true;
        }

        return false;
    }

    function updateFocus(){
        inputRef.current.focus();
    }

    return (
        <section className={styles.ingredientsection}>
                    <ul>
                        {ingList.map((item) => {
                            if (item.id !== currEditing) {

                                return (
                                    <li className={styles.ingredientitem} key={item.id}>
                                        {item.unit ? `${item.quantity} ${item.unit} of ${item.ingredient}` : `${item.quantity} ${item.ingredient}` }
                                        <div className={styles.buttonset}>
                                            <button onClick={() => setCurrEditing(item.id)}> Edit </button>
                                            <button onClick={() => handleDelete(item.id)}> Delete </button>
                                        </div>
                                    </li>
                                    )
                            }else{

                                return (
                                    <li className={styles.ingredientedit}key={item.id}>
                                        <form>
                                            <label htmlFor="quantityedit"> Quantity </label>
                                            <input id="quantityedit" type="number" name="quantity" value={item.quantity} onChange={(e) => handleEdit(e, item.id)}/>
                                            <label htmlFor="unitedit"> Unit </label>
                                            <input id="unitedit" name="unit" value={item.unit} onChange={(e) => handleEdit(e, item.id)} />
                                            <label htmlFor="ingredientedit"> Ingredient </label>
                                            <input id="ingredientedit" name="ingredient" value={item.ingredient} onChange={(e) => handleEdit(e, item.id)} />
                                            <button type="button" onClick={() => setCurrEditing(-1)}> Save </button>
                                            
                                        </form>                                        

                                    </li>


                                )
                            }
                        }
                        )}
                    </ul>
                    <form>
                        <label htmlFor="quantity"> Quantity </label>
                        <input type="number" ref={inputRef} id="quantity" name="quantity" placeholder="500" value={ing.quantity} onChange={handleChange} autoFocus/>
                        <label htmlFor="unit"> Unit </label>
                        <input id="unit" name="unit" placeholder="grams" value={ing.unit} onChange={handleChange} />
                        <label htmlFor="ingredient"> Ingredient </label>
                        <input id="ingredient" name="ingredient" placeholder="chocolate, melted" value={ing.ingredient} onChange={handleChange} onKeyDown={(e) => {if (pressedEnter(e)) {updateFocus();} }}/>
                        <button type="button" onClick={() => {handleSubmit(ing.quantity, ing.unit, ing.ingredient); ingReset(); updateFocus(); }}> Submit </button>
                    </form>

                </section>

    )
}

export default AddIngredients;