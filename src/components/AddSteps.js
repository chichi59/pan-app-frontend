import React from 'react'
import styles from '../css/AddSteps.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faCircleXmark } from '@fortawesome/free-solid-svg-icons'


function AddSteps({ stepList, stepImages, handleDelete, handleEdit, handleSubmit, onStepImageChange, deleteStepImage, blankStepAndImage }) {

    const [currStep, setCurrStep] = React.useState("");
    const [currImg, setCurrImg] = React.useState("");

    function handleStepChange(e) {
        const step = e.target.value;
        setCurrStep(step);
    }

    function handleImgChange(e) {
        setCurrImg(e.target.files[0]);
    }

    const [currEditing, setCurrEditing] = React.useState(-1)


    function pressedEnter(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            if (e.target.name === "newstep") {
                e.preventDefault();
                handleSubmit(currStep, currImg);
                setCurrStep("")
                setCurrImg("")
            } else if (e.target.name === "editstep") {
                e.preventDefault();
                setCurrEditing(-1)

            }

        }

    }

    function doneEditingStep(index){
        if (stepImages[index] && !stepList[index]){
            blankStepAndImage(true);
            return
        }
        blankStepAndImage(false)
        setCurrEditing(-1)
    }

    return (
        <section className={styles.stepsection}>
            <ol>
                {stepList.map((item, index) => {
                    if (index !== currEditing) {

                        return (

                            <li className={styles.stepitem} key={index}>

                                {stepImages.length > 0 && (stepImages[index] ?
                                    <div>
                                        <FontAwesomeIcon onClick={() => deleteStepImage(index)} className={styles.delete} icon={faCircleXmark} />
                                        <img src={stepImages[index] instanceof File ? URL.createObjectURL(stepImages[index]) : stepImages[index]} />
                                    </div> 

                                    :

                                    <div>
                                        <label htmlFor="editStepImages">Add image for step {index + 1} </label>
                                        <input name="editStepImages" type="file" accept="image/*" onChange={(e) => { onStepImageChange(e, index) }} />
                                    </div>
                                    )
                                }

                                {item}
                                <div className={styles.buttonset}>
                                    <button onClick={() => setCurrEditing(index)}> Edit </button>
                                    <button onClick={() => handleDelete(index)}> Delete </button>
                                </div>

                            </li>
                        )
                    } else {

                        return (
                            <li key={index}>

                                {stepImages.length > 0 &&
                                    <div>
                                        <label htmlFor="editStepImages">Add image for step {index + 1} </label>
                                        <input name="editStepImages" type="file" accept="image/*" onChange={(e) => { onStepImageChange(e, index) }} />
                                    </div>
                                }

                                <form>
                                    <textarea autoFocus name="editstep" value={item} onChange={(e) => handleEdit(e, index)} onKeyDown={pressedEnter}></textarea>
                                    <button type="button" onClick={() => doneEditingStep(index)}> Submit </button>
                                </form>
                            </li>


                        )
                    }
                }
                )}

            </ol>
            <hr />
            <form>
                <label htmlFor="stepImages">At Step {stepList.length + 1} the pan looks like.. </label>
                <input name="stepImages" type="file" accept="image/*" onChange={handleImgChange} />
                <textarea name="newstep" autoFocus value={currStep} onChange={handleStepChange} onKeyDown={pressedEnter}></textarea>
                <button type="button" onClick={() => { if(handleSubmit(currStep, currImg)){ setCurrStep(""); setCurrImg("")} }}> Submit </button>
            </form>
        </section>
    )




}

export default AddSteps;