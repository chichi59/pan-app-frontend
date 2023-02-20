import Logo from './Logo'
import { Link } from 'react-router-dom'
import profile from '../img/profile.png'
import styles from '../css/TopBar.module.css'
import React from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const LOGOUT_URL = '/auth/logout'

const TopBar = () => {

    const [down, setDown] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate();


    const clickedLogOut = async (e) => {
        e.preventDefault();
        let success = true;
        try{
            const response = await axiosPrivate.post(LOGOUT_URL, {
                withCredentials: true
            })
        }catch(err){
            success = false;
            if(!err?.response){
                console.log('No server response')
            }else if(err.response?.status === 204){
                console.log('No such user exists')
            }else if(err.response?.status === 401){
                console.log('Unauthorized')
            }else{
                console.log('Logout failed')
            }

            navigate('/login', {replace: true})

        }

        if(success){
            setAuth({})
            navigate('/')
        }


    }



    //add signout functionality

    function Dropdown() {
        return (
            <ul className={styles.dropdown}>
                <li> <Link className={styles.subnav} to="/profile/settings"> Profile Settings </Link> </li>
                <li> <Link className={styles.subnav} to="/explore" onClick={clickedLogOut}> Log Out </Link> </li>
            </ul>
        )
    }

    return (
        <nav className={styles.topbar}>
            <Logo size="small" />
            <form className={styles.form}>
                <input className={styles.searchbar}
                    placeholder="I want to make.."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
            </form>

            <ul className={styles.navlinks}>
                <li> <Link className={styles.links} to="/explore"> Explore </Link> </li>
                <li> <Link className={styles.links} to="/dash"> My Recipes </Link> </li>
                <li className={styles.hasdrop}
                    onMouseEnter={() => setDown(true)}
                    onMouseLeave={() => setDown(false)}>
                    <Link className={styles.profilelink} to="/profile">
                        <img className={down ? styles.profilehov : styles.profile} src={profile} />
                    </Link>
                    {down && <Dropdown />}


                </li>
            </ul>
        </nav>
    )
}

export default TopBar