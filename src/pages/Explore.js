import styles from '../css/Dash.module.css'
import React from 'react'
import RecipeList from '../components/RecipeList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKitchenSet } from '@fortawesome/free-solid-svg-icons'
import { faHourglassHalf } from '@fortawesome/free-regular-svg-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'
import HomeNav from '../components/HomeNav.js'





const Explore = () => {

    const { auth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const [recipes, setRecipes] = React.useState([]);
    const [coverImages, setCoverImages] = React.useState([]);
    const [profilePics, setProfilePics] = React.useState([]);
    
    const fetchRecipes = async () => {
        let recipeMod = []
        try{
            const response = Object.keys(auth).length ? await axiosPrivate.get('/recipes/') : await axios.get('/recipes/explore')
            recipeMod = response.data;
            setRecipes(recipeMod)
            setIsLoading(false);
        }catch(err){
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)

            if (err?.response?.status === 401){
                navigate('/login', {state: {from: location}, replace: true})
            }

            if (err?.response?.status === 400){
                console.log(err.response.data.message)
            }

            return
        }
    }

    const fetchCoverImages = async () => {
        let images = []

        try{
            const response = await axiosPrivate.get('/recipes/explore/images');

            images = response.data.coverIms 
            
            setCoverImages(images);
            setProfilePics(response.data.profilePics);
            

            
        }catch(err){
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)

            if (err?.response?.status === 401){
                navigate('/login', {state: {from: location}, replace: true})
            }

        }

    }

    const updateFavorite = async (recipeid) => {
        if(Object.keys(auth).length === 0) {
            navigate('/login')
            return
        }
        
        let success = false;
        try{
            const response = axiosPrivate.patch('/users',{
                recipeid: recipeid
            })

            success = true;
        
        }catch(err){
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)
        }

        if(success){
            const updatedRecipes = recipes.map((item) => {
                if(item._id === recipeid){
                    item.favorite = !item.favorite;
                }
                return item 
            })

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
                {Object.keys(auth).length === 0 && <HomeNav />}
                <div className={styles.pagehead}>
                    <h2 className={styles.title}> Explore Recipes </h2>
                </div>

                {!isLoading && recipes.length === 0 && <div className={styles.message}>
                    <FontAwesomeIcon icon={faKitchenSet} size="3x"/> 
                    <p> Whoops, no one has public recipes!</p>
                </div>}

                {(isLoading ||(recipes.length !== 0 && coverImages.length === 0)) && <div className={styles.message}>
                    <FontAwesomeIcon icon={faHourglassHalf} size="3x"/> 
                    <p> Loading recipes..</p>
                </div>}

                {recipes.length !== 0 && coverImages.length !== 0 && <RecipeList list={recipes} images={coverImages} profilePics={profilePics} updateFave={updateFavorite}/>}
                
        </main>
    )
}

export default Explore;