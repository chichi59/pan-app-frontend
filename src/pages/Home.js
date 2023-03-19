import styles from '../css/Dash.module.css'
import React, { useReducer } from 'react'
import RecipeList from '../components/RecipeList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKitchenSet, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { faHourglassHalf } from '@fortawesome/free-regular-svg-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import pp from '../img/profile.png'
import FollowList from '../components/FollowList'



const Home = () => {


    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const [recipes, setRecipes] = React.useState([]);
    const [coverImages, setCoverImages] = React.useState([]);
    const [profilePics, setProfilePics] = React.useState([])
    const [followerDetails, setFollowerDetails] = React.useState([])



    const fetchFollowing = async () => {
        try {
            const response = await axiosPrivate.get('/users/following')
            setFollowerDetails(response.data)
        }catch(err){
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)
        }
    }

    
    const fetchRecipes = async () => {
        let recipeMod = []
        try{
            const response = await axiosPrivate.get('/recipes/following')
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
            const response = await axiosPrivate.get('/recipes/following/images');

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
        fetchFollowing();
        fetchRecipes();
        fetchCoverImages();
    }, [])



    function goToProfile(id){
        navigate(`/profile/${id}`)
    }

    const unfollow = async (id) => {
        try{
            const response = await axiosPrivate.patch('/users/', {
                following: id
            })
        } catch(err){
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)

        }

        setFollowerDetails(followerDetails.filter((item) => item.id !== id))
        setRecipes(recipes.filter((item) => item.owner !== id))
    }


    return (
        <main className={styles.mainsection}>
                <div className={styles.pagehead}>
                    <h2 className={styles.title}> Home </h2>
                </div>

                {!isLoading && followerDetails.length !== 0 && 
                    <FollowList followerDetails={followerDetails} goToProfile={goToProfile} unfollow={unfollow} />
                }

                {!isLoading && recipes.length === 0 && <div className={styles.message}>
                    <FontAwesomeIcon icon={faKitchenSet} size="3x"/> 
                    <p> Follow your favorite accounts and users for more recipes!</p>
                </div>}

                {(isLoading ||(recipes.length !== 0 && coverImages.length === 0)) && <div className={styles.message}>
                    <FontAwesomeIcon icon={faHourglassHalf} size="3x"/> 
                    <p> Loading recipes..</p>
                </div>}

                {recipes.length !== 0 && coverImages.length !== 0 && <RecipeList list={recipes} profilePics={profilePics} images={coverImages} updateFave={updateFavorite}/>}
                <div className={styles.bgcricle}></div>
                <div className={styles.smallcircle}></div> 
        </main>
    )
}

export default Home;