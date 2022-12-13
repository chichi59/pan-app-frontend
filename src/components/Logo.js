import { Link } from 'react-router-dom'
import styles from '../css/Logo.module.css'
import panlogo from '../img/panlogo.png'

function Logo({size="medium"}){
    return (
        <Link className={styles.logo} to="/">
            <h1 className={size === "medium" ? styles.logonamemed : styles.logonamesmall}> Pan </h1>
            <img className={size === "medium" ? styles.logoimgmed : styles.logoimgsmall} src={panlogo}/>
        </Link>
    )
}

export default Logo;