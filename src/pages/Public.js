import { Link } from 'react-router-dom'
import HomeNav from '../components/HomeNav.js'
import Footer from '../components/Footer.js'
import styles from '../css/Public.module.css'

const Public = () => {
    return (
        <div className={styles.page}>
            <div className={styles.top}> 
                <HomeNav/>
                <main className={styles.mainsection}>
                    <h1 className={styles.title}> Your favourite recipes, at your fingertips</h1>
                    <Link className={styles.signup} to='/signup'> Sign Up</Link>
                    <div className={styles.bgcircle}> </div>
                
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default Public