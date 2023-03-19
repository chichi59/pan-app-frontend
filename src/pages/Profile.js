import RecipeList from '../components/RecipeList';
import styles from '../css/Profile.module.css'
import React from 'react';
import axios, { axiosPrivate } from '../api/axios';
import pp from '../img/profile.png'
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKitchenSet, faTrash, faPencil, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import HomeNav from '../components/HomeNav';



const Profile = () => {
    const {auth} = useAuth();

    const { id } = useParams();
    const [isLoading, setIsLoading] = React.useState(true);
    const [userDetails, setUserDetails] = React.useState([])
    const [profilePic, setProfilePic] = React.useState(pp)
    const [userRecipes, setUserRecipes] = React.useState([])
    const [coverImages, setCoverImages] = React.useState([])
    const [userFavoriteRecipes, setUserFavoriteRecipes] = React.useState([])
    const [favoriteCoverImages, setFavoriteCoverImages] = React.useState([])
    const [profilePics, setProfilePics] = React.useState([])
    const [userid, setUserid] = React.useState('')
    const [showDelete, setShowDelete] = React.useState(false)

    const navigate = useNavigate();

    


    React.useEffect(() => {
        const fetchUserDetailsAndProfilePic = async () => {

            let uid = ''
            try {
                const response = Object.keys(auth).length === 0 ? await axios.get(`/users/explore/${id}`) : id ? await axiosPrivate.get(`/users/${id}`) : await axiosPrivate.get('/users/me')
                if (!id) {
                    setUserid(response.data._id)
                    uid = response.data._id
                }
                setUserDetails(response.data)


            } catch (err) {
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
            }



            try {
                const response = Object.keys(auth).length === 0 ? await axios.get(`/users/explore/${id}/profilepic`) :  id ? await axiosPrivate.get(`/users/explore/${id}/profilepic`) : await axiosPrivate.get(`/users/explore/${uid}/profilepic`)
                if (response.data.imageURL) setProfilePic(response.data.imageURL);

                setIsLoading(false);


            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
            }
        }

        const fetchUserPublicRecipesAndCoverImages = async () => {
            try {
                
                const response = Object.keys(auth).length === 0 ? await axios.get(`/recipes/explore/user/${id}`) : id ? await axiosPrivate.get(`/recipes/user/${id}/`) : await axiosPrivate.get(`/recipes/user/${userid}`)
                setUserRecipes(response.data)
            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
            }

            try {
                const response = Object.keys(auth).length === 0 ? await axios.get(`/recipes/explore/user/${id}/coverimages/`) : id ? await axiosPrivate.get(`/recipes/explore/user/${id}/coverimages/`) : await axiosPrivate.get(`/recipes/explore/user/${userid}/coverimages/`)
                setCoverImages(response.data.coverIms)

            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
            }
        }

        const fetchUserPublicFavoritesAndFavoriteCoverImages = async () => {
            try {

                const response = Object.keys(auth).length === 0 ? await axios.get(`/recipes/explore/user/${id}/favorites`) : id ? await axiosPrivate.get(`/recipes/user/${id}/favorites`) : await axiosPrivate.get(`/recipes/user/${userid}/favorites`)
                setUserFavoriteRecipes(response.data)
            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
            }

            try {
                const response = Object.keys(auth).length === 0 ? await axios.get(`/recipes/explore/user/${id}/favorites/coverimages/`) : id ? await axiosPrivate.get(`/recipes/explore/user/${id}/favorites/coverimages/`) : await axiosPrivate.get(`/recipes/explore/user/${userid}/favorites/coverimages/`)
                console.log(response.data)
                setFavoriteCoverImages(response.data.coverIms)
                setProfilePics(response.data.profilePics)

            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
            }

        }

        if (!userid) {
            fetchUserDetailsAndProfilePic();
        }

        if (id || userid) {
            fetchUserPublicRecipesAndCoverImages();
            fetchUserPublicFavoritesAndFavoriteCoverImages();
        }



    }, [userid])

    let name = ''
    let month = ''
    let year = ''

    if (userDetails) {
        name = userDetails.firstname ? name + userDetails.firstname : name
        name = userDetails.lastname ? `${name} ${userDetails.lastname}` : name


        if (userDetails.createdAt) {
            const date = new Date()
            year = date.getFullYear()
            month = date.toLocaleString('en-US', { month: 'short' });
        }
    }


    const updateFavorite = async (recipeid) => {
        if(Object.keys(auth).length === 0) {
            navigate('/login')
            return
        }

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
            let updatedRecipes = userFavoriteRecipes.map((item) => {
                if (item._id === recipeid) {
                    item.favorite = !item.favorite;
                }
                return item
            })

            setUserFavoriteRecipes(updatedRecipes)

            let updatedRecipesA = userRecipes.map((item) => {
                if (item._id === recipeid) {
                    item.favorite = !item.favorite;
                }
                return item
            })

            setUserRecipes(updatedRecipesA)

        }


    }


    const deleteFavorite = (recipeid) => {
        deleteRecipe(recipeid, true)
    }

    const deleteUserRecipe = (recipeid) => [
        deleteRecipe(recipeid, false)
    ]


    const deleteRecipe = async (recipeid, favorites) => {
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

        let recipes = []

        if (favorites) {
            recipes = userFavoriteRecipes
        } else {
            recipes = userRecipes
        }

        if (success) {
            const updatedRecipes = recipes.filter((item) => item._id !== recipeid)
            if (favorites) {
                setUserFavoriteRecipes(updatedRecipes)
            } else {
                setUserRecipes(updatedRecipes)
            }
        }
    }


    const follow = async () => {

        if(Object.keys(auth).length === 0) {
            navigate('/login')
            return
        }

        try {
            await axiosPrivate.patch('/users/', {
                following: id
            })
        } catch (err) {
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)

        }

        setUserDetails({ ...userDetails, followed: !userDetails.followed })
    }

    const confirmDelete = async () => {
        try{
            const response = await axiosPrivate.delete('/users')
        }catch(err){
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)
        }

        navigate('/', {replace: true});
    }



    //get the bigger version of the profile image!! 
    //if it's your profile, add edit buttons! 
    //this page will have scroll!!
    //make the whole section scroll, starting from the top, buttt make the scrollbar disappear when you're scrolling
    //the individual section eg. favorites

    //isLoading!!

    return (
        !isLoading && <main className={styles.profilesection}>
            {Object.keys(auth).length === 0 && <HomeNav />}
            <div>
                <img src={profilePic}></img>
                <h1>{userDetails.username}</h1>
                {name && <h3> {`${userDetails.firstname} ${userDetails.lastname}`}</h3>}
                {month && year && <p> Joined {month} {year}</p>}
                {!userid && !userDetails.followed && <button onClick={follow}> Follow </button>}
                {!userid && userDetails.followed && <button onClick={follow}> Unfollow </button>}

                {userid && <div className={styles.options}>
                    <FontAwesomeIcon icon={faTrash} onClick={(e) => { e.stopPropagation(); setShowDelete(true) }} />
                    <FontAwesomeIcon icon={faPencil} onClick={(e) => { e.stopPropagation(); navigate(`/profile/edit`) }} />
                </div>}

                {showDelete && <div>
                    <FontAwesomeIcon className={styles.trashlarge} icon={faTrash} size="2x" />
                    <p> {`Are you sure you'd like to delete your account and recipes?`} </p>
                    <div className={styles.buttonset}>
                        <FontAwesomeIcon className={styles.selectyes} icon={faCheck}
                            onClick={confirmDelete} />
                        <FontAwesomeIcon className={styles.selectno} icon={faXmark}
                            onClick={(e) => { e.stopPropagation(); setShowDelete(false) }} />
                    </div>
                </div>
                }



            </div>



            <h2> Recipes </h2>

            {userRecipes.length === 0 && <div className={styles.message}>
                <FontAwesomeIcon icon={faKitchenSet} size="3x" />
                <p> No public recipes yet!</p>
            </div>}

            {userRecipes.length > 0 && coverImages.length > 0 && <RecipeList list={userRecipes} images={coverImages} updateFave={updateFavorite} profilePics={profilePic} deleteRecipe={deleteFavorite} />}

            <h2> Favorites </h2>

            {userFavoriteRecipes.length === 0 && <div className={styles.message}>
                <FontAwesomeIcon icon={faKitchenSet} size="3x" />
                <p> No favourites yet!</p>
            </div>}

            {userFavoriteRecipes.length > 0 && favoriteCoverImages.length > 0 && <RecipeList list={userFavoriteRecipes} images={favoriteCoverImages} updateFave={updateFavorite} profilePics={profilePics} deleteRecipe={deleteUserRecipe} />}
        </main>

    )

}

export default Profile;