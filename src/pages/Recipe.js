
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faPencil, faTrash, faCircleChevronLeft, faCircleChevronRight, faFire, faPeopleGroup, faCheck, faXmark, faLock, faCarrot, faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { useNavigate, useLocation } from "react-router-dom";
import styles from '../css/Recipe.module.css'
import ri1 from '../img/placeholder1.png'
import ri2 from '../img/placeholder2.png'
import ri3 from '../img/placeholder3.png'
import pp from '../img/profile.png'

const Recipe = () => {
    const { id } = useParams();
    const recipeid = id;
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const [recipe, setRecipe] = React.useState({})
    const [isLoading, setIsLoading] = React.useState(true)
    const [deleteScreen, setDeleteScreen] = React.useState(false);
    const [recipeImages, setRecipeImages] = React.useState([]);
    const [currViewing, setCurrViewing] = React.useState(0);
    const [profilePic, setProfilePic] = React.useState(pp)

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axiosPrivate.get(`/recipes/${recipeid}`)
                setRecipe(response.data)

            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
            }
        }

        const fetchImages = async () => {
            let stepImages = []

            try {
                const response = await axiosPrivate.get(`/recipes/${recipeid}/stepimages`);
                stepImages = response.data.stepIms;
                if(response.data.profilePic){
                    setProfilePic(response.data.profilePic)
                }
                


            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)

                if (err?.response?.status === 401) {
                    navigate('/login', { state: { from: location }, replace: true })
                }

            }

            let coverImages = []

            try {
                const response = await axiosPrivate.get(`/recipes/${recipeid}/coverimages`);

                coverImages = response.data.coverIms
                setIsLoading(false);

            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)

                if (err?.response?.status === 401) {
                    navigate('/login', { state: { from: location }, replace: true })
                }

            }


            const placeholders = [ri1, ri2, ri3];

            if (stepImages.length === 0 && coverImages.length === 0) {
                const remove = Math.floor(Math.random() * 3);
                placeholders.splice(remove, 1)
                setRecipeImages(placeholders);
                return
            }

            let images = []

            if (coverImages.length > 0) {
                images.push(coverImages[0])
            }

            images = images.concat(stepImages);

            for (let i = 1; i < coverImages.length; i++) {
                images.push(coverImages[i]);
            }

            if (images.length < 2) {
                const remove = Math.floor(Math.random() * 3);
                placeholders.splice(remove, 1);
                images = images.concat(placeholders);
            }

            setRecipeImages(images);

        }

        fetchRecipe();
        fetchImages();


    }, [])

    function editRecipe() {
        navigate(`/dash/editrecipe/${recipeid}`)
    }

    function deleteRecipe() {
        let success = false;
        try {
            const response = axiosPrivate.delete('/recipes/myrecipes', {
                data: {
                    recipeid: recipeid
                }
            })

            success = true;
        } catch (err) {
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)
        }

        if (success) {
            navigate('/dash')
        }
    }

    let time = ''
    if (recipe.cooktime) {
        const cooktimeArr = isLoading ? '' : recipe.cooktime.split(':');
        const hours = cooktimeArr[0] ? `${cooktimeArr[0]} hrs` : ''
        const mins = cooktimeArr[1] ? `${cooktimeArr[1]} mins` : ''
        time = hours && mins ? `${hours} ${mins}` : !mins ? hours : mins;
    }

    const goToProfile = (e) => {
        e.stopPropagation();
        navigate(`/profile/${recipe.owner}`)
    }





    return (
        <main className={styles.mainsection}>

            <div className={styles.ingredientsection}>
                <h3> Ingredients </h3>
                {isLoading ? <p> Loading..</p> :
                    recipe.ingredients && recipe.ingredients.length === 0 ? <p> No ingredients added yet</p> :
                        <ul className={styles.ingredientlist}>
                            {
                                recipe.ingredients.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <input type="checkbox" />
                                            {item.unit ? `${item.quantity} ${item.unit} of ${item.ingredient}` : `${item.quantity} ${item.ingredient}` }
                                        </li>
                                    )
                                })

                            }



                        </ul>
                }

            </div>



            <div className={styles.stepsection}>
                <div className={styles.midsection}>

                    <div className={styles.titlecard}>
                        <div className={styles.titlebar}>
                            <h1 className={styles.title}> {isLoading ? "Loading.." : recipe.title} </h1>
                            {!isLoading && !recipe.owner && <div className={styles.iconset}>
                                <FontAwesomeIcon icon={faPencil} onClick={editRecipe} />
                                <FontAwesomeIcon icon={faTrash} onClick={() => { setDeleteScreen(true) }} />
                            </div>}
                        </div>

                        {!isLoading && deleteScreen &&
                            <div className={styles.deleteinfosection}>

                                <p> <FontAwesomeIcon icon={faTriangleExclamation} /> Are you sure you'd like to delete this recipe?</p>
                                <div className={styles.delete}>
                                    <FontAwesomeIcon className={styles.selectyes} icon={faCheck}
                                        onClick={deleteRecipe} />
                                    <FontAwesomeIcon className={styles.selectno} icon={faXmark}
                                        onClick={(e) => { setDeleteScreen(false) }} />
                                </div>
                            </div>
                        }

                        {!isLoading && !deleteScreen && recipe.hasOwnProperty('ownerusername') &&
                            <div className={styles.ownersection} onClick={goToProfile}>
                                <img src={profilePic}></img>
                                <p> {recipe.ownerusername} </p>
                            </div>}

                        {!isLoading && !deleteScreen &&
                            <div className={styles.infosection}>
                                {recipe.hasOwnProperty('public') && <p> <FontAwesomeIcon icon={recipe.public ? faEarthAmericas : faLock} /> {recipe.public ? "Public" : "Private"} </p>}
                                {recipe.calories && <p> <FontAwesomeIcon icon={faFire} /> {recipe.calories} Cal</p>}
                                {time && <p> <FontAwesomeIcon icon={faClock} /> {time} </p>}
                                {recipe.servings && <p> <FontAwesomeIcon icon={faPeopleGroup} /> Serves {recipe.servings}</p>}
                                {recipe.ingredients && recipe.ingredients.length !== 0 && <p> <FontAwesomeIcon icon={faCarrot} /> {recipe.ingredients.length} ingredients</p>}
                            </div>}
                    </div>

                    <div className={styles.imgcontainer}>
                        {!isLoading && recipeImages.length > 0 && <div className={styles.imgsection}>
                            {currViewing - 1 >= 0 && <FontAwesomeIcon className={styles.iconleft} onClick={() => setCurrViewing((prev) => prev - 1)} icon={faCircleChevronLeft} />}

                            <img src={recipeImages[currViewing].hasOwnProperty('imageURL') ? recipeImages[currViewing].imageURL : recipeImages[currViewing]}></img>

                            {recipeImages[currViewing].hasOwnProperty('stepNum') && <p className={styles.firstcap}>
                                {`Step ${recipeImages[currViewing].stepNum}`}
                            </p>
                            }

                            <img src={recipeImages[currViewing + 1].hasOwnProperty('imageURL') ? recipeImages[currViewing + 1].imageURL : recipeImages[currViewing + 1]}></img>

                            {recipeImages[currViewing + 1].hasOwnProperty('stepNum') && <p className={styles.secondcap}>
                                {`Step ${recipeImages[currViewing + 1].stepNum}`}
                            </p>
                            }

                            {currViewing + 2 < recipeImages.length && <FontAwesomeIcon className={styles.iconright} icon={faCircleChevronRight} onClick={() => setCurrViewing((prev) => prev + 1)} />}
                        </div>
                        }


                    </div>

                </div>


                <div className={styles.stepscontent}>
                    <h3> Steps </h3>

                    {isLoading ? <p> Loading..</p> :
                        !recipe.steps || recipe.steps.length === 0 ? <p> No steps added yet</p> :
                            <ol className={styles.steplist}>
                                {
                                    recipe.steps.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                {item}
                                            </li>
                                        )
                                    })

                                }
                            </ol>
                    }
                </div>


            </div>



        </main>


    )

}


export default Recipe;