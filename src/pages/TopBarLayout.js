import { Outlet } from 'react-router-dom'
import Logo from '../components/Logo'
import { Link } from 'react-router-dom'
import profile from '../img/profile.png'
import styles from '../css/TopBar.module.css'


const TopBarLayout = () => {


    return (
        <>
            <nav className={styles.topbar}>
                <Logo size="small" />
                <form>
                    <input className={styles.searchbar} 
                        placeholder="I want to make.."/>
                </form>

                <div className={styles.navlinks}>
                        <Link className={styles.links} to="/explore"> Explore </Link>
                        <Link className={styles.links} to="/user"> My Recipes </Link>
                        <Link className={styles.profilelink} to="/user"> <img className={styles.profile} src={profile}/>  </Link>
                </div>
                <nav className={styles.dropdowninvisible}>
                    <Link>Update Profile</Link>
                    <Link>Log Out</Link>
                    <Link>Settings</Link>
                </nav>
            </nav>
            <Outlet />
        </>
    )
}

export default TopBarLayout 