import { Link } from 'react-router-dom'
import panlogo from '../img/panlogo.png'
import styles from '../css/HomeNav.module.css'

function HomeNav(){
    return (
        <div>
            <div className={styles.nav} >
                <Link className={styles.logo} to="/">
                    <h1 className={styles.logoname}> Pan </h1>
                    <img className={styles.logoimg} src={panlogo}/>
                </Link>
                <div className={styles.navlinks}>
                    <Link className={styles.links} to="/explore"> Explore </Link>
                    <Link className={styles.links} to="/login"> Log In </Link>
                    <Link className={styles.signup} to="/signup"> Sign Up </Link>
                </div>
            </div>
        </div>
    )
}

export default HomeNav