import Logo from './Logo'
import { Link } from 'react-router-dom'
import styles from '../css/TopBar.module.css'
import React from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useNavigate, createSearchParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import pp from '../img/profile.png'
import cov1 from '../img/placeholder1.png'
import cov2 from '../img/placeholder1.png'
import cov3 from '../img/placeholder1.png'


const LOGOUT_URL = '/auth/logout'

const TopBar = () => {

    const [down, setDown] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [suggestions, setSuggestions] = React.useState([]);
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [username, setUsername] = React.useState("")
    const [profilePic, setProfilePic] = React.useState(pp)
    const [timeoutId, setTimeoutId] = React.useState(null);
    const [searchBarOn, setSearchBarOn] = React.useState(false)
    const [hovering, setHovering] = React.useState(false)

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

        fetchUsernameAndProfilePic();



    }, [])

    function debounce(cb, delay = 300) {
        return (...args) => {
            clearTimeout(timeoutId)
            let timeout = setTimeout(() => {
                cb(...args)
            }, delay)

            setTimeoutId(timeout)
        }
    }

    const fetchSuggestions = debounce(async (query) => {
        if(query === ''){
            return
        }
        try {
            const response = await axiosPrivate.get(`/search/autocomplete?q=${query}`)
            setSuggestions(response.data);

        } catch(err) {
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)
        }
    })


    React.useEffect(() => {
        fetchSuggestions(searchQuery)
    }, [searchQuery])
    

    //  /search?q=${searchQuery}

    //  /search/autocomplete?q={searchQuery}


    console.log()
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
    
    function onKeyDownHandler(e){
       if (e.keyCode === 13 && searchQuery){
        e.preventDefault();
        navigate({
            pathname: '/search',
            search: createSearchParams({query: searchQuery.trim()}).toString(),
          });
        
       }
    
    }


    function clickedSuggestion(e, id, isPublic){
        e.preventDefault();
        setHovering(false);
        setSearchBarOn(false);
        if (isPublic){
            navigate(`/explore/recipe/${id}`) 
        } else{ 
            navigate(`/dash/recipe/${id}`)
        }
    }

    
    function Dropdown() {
        return (
            <ul className={styles.dropdown}>
                <li> <Link className={styles.subnav} to="/profile"> Profile </Link> </li>
                <li> <Link className={styles.subnav} to="/discover" onClick={clickedLogOut}> Log Out </Link> </li>
            </ul>
        )
    }

    const coverPlaceholders = [cov1, cov2, cov3];


    return (
        <nav className={styles.topbar}>
            <Logo size="small" />
            <form className={styles.form}>
                <input className={styles.searchbar}
                    placeholder="I want to make.."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) =>onKeyDownHandler(e)}
                    onFocus={() => setSearchBarOn(true)}
                    onBlur={() => {if(!hovering) {setSearchBarOn(false)}}}
                />
            </form>

            {searchBarOn && searchQuery && suggestions.length > 0 && <ul onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} className={styles.suggestionsdrop}>
                {suggestions.map((item) => {
                    let pic = item.coverImages && item.coverImages.length > 0 ? item.coverImages[0].imageURL  : coverPlaceholders[Math.floor(Math.random() * 3)]
                    return (
                        <li onClick={(e) => clickedSuggestion(e, item._id, item.public)} className={styles.suggestoption}>
                            <img src={pic} className={styles.suggestimg}></img>
                            <div className={styles.suggestdetails}>
                                <p>{item.title}</p>
                                <p className={styles.ownername}>{item.ownerusername}</p>
                            </div>

                        </li> 
                    )
                })}
            </ul>}

            <ul className={styles.navlinks}>
                <li> <Link className={styles.links} to="/home"> Home </Link> </li>
                <li> <Link className={styles.links} to="/explore"> Explore </Link> </li>
                <li className={styles.hasdrop} onMouseEnter={() => setDown(true)} onMouseLeave={() => setDown(false)}>
                    <Link className={styles.profilelink} to="/dash">
                        <img className={down ? styles.profilehov : styles.profile} src={profilePic} />
                        <div> {username} </div>
                    </Link>
                    {down && <Dropdown />}
                </li>
            </ul>
        </nav>
    )
}

export default TopBar