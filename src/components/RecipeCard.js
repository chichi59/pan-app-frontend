import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../css/RecipeCard.module.css'
import img1 from '../img/cardimg.jpg'
import img2 from '../img/cardimg.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark as filledbookmark} from '@fortawesome/free-solid-svg-icons'
import { faBookmark as emptybookmark } from '@fortawesome/free-regular-svg-icons'
import { faFire} from '@fortawesome/free-solid-svg-icons'
import { faClock} from '@fortawesome/free-regular-svg-icons'
import { faPeopleGroup} from '@fortawesome/free-solid-svg-icons'
import { faCarrot} from '@fortawesome/free-solid-svg-icons'
import { faTrash} from '@fortawesome/free-solid-svg-icons'
import { faPencil} from '@fortawesome/free-solid-svg-icons'







function RecipeCard(){

    const [fave, setFave] = React.useState(false)

    function toggleFave(){
        setFave((oldfave) => !oldfave)
    }

    const [entered, setEntered] = React.useState(false)

    function toggleEntered(){
        setEntered((oldentered) => !oldentered)
    }

    return (
        <section onMouseEnter={toggleEntered} onMouseLeave={toggleEntered} className={styles.recipecont}>
            <div className={styles.options}>
                <FontAwesomeIcon className={styles.trash} icon={faTrash}/>
                <FontAwesomeIcon className={styles.edit} icon={faPencil}/>
            </div>
            


            <FontAwesomeIcon onMouseEnter={toggleFave} 
            onMouseLeave={toggleFave}
            onClick={toggleFave}
            icon={fave ? filledbookmark : emptybookmark} className={!entered && !fave ? styles.none : styles.bookmark  }/>



            <img className={styles.cardimg} src={img1}></img>
            <div className={styles.info}>
                <h2 className={styles.recipetitle}> Spinach Risotto</h2>
                <div className={styles.infosection}>
                    <p> <FontAwesomeIcon icon={faFire}/> 120 Cal</p>
                    <p> <FontAwesomeIcon icon={faClock}/> 3hrs 2mins</p>
                    <p> <FontAwesomeIcon icon={faPeopleGroup}/> Serves 3</p>
                    <p> <FontAwesomeIcon icon={faCarrot}/> 10 ingredients</p>
                </div>
            </div>
        </section>
    )
}

export default RecipeCard;