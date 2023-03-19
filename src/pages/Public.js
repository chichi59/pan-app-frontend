import { Link } from 'react-router-dom'
import HomeNav from '../components/HomeNav.js'
import Footer from '../components/Footer.js'
import styles from '../css/Public.module.css'
import useAuth from '../hooks/useAuth.js'

const Public = () => {
    const {auth} = useAuth();
    return (
        <div className={styles.page}>
            <div className={styles.top}> 
                <HomeNav/>
                <main className={styles.mainsection}>
                    <h1 className={styles.title}> Your favourite recipes, at your fingertips</h1>
                    <Link className={styles.signup} to={Object.keys(auth).length === 0 ? '/signup' : '/explore'}> {Object.keys(auth).length === 0 ? 'Sign Up' : 'Explore'} </Link>
                    <div className={styles.bgcircle}> </div>
                
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default Public