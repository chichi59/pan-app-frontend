import Logo from './Logo'
import { Link } from 'react-router-dom'
import profile from '../img/profile.png'
import styles from '../css/TopBar.module.css'
import React from 'react'


const TopBar = () => {

    const [down, setDown] = React.useState(false);


    function Dropdown() {
        return (
            <ul className={styles.dropdown}>
                <li> <Link className={styles.subnav} to="/profile"> Update Profile </Link> </li>
                <li> <Link className={styles.subnav} to="/explore"> Log Out </Link> </li>
                <li> <Link className={styles.subnav} to="/settings"> Settings </Link> </li>

            </ul>
        )
    }

    return (
        <nav className={styles.topbar}>
            <Logo size="small" />
            <form className={styles.form}>
                <input className={styles.searchbar}
                    placeholder="I want to make.." />
            </form>

            <ul className={styles.navlinks}>
                <li> <Link className={styles.links} to="/explore"> Explore </Link> </li>
                <li> <Link className={styles.links} to="/user"> My Recipes </Link> </li>
                <li className={styles.hasdrop}
                    onMouseEnter={() => setDown(true)}
                    onMouseLeave={() => setDown(false)}>
                    <Link className={styles.profilelink} to="/user">
                        <img className={down ? styles.profilehov : styles.profile} src={profile} />
                    </Link>
                    {down && <Dropdown />}


                </li>
            </ul>
        </nav>
    )
}

export default TopBar