import RecipeCard from "./RecipeCard";
import styles from '../css/RecipeList.module.css'

function RecipeList(){

    return (
        <section className={styles.recipelist}>
            <RecipeCard/>
            <RecipeCard/>
            <RecipeCard/>
            <RecipeCard/>
        </section>
    )
}

export default RecipeList;