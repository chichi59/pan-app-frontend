import styles from '../css/Dash.module.css'
import React from 'react'
import RecipeList from '../components/RecipeList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKitchenSet } from '@fortawesome/free-solid-svg-icons'
import { faHourglassHalf } from '@fortawesome/free-regular-svg-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'




const Favorites = () => {


    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const [recipes, setRecipes] = React.useState([]);
    const [coverImages, setCoverImages] = React.useState([]);

    const fetchRecipes = async () => {
        let recipeMod = []
        try {
            const response = await axiosPrivate.get('/recipes/myrecipes/favorites')
            recipeMod = response.data;
            recipeMod.map((recipe) => { recipe.favorite = true; return recipe })
            setRecipes(recipeMod)
            setIsLoading(false);

        } catch (err) {
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)

            if (err?.response?.status === 401) {
                navigate('/login', { state: { from: location }, replace: true })
            }

            if (err?.response?.status === 400) {
                console.log(err.response.data.message)
            }

            return
        }
    }

    const fetchCoverImages = async () => {
        let images = []

        try {
            const response = await axiosPrivate.get('/recipes/myrecipes/favorites/coverimages');

            images = response.data.coverIms

            setCoverImages(images);

        } catch (err) {
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)

            if (err?.response?.status === 401) {
                navigate('/login', { state: { from: location }, replace: true })
            }

        }

    }

    const updateFavorite = async (recipeid) => {
        let success = false;
        try {
            const response = axiosPrivate.patch('/users', {
                recipeid: recipeid
            })

            success = true;

        } catch (err) {
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)
        }

        if (success) {

            const found = recipes.find((item) => item._id === recipeid)

            let updatedRecipes = []

            if (found.favorite) {
                updatedRecipes = recipes.filter((item) => item._id !== recipeid)
            } else {

                updatedRecipes = recipes.map((item) => {
                    if (item._id === recipeid) {
                        item.favorite = !item.favorite;
                    }
                    return item
                })
            }


            setRecipes(updatedRecipes);
        }
    }

    const deleteRecipe = async (recipeid) => {
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
            const updatedRecipes = recipes.filter((item) => item._id !== recipeid)
            setRecipes(updatedRecipes);
        }
    }

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        fetchRecipes();
        fetchCoverImages();
    }, [])


    return (
        <main className={styles.mainsection}>
            <div className={styles.pagehead}>
                <h2 className={styles.title}> Favorites </h2>
            </div>

            {!isLoading && recipes.length === 0 && <div className={styles.message}>
                <FontAwesomeIcon icon={faKitchenSet} size="3x" />
                <p> You don't have any favorites yet, let's go exploring!</p>
            </div>}

            {(isLoading || (recipes.length !== 0 && coverImages.length === 0)) && <div className={styles.message}>
                <FontAwesomeIcon icon={faHourglassHalf} size="3x" />
                <p> Loading favorites..</p>
            </div>}

            {recipes.length !== 0 && coverImages.length !== 0 && <RecipeList list={recipes} images={coverImages} updateFave={updateFavorite} deleteRecipe={deleteRecipe} />}
            <div className={styles.bgcricle}></div>
            <div className={styles.smallcircle}></div>
        </main>
    )
}

export default Favorites;