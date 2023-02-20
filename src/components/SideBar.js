import Logo from './Logo'
import { Link, NavLink } from 'react-router-dom'
import profile from '../img/profile.png'
import styles from '../css/SideBar.module.css'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils } from '@fortawesome/free-solid-svg-icons'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faCookieBite } from '@fortawesome/free-solid-svg-icons'


function SideBar(){

    return (
        <nav className={styles.sidebar}>
            <ul className={styles.sidelist}>
                <li className={styles.sectionhead}> LIBRARY </li>
                <li> <NavLink to="/dash" className={({isActive}) => isActive  ? styles.active : styles.link}>
                    <FontAwesomeIcon icon={faUtensils} className={styles.icon} />
                    My Recipes</NavLink> </li>
                <li> <NavLink to="/favorites" className={({isActive}) => isActive ? styles.active : styles.link}>
                    <FontAwesomeIcon icon={faBookmark} className={styles.icon}/>
                    Favourites</NavLink> </li>
                <li className={styles.sectionhead}> DISCOVER </li>
                <li><NavLink to="/homefeed" className={({isActive}) => isActive ? styles.active : styles.link}>
                    <FontAwesomeIcon icon={faHouse} className={styles.icon}/>
                    Home</NavLink></li>
                <li><NavLink to="/explore" className={({isActive}) => isActive ? styles.active : styles.link}>
                    <FontAwesomeIcon icon={faCookieBite} className={styles.icon}/>
                    Explore</NavLink></li>

            </ul>
        </nav>
    )


}


export default SideBar;