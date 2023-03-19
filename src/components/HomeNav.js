import { Link } from 'react-router-dom'
import panlogo from '../img/panlogo.png'
import styles from '../css/HomeNav.module.css'
import useAuth from '../hooks/useAuth'
import React from 'react'
import pp from '../img/profile.png'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'


const LOGOUT_URL = '/auth/logout'

function HomeNav() {
    const { auth, setAuth } = useAuth();
    const [down, setDown] = React.useState(false);
    const [username, setUsername] = React.useState('')
    const [profilePic, setProfilePic] = React.useState(pp)
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();


    React.useEffect(() => {
        const fetchUsernameAndProfilePic = async () => {
            let id = ''
            try {
                const response = await axiosPrivate.get('/users/me')
                id = response.data._id.toString()
                setUsername(response.data.username)
            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
            }


            if (id) {
                let url = ''
                try {
                    const response = await axiosPrivate.get(`/users/explore/${id}/profilepic`)
                    url = response.data.imageURL


                } catch (err) {
                    console.log(err.response?.data);
                    console.log(err.response?.status);
                    console.log(err.response?.headers);
                    console.log(err.message)

                }

                if (url) setProfilePic(url)
            }
        }

        if (Object.keys(auth).length) {
            fetchUsernameAndProfilePic();
        }
    }, [])

    function Dropdown() {
        return (
            <ul className={styles.dropdown}>
                <li> <Link className={styles.subnav} to="/profile"> Profile </Link> </li>
                <li> <Link className={styles.subnav} to="/discover" onClick={clickedLogOut}> Log Out </Link> </li>
            </ul>
        )
    }

    const clickedLogOut = async (e) => {
        e.preventDefault();
        let success = true;
        try {
            const response = await axiosPrivate.post(LOGOUT_URL, {
                withCredentials: true
            })
        } catch (err) {
            success = false;
            if (!err?.response) {
                console.log('No server response')
            } else if (err.response?.status === 204) {
                console.log('No such user exists')
            } else if (err.response?.status === 401) {
                console.log('Unauthorized')
            } else {
                console.log('Logout failed')
            }

            navigate('/login', { replace: true })

        }

        if (success) {
            setAuth({})
            navigate('/')
        }


    }




    return (
        <div>
            <div className={styles.nav} >
                <Link className={styles.logo} to="/">
                    <h1 className={styles.logoname}> Pan </h1>
                    <img className={styles.logoimg} src={panlogo} />
                </Link>
                <div className={styles.navlinks}>
                    <Link className={styles.links} to={Object.keys(auth).length ? "/explore" : "/discover"}> Explore </Link>
                    {Object.keys(auth).length === 0 && <Link className={styles.links} to="/login"> Log In </Link>}
                    {Object.keys(auth).length === 0 && <Link className={styles.signup} to="/signup"> Sign Up </Link>}

                    {Object.keys(auth).length !== 0 && <div className={styles.hasdrop} onMouseEnter={() => setDown(true)} onMouseLeave={() => setDown(false)}>
                        <Link className={styles.profilelink} to="/dash">
                            <img className={down ? styles.profilehov : styles.profile} src={profilePic} />
                            <div> {username} </div>
                        </Link>
                        {down && <Dropdown />}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default HomeNav