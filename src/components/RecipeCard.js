import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../css/RecipeCard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark as filledbookmark, faCircleChevronLeft, faCircleChevronRight, faFire, faPeopleGroup, faCheck, faXmark, faCarrot, faTrash, faPencil, faLock, faEarthAmericas } from '@fortawesome/free-solid-svg-icons'
import { faBookmark as emptybookmark, faClock } from '@fortawesome/free-regular-svg-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'



function RecipeCard({ recipe, key, coverImages, profilePic, recipeid, updateFave, deleteRecipe, placeholderImg }) {

    const {auth} = useAuth();
    const [fave, setFave] = React.useState(recipe.favorite)

    const [showDelete, setShowDelete] = React.useState(false);
    const [showUnfave, setShowUnfave] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [displayingImage, setDisplayingImage] = React.useState(0)

    const paths = new Set(['/home', '/explore', '/dash', '/favorites'])

    function toggleFave() {
        setFave((oldfave) => !oldfave)
    }

    function clickedFave(e) {
        e.stopPropagation();
        updateFave(recipeid);
        setShowUnfave(false);
    }

    function confirmDelete(e) {
        e.stopPropagation();
        setShowDelete(false);
        if (deleteRecipe) {
            deleteRecipe(recipeid)
        };

    }



    const [entered, setEntered] = React.useState(false)

    function toggleEntered() {
        setEntered((oldentered) => !oldentered)
    }

    let time = ''
    if (recipe.cooktime) {
        const cooktimeArr = recipe.cooktime.split(':');
        const hours = cooktimeArr[0] ? `${cooktimeArr[0]} hrs` : ''
        const mins = cooktimeArr[1] ? `${cooktimeArr[1]} mins` : ''

        time = hours && mins ? `${hours} ${mins}` : !mins ? hours : mins;

    }

    const goToProfile = (e) => {
        e.stopPropagation();
        Object.keys(auth).length ? navigate(`/profile/${recipe.owner}`): navigate(`/discoverprofile/${recipe.owner}`)
    }




    return (
        <>
            <div className={showDelete ? styles.delete : styles.none}>
                <FontAwesomeIcon className={styles.trashlarge} icon={faTrash} size="2x" />
                <p> {`Are you sure you'd like to delete ${recipe.title}?`} </p>
                <div className={styles.buttonset}>
                    <FontAwesomeIcon className={styles.selectyes} icon={faCheck}
                        onClick={confirmDelete} />
                    <FontAwesomeIcon className={styles.selectno} icon={faXmark}
                        onClick={(e) => { e.stopPropagation(); setShowDelete(false) }} />
                </div>

            </div>

            <div className={showUnfave ? styles.delete : styles.none}>
                <FontAwesomeIcon className={styles.trashlarge} icon={filledbookmark} size="2x" />
                <p> {`Are you sure you'd like to remove ${recipe.title} from favourites?`} </p>
                <div className={styles.buttonset}>
                    <FontAwesomeIcon className={styles.selectyes} icon={faCheck}
                        onClick={clickedFave} />
                    <FontAwesomeIcon className={styles.selectno} icon={faXmark}
                        onClick={(e) => { e.stopPropagation(); setShowUnfave(false) }} />
                </div>

            </div>


            

            <section onClick={() => {navigate(paths.has(location.pathname) ? location.pathname + `/recipe/${recipeid}` : `/explore/recipe/${recipeid}` ) }}
                onMouseEnter={toggleEntered} onMouseLeave={toggleEntered} className={showDelete || showUnfave ? styles.none : styles.recipecont}>

                {!recipe.owner && <div className={styles.options}>
                    <FontAwesomeIcon className={deleteRecipe ? styles.trash : styles.hidden} icon={faTrash} onClick={(e) => { e.stopPropagation(); setShowDelete(true) }} />
                    <FontAwesomeIcon className={deleteRecipe ? styles.edit : styles.hidden} icon={faPencil} onClick={(e) => { e.stopPropagation(); navigate(`/dash/editrecipe/${recipeid}`) }} />
                </div>}




                <FontAwesomeIcon onMouseEnter={toggleFave}
                    onMouseLeave={toggleFave}
                    onClick={(e) => {if(!fave) {e.stopPropagation(); setShowUnfave(true)} else{ clickedFave(e)}}}
                    icon={fave ? filledbookmark : emptybookmark} className={!entered && !fave ? styles.none : styles.bookmark} />



                <img className={styles.cardimg} src={coverImages && coverImages.length > 0 ? coverImages[displayingImage].imageURL : placeholderImg}>
                </img>

                {displayingImage - 1 >= 0 && <FontAwesomeIcon className={styles.iconleft} icon={faCircleChevronLeft} onClick={(e) => { e.stopPropagation(); setDisplayingImage((prev) => prev - 1) }} />}
                {coverImages && displayingImage + 1 < coverImages.length && <FontAwesomeIcon className={styles.iconright} icon={faCircleChevronRight} onClick={(e) => { e.stopPropagation(); setDisplayingImage((prev) => prev + 1) }} />}


                <div className={styles.info}>
                    <h2 className={styles.recipetitle}> {recipe.title} </h2>
                    {recipe.hasOwnProperty('ownerusername') && <div onClick={goToProfile} className={styles.ownersection}> <img src={profilePic}></img> <p>{recipe.ownerusername}</p></div>}
                    <div className={styles.infosection}>
                        {recipe.hasOwnProperty('public') && <p> <FontAwesomeIcon icon={recipe.public ? faEarthAmericas : faLock} /> {recipe.public ? "Public" : "Private"} </p>}
                        {recipe.calories && <p> <FontAwesomeIcon icon={faFire} /> {recipe.calories} Cal</p>}
                        {time && <p> <FontAwesomeIcon icon={faClock} /> {time} </p>}
                        {recipe.servings && <p> <FontAwesomeIcon icon={faPeopleGroup} /> Serves {recipe.servings}</p>}
                        {recipe.ingredients.length !== 0 && <p> <FontAwesomeIcon icon={faCarrot} /> {recipe.ingredients.length} ingredients</p>}
                    </div>
                </div>
            </section>
        </>
    )
}

export default RecipeCard;