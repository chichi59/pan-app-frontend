import { Link } from 'react-router-dom'
import styles from '../css/Dash.module.css'
import React from 'react'
import RecipeList from '../components/RecipeList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faSquareCheck } from '@fortawesome/free-regular-svg-icons'



const Dash = () => {
    return (
        <main className={styles.mainsection}>
                <div className={styles.pagehead}>
                    <h2 className={styles.title}> My Recipes </h2>
                    <Link className={styles.newrecipe} to="/user/addrecipe"> <FontAwesomeIcon icon={faPlus}/> New Recipe </Link>
                </div>

                <RecipeList/>
                <div className={styles.bgcricle}></div>
                <div className={styles.smallcircle}></div> 
        </main>
    )
}

export default Dash