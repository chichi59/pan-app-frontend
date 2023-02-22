import RecipeCard from "./RecipeCard";
import styles from '../css/RecipeList.module.css'
import React from 'react'
import pi1 from '../img/placeholder1.png'
import pi2 from '../img/placeholder2.png'
import pi3 from '../img/placeholder3.png'
import pp from '../img/profile.png'


function RecipeList({list, images, updateFave, profilePics,  deleteRecipe}){

    const [loading, setLoading] = React.useState(true);
    const [imageMap, setImageMap] = React.useState(new Map());
    const [placeholderImg, setPlaceholderImg] = React.useState([]);
    const [profilePicMap, setProfilePicMap] = React.useState(new Map());


    React.useEffect(() => {
        const tempMap = new Map();
        images.forEach(element => {
            tempMap.set(element.id, element.coverImages)
        });
        setImageMap(tempMap);
        const ims = [pi1, pi2, pi3];
        const placeholders = []
        
        for(let i = 0; i < list.length; i++){
            placeholders.push(ims[Math.floor(Math.random() * 3)])
        }

        setPlaceholderImg(placeholders);

        if(profilePics){
            const ppMap = new Map();

            for(const pic of profilePics){
                ppMap.set(pic.id, pic.imageURL)
            }

            setProfilePicMap(ppMap);

        }


        setLoading(false);



    }, [])


    return (
         <section className={styles.recipelist}>
            {!loading && list?.map((item, index) => {
                return (

                    <RecipeCard recipe={item} coverImages={imageMap.get(item._id)} key={item._id} recipeid={item._id} updateFave={updateFave}
                    deleteRecipe={deleteRecipe} placeholderImg={placeholderImg[index]} profilePic={item.hasOwnProperty('owner') ? profilePicMap.get(item.owner) : pp}/>
                )
            })}
        </section>
    )
}

export default RecipeList;