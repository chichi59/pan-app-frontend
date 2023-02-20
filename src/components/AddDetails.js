import React from 'react'
import styles from '../css/AddDetails.module.css'

function AddDetails({details, handleEdit, editing, setEditing}){
    const [errMsg, setErrMsg] = React.useState("")

    function validateCooktime(){

        let hrsvalid = true;
        let minsvalid = true;

        if(details.cooktimehrs){
            if(Number(details.cooktimehrs) < 0 || Number(details.cooktimehrs) > 72){
                hrsvalid = false;
            }
        }

        if(details.cooktimemins){
            if(Number(details.cooktimemins) < 0 || Number(details.cooktimemins) > 59){
                minsvalid = false;
            }
        }

        if(!hrsvalid || !minsvalid){
            setErrMsg('Cooktime must be between 0 hrs 0 mins and 72 hrs 59 mins')
            return false
        }else{
            setErrMsg('')
            return true
        }

    }


    return (
        <section className={styles.detailsection}>
            {errMsg && <p> {errMsg} </p>}
            <form>
                {!editing.cooktime && (details.cooktimehrs || details.cooktimemins) &&
                <div>
                    {details.cooktimehrs === '' && <p> Cook time: {details.cooktimemins} mins </p>}
                    {details.cooktimemins === '' && <p> Cook time: {details.cooktimehrs} hours </p>}
                    {details.cooktimehrs !== '' && details.cooktimemins !== '' &&
                    <p> Cook time: {`${details.cooktimehrs} hours ${details.cooktimemins} mins `}</p>}



                    <button type="button" onClick={() => {setEditing({...editing, cooktime: true})}}> Edit </button> 
                </div>
                }

                {editing.cooktime && 
                <div>
                    <label> Cook time: </label>
                    <br/>
                    <input autoFocus name="cooktimehrs" value={details.cooktimehrs} min={0} max={72} step={1} onChange={handleEdit} type="number"/>
                    <label htmlFor='cooktimehrs'> Hours</label>
                    <input name="cooktimemins" value={details.cooktimemins} min={0} max={59} step={1} onChange={handleEdit} type="number"/>
                    <label htmlFor='cooktimemins'> Mins </label>
                    <button type="button" onClick={() => { 
                        if((details.cooktimehrs || details.cooktimemins) && validateCooktime()){
                        setEditing({...editing, cooktime: false});}  }} > Submit </button>
                </div>
                }

                {!editing.calories && details.calories &&
                <div>
                    <p> Calories: {details.calories}</p>
                    <button type="button" onClick={() => {setEditing({...editing, calories: true})}}> Edit </button> 
                </div>
                }

                {editing.calories && 
                <div>
                    <label> Calories per Serving: </label>
                    <input name="calories" type="number" value={details.calories} onChange={handleEdit} />
                    <button type="button" onClick={() => {if(details.calories) setEditing({...editing, calories: false});}}> Submit </button>
                </div>
                }


                {!editing.servings && details.servings &&
                <div> 
                    <p> Servings: {details.servings}</p>
                    <button type="button" onClick={() => {setEditing({...editing, servings: true})}}> Edit </button> 
                </div>
                }

                {editing.servings && 
                <div>
                    <label > Servings </label>
                    <input name="servings" type="number" value={details.servings} onChange={handleEdit} />
                    <button type="button" onClick={() => {if(details.servings) setEditing({...editing, servings: false})}}> Submit </button>
                </div>
                }

                <label> Public </label>
                <input name="public" checked={details.public} onChange={handleEdit} type="checkbox" />
            </form>

        </section>
    )


}

export default AddDetails;