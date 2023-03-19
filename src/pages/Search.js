
import React from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import RecipeList from "../components/RecipeList";
import styles from '../css/Dash.module.css'
import Recipe from "./Recipe";
import pp from '../img/profile.png'





const Search = () => {

    const [searchParams] = useSearchParams();
    const [userDetails, setUserDetails] = React.useState([]);
    const [recipes, setRecipes] = React.useState([]);
    const [profilePics, setProfilePics] = React.useState([])
    const [coverImages, setCoverImages] = React.useState([])
    const location = useLocation();
    const navigate = useNavigate();


    React.useEffect(() => {
        const fetchResults = async () => {
            try {

                const response = await axiosPrivate.get(`/search?q=${searchParams.get('query')}`)
                console.log(searchParams.get('query'), response.data)
                setRecipes(response.data.recipes)
                setUserDetails(response.data.users)
                setProfilePics(response.data.recipeProfPics)
                setCoverImages(response.data.recipeCoverIms)


            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
            }
        }


        fetchResults();
    }, [])

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

    const follow = async (followid) => {
        try {
            await axiosPrivate.patch('/users/', {
                following: followid
            })
        } catch (err) {
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)

        }

        let updatedUserDetails = userDetails.map((item) => {
            if(item._id === followid){
                item.followed = !item.followed
            }
            return item
        })

        setUserDetails(updatedUserDetails)
    }

    //recipe list
    //user list 


    return (
        <main className={styles.mainsection}>
            <div className={styles.pagehead}>
                <h2 className={styles.title}> Search Results </h2>
            </div>

            {userDetails.length > 0 && <div>
                <h2> Users </h2>

                <ul className={styles.userlist}>
                    {userDetails.map((item) => {
                        return (
                            <li onClick={() => {item.hasOwnProperty('followed') ? navigate(`/profile/${item._id}`) : navigate(`/profile`) }} className={styles.usercard}>
                                <img src={item.profilePictureURL ? item.profilePictureURL : pp}></img>
                                <p> {item.username} </p>
                                {(item.firstname || item.lastname) && <p> {`${item.firstname ? item.firstname : ''} ${item.lastname ? item.lastname : ''} `} </p>} 
                                {item.hasOwnProperty('followed') && <button onClick={follow}> {item.followed ? 'Unfollow' : 'Follow'} </button>}
                            </li>
                        )
                    })}
                </ul>
            </div>}

            {recipes.length > 0 && <div>
                <h2> Recipes </h2>
                <RecipeList list={recipes} images={coverImages} profilePics={profilePics} updateFave={updateFavorite} deleteRecipe={deleteRecipe} />
            </div>}






            



        </main>
    )


}

export default Search; 