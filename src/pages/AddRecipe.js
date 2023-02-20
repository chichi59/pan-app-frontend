import styles from '../css/AddRecipe.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons'
import React from 'react';
import AddIngredients from '../components/AddIngredients.js'
import AddSteps from '../components/AddSteps.js'
import AddDetails from '../components/AddDetails';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons'

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom'
import AddCoverImage from '../components/AddCoverImage';
import axios from '../api/axios';


function AddRecipe({ recipeid }) {

    //if recipeid provided, get and update existing recipe

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();


    const [loading, setLoading] = React.useState(true);
    const [existingCoverIms, setExistingCoverIms] = React.useState(null);
    const [existingStepIms, setExistingStepIms] = React.useState(null);


    React.useEffect(() => {
        const fetchRecipe = async () => {
            let success = false;
            let recipe = {};
            try {
                const response = await axiosPrivate.get(`/recipes/${recipeid}`);
                recipe = response.data;
                success = true;
            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
                setErrMsg(err.response.data.message)
            }

            if (success) {

                let ctime = recipe.cooktime.split(':')

                setRecipeName(recipe.title)

                setIngList(recipe.ingredients.map((item, index) => {
                    return { ...item, id: index }
                }))

                setStepList(recipe.steps)

                setDetails({
                    ...details,
                    cooktimemins: ctime[1],
                    cooktimehrs: ctime[0],
                    calories: recipe.calories,
                    servings: recipe.servings,
                    public: recipe.public

                })

            }

        }

        const fetchImages = async () => {
            let success = false;
            let imagesCover = {}
            let imagesStep = {}
            let stepListLength = 0;

            try {
                const response = await axiosPrivate.get(`/recipes/${recipeid}/coverimages`);
                imagesCover = response.data.coverIms;

                
            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
                setErrMsg(err.response.data.message)
            }

            try {
                const response = await axiosPrivate.get(`/recipes/${recipeid}/stepimages`);
                imagesStep = response.data.stepIms;
                stepListLength = response.data.stepListLength;
                

                success = true;
                setLoading(false);
            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
                setErrMsg(err.response.data.message)
            }

            if (success) {

                

                const coverImMap = new Map();
                const coverIms = []

                for(const image of imagesCover){
                    coverIms.push(image.imageURL);
                    coverImMap.set(image.imageURL, image.imageName);
                }

                setCoverImages(coverIms);
                setExistingCoverIms(coverImMap);

                

                const stepIms = []

                if (imagesStep && stepListLength) {
                    let j = 0;
                    for (let i = 0; i < stepListLength; i++) {
                        if (j < imagesStep.length && imagesStep[j].stepNum === i + 1) {
                            stepIms.push(imagesStep[j].imageURL)
                            j++;
                        } else {
                            stepIms.push('');
                        }
                    }
                }


                setStepImages(stepIms);

                const stepImMap = new Map();

                for(const image of imagesStep){
                    stepImMap.set(image.imageURL, image.imageName);
                }

                setExistingStepIms(stepImMap);


            }

        }



        if (recipeid) {
            fetchRecipe();
            fetchImages();
        }

    }, [])


    const recipeSubmit = async () => {
        if (!recipeName || recipeName === "Add Recipe Name") {
            setErrMsg('Recipe name required')
            return
        }

        if (coverImages.length > 3) {
            setErrMsg("A maximum of 3 finished dish photos can be uploaded")
            return
        }

        if (stepImages.length > 20) {
            setErrMsg("A maximum of 20 step photos can be uploaded")
            return
        }

        const idLessIngList = ingList.map((item) => {
            delete item.id
            return item;
        })

        let success = false;

        if (recipeid) {
            try {
                const response = await axiosPrivate.patch('/recipes/myrecipes', {
                    title: recipeName,
                    recipeid: recipeid,
                    ingredients: idLessIngList,
                    steps: stepList,
                    calories: details.calories,
                    cooktime: `${details.cooktimehrs}:${details.cooktimemins}`,
                    servings: details.servings,
                    public: details.public,
                })


                success = true;
                

            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
                setErrMsg(err.response.data.message)
            }

            if(success){

                const formData = new FormData();


                coverImages.forEach((item) => {
                    if(item instanceof File){
                        formData.append("newCoverImages", item)
                        formData.append("coverImageOrder", 'img');
                    }
                    else{
                        formData.append("coverImageOrder", existingCoverIms.get(item))
                    }
                    
                
                });



                stepImages.forEach((item) => {
                    if (item instanceof File) {
                        formData.append("newStepImages", item)
                        formData.append("stepImageOrder", 'img');
                    }else{
                        if(item === ''){
                            formData.append("stepImageOrder", '');
                        }else{
                            formData.append("stepImageOrder", existingStepIms.get(item))
                        }
                    }

                })

                try {
                    const response = await axiosPrivate.patch(`/recipes/${recipeid}/images`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })


                    setUploaded(true);


                } catch (err) {
                    console.log(err.response?.data);
                    console.log(err.response?.status);
                    console.log(err.response?.headers);
                    console.log(err.message)
                    setErrMsg(err.response.data.message)
                }


            }




        } else {

            let postedrecipeid = '';

            if (coverImages.length > 3) {
                setErrMsg("A maximum of 3 finished dish photos can be uploaded")
                return
            }

            if (stepImages.length > 20) {
                setErrMsg("A maximum of 20 step photos can be uploaded")
                return
            }

            try {
                const response = await axiosPrivate.post('/recipes/myrecipes', {
                    title: recipeName,
                    ingredients: ingList,
                    steps: stepList,
                    calories: details.calories,
                    cooktime: `${details.cooktimehrs}:${details.cooktimemins}`,
                    servings: details.servings,
                    public: details.public,
                })

                postedrecipeid = response.data.newrecipeid;


            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
                setErrMsg(err.response.data.message)
            }

            if (postedrecipeid) {

                const formData = new FormData();
                coverImages.forEach((item) => formData.append("coverImages", item));
                stepImages.forEach((item, index) => {
                    if (item) {
                        formData.append("stepImageStepNo", index + 1);
                        formData.append("stepImages", item)
                    }
                })

                try {
                    const response = await axiosPrivate.post(`/recipes/${postedrecipeid}/images`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })

                    

                    setUploaded(true);


                } catch (err) {
                    console.log(err.response?.data);
                    console.log(err.response?.status);
                    console.log(err.response?.headers);
                    console.log(err.message)
                    setErrMsg(err.response.data.message)
                }


            }


        }



    }

    const [errMsg, setErrMsg] = React.useState('')
    const [onPage, setOnPage] = React.useState(1);
    const [recipeName, setRecipeName] = React.useState(recipeid ? "Loading.." : "Add Recipe Name");
    const [nameSubmitted, setNameSubmitted] = React.useState(true);


    //state and methods for cover images:
    const [coverImages, setCoverImages] = React.useState([]);

    function onCoverImageChange(e) {
        setCoverImages([...coverImages, ...e.target.files]);
    }

    function deleteCoverPic(index) {
        const cov = coverImages.filter((item, index1) => index1 !== index)
        setCoverImages(cov)
    }


    //state and methods for ingredient list:
    const [ingList, setIngList] = React.useState([
        {
            id: 1,
            quantity: 500,
            unit: "grams",
            ingredient: "chocolate, melted"
        }
    ]);

    function handleIngDelete(id) {
        const ingL = ingList.filter((item) => item.id !== id)
        setIngList(ingL)
    }

    function handleIngEdit(e, id) {
        const value = e.target.value;
        const name = e.target.name;

        const ingL = ingList.map((item) => {
            return item.id === id ? { ...item, [name]: value } : item;
        })

        setIngList(ingL);
    }

    function handleIngSubmit(newquantity, newunit, newingredient) {

        if (!newingredient) {
            setErrMsg("Add an ingredient name")
            return
        } else {
            setErrMsg("")
        }

        const newId = ingList.length + 1

        const newIngList = [...ingList, {
            id: newId,
            quantity: newquantity,
            unit: newunit,
            ingredient: newingredient
        }]

        setIngList(newIngList)

    }

    //state and methods for step list:
    const [stepList, setStepList] = React.useState([]);

    function handleStepDelete(index) {
        const stepL = stepList.filter((item, index1) => index1 !== index)
        setStepList(stepL)
        const stp = stepImages.filter((item, index1) => index1 !== index)
        setStepImages(stp)
    }

    function handleStepEdit(e, index) {
        const value = e.target.value;

        const stepL = stepList.map((item, index1) => {
            return index1 === index ? value : item;
        })
        setStepList(stepL);
    }

    function blankStepAndImage(err) {
        if (err) {
            setErrMsg("Image must be accompanied by instructions")
        } else {
            setErrMsg("")
        }

    }

    function handleStepSubmit(currStep, currImg) {

        if (!currStep) {
            setErrMsg("Add a step description");
            return false;
        }

        if (!currStep && currImg) {
            blankStepAndImage(true);
            return false
        } else {
            blankStepAndImage(false);
        }



        const stepL = [...stepList, currStep];
        setStepList(stepL);
        const stepIm = [...stepImages, currImg];
        setStepImages(stepIm);
        return true
    }

    const [stepImages, setStepImages] = React.useState([]);

    function onStepImageChange(e, index) {
        if (e.target.files.length > 0) {
            const stepIm = stepImages.map((item, index1) => { return index1 === index ? e.target.files[0] : item })
            setStepImages(stepIm)
        }
    }

    function deleteStepImage(index) {
        const stepIm = stepImages.map((item, index1) => { return index === index1 ? '' : item })
        setStepImages(stepIm)
    }

    //Details state and methods:

    const [details, setDetails] = React.useState({
        cooktimehrs: "",
        cooktimemins: "",
        calories: "",
        servings: "",
        public: false
    })

    function handleDetailEdit(e) {
        const name = e.target.name;
        const value = e.target.value;
        const type = e.target.type;
        const checked = e.target.checked;

        const newDets = { ...details, [name]: type === "checkbox" ? checked : value }
        setDetails(newDets);

    }

    const [editingDetails, setEditingDetails] = React.useState({
        cooktime: true,
        calories: true,
        servings: true,
    })


    function nameSubmit(e) {
        e.preventDefault();
        setNameSubmitted(true);

    }

    const [uploaded, setUploaded] = React.useState(false);



    return (

        <main className={styles.addrecipesection}>
            <div className={styles.pagehead}>
                {!nameSubmitted && <form onSubmit={nameSubmit}>
                    <input className={styles.nameinput} type="text" placeholder="Recipe Name" value={recipeName} onChange={(e) => { setErrMsg(''); setRecipeName(e.target.value) }} onSubmit={nameSubmit} />
                    <button> Submit </button>
                </form>}

                {nameSubmitted && <div className={uploaded ? styles.greenrecipename : styles.recipenamesection}><h2> {recipeName} </h2>
                    <FontAwesomeIcon className={uploaded ? styles.noshow : styles.editicon} icon={faPen} onClick={() => { setNameSubmitted(false); }} />
                </div>}

                {errMsg && <p className={uploaded ? styles.noshow : styles.error}>
                    <FontAwesomeIcon className={styles.erroricon} icon={faTriangleExclamation} /> {errMsg} </p>}

                <button className={uploaded ? styles.noshow : styles.recipesubmit} onClick={recipeSubmit}> {recipeid ? "Update Recipe" : "Upload Recipe"}</button>
            </div>

            <section className={uploaded ? styles.uploadbox : styles.recipedetails}>
                <nav className={uploaded ? styles.noshow : styles.navbar}>
                    <li onClick={() => setOnPage(1)}>
                        <h3 className={onPage !== 1 ? styles.options : styles.activeoption} > Photos </h3>
                    </li>
                    <li onClick={() => setOnPage(2)}>
                        <h3 className={onPage !== 2 ? styles.options : styles.activeoption} >Ingredients</h3>
                    </li>
                    <li onClick={() => setOnPage(3)}>
                        <h3 className={onPage !== 3 ? styles.options : styles.activeoption} >Steps &amp; Pan Photos</h3>
                    </li>
                    <li onClick={() => setOnPage(4)}>
                        <h3 className={onPage !== 4 ? styles.options : styles.activeoption} >Details</h3>
                    </li>
                </nav>

                <div className={uploaded ? styles.noshow : styles.content}>
                    {onPage === 1 && ((!recipeid) || (recipeid && !loading)) &&
                        <AddCoverImage coverImages={coverImages} onCoverImageChange={onCoverImageChange} deleteCoverPic={deleteCoverPic} />}


                    {onPage === 2 && ((!recipeid) || (recipeid && !loading)) &&
                        <AddIngredients ingList={ingList} handleDelete={handleIngDelete} handleEdit={handleIngEdit} handleSubmit={handleIngSubmit} />}

                    {onPage === 3 && ((!recipeid) || (recipeid && !loading)) &&
                        <AddSteps stepList={stepList} handleDelete={handleStepDelete} handleEdit={handleStepEdit} handleSubmit={handleStepSubmit}
                            stepImages={stepImages} onStepImageChange={onStepImageChange} deleteStepImage={deleteStepImage} blankStepAndImage={blankStepAndImage} />}

                    {onPage === 4 && ((!recipeid) || (recipeid && !loading)) &&
                        <AddDetails details={details} handleEdit={handleDetailEdit} editing={editingDetails} setEditing={setEditingDetails} />}


                </div>

                <div className={uploaded ? styles.noshow : styles.navbuttons}>
                    {onPage !== 1 && <button onClick={() => { setOnPage(prev => prev - 1) }}> Previous </button>}
                    {onPage !== 4 && <button className={styles.next} onClick={() => { setOnPage(prev => prev + 1) }}> Next </button>}
                    {onPage === 4 && <button className={styles.recipesubmit} onClick={recipeSubmit}> {recipeid ? "Update Recipe" : "Upload Recipe"} </button>}
                </div>

                <div className={uploaded ? styles.uploadmessage : styles.noshow}>
                    <FontAwesomeIcon icon={faCircleCheck} size="3x" />
                    <p> {recipeid ? "Recipe successfully updated!" : "Recipe successfully uploaded!"} </p>
                </div>


            </section>

        </main>
    )

}

export default AddRecipe;