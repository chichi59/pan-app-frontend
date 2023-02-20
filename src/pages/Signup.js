import { Link } from 'react-router-dom'
import Logo from '../components/Logo.js'
import style from '../css/Signup.module.css'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faTriangleExclamation, faCheck } from '@fortawesome/free-solid-svg-icons'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'


const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_!@#$%]{4,20}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,20}$/;
const NEWUSER_URL = '/users'
const LOGIN_URL = '/auth'


function Signup(){
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const [username, setUsername] = React.useState('')
    const [validUsername, setValidUsername] = React.useState(false);
    const [usernameFocus, setUsernameFocus] = React.useState(true);

    const [password, setPassword] = React.useState('')
    const [validPassword, setValidPassword] = React.useState(false);
    const [passwordFocus, setPasswordFocus] = React.useState(false);

    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [validConfirmPassword, setValidConfirmPassword] = React.useState(false);

    const [errMsg, setErrMsg] = React.useState('')


    React.useEffect(() => {
        const isValid = USER_REGEX.test(username)
        setValidUsername(isValid);
    }, [username])

    React.useEffect(() => {
        const isValid = PWD_REGEX.test(password)
        setValidPassword(isValid);
        const match = password === confirmPassword
        setValidConfirmPassword(match)
    }, [password, confirmPassword])

    React.useEffect(() => {
        setErrMsg('')
    }, [username, password, confirmPassword])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(PWD_REGEX.test(password) && USER_REGEX.test(username)){
            let success = false;
            
            try{
                const response = await axios.post(NEWUSER_URL,
                    JSON.stringify({username, password}),
                    {
                        headers: { 'Content-Type': 'application/JSON'},
                        withCredentials: true
                    }
                    
                );
    
                console.log(JSON.stringify(response))



            }catch (error){
                if(!error?.response){
                    setErrMsg('No Server Response')
                }else if(error.response?.status === 409){
                    setErrMsg('Username already taken')
                }else{
                    setErrMsg('Registration failed')
                }

                return
            }

            try{
                const response = await axios.post(LOGIN_URL,
                    JSON.stringify({username, password}),
                    {
                        headers: { 'Content-Type': 'application/JSON'},
                        withCredentials: true
                    }
                    
                );
    
                console.log(JSON.stringify(response))
                

                const accessToken = response?.data?.accessToken;
                setAuth({accessToken})

                success = true;
                setUsername('')
                setPassword('')
                setConfirmPassword('')


            }catch(error){
                if(!error?.response){
                    setErrMsg('No server response')
                }else if(error.response?.status === 400){
                    setErrMsg('Missing username or password')
                }else if(error.response?.status === 401){
                    setErrMsg('Unauthorized')
                }else{
                    setErrMsg('Login failed')
                }

            }

            if(success){
                navigate('/dash', {replace: true})
            }
        }

        
    }


    return (
        <div className={style.loginpage}>
            <section className={style.loginsection}>
                <Logo />
                <h3 className={style.logingreeting}>Ready to get started?</h3>

                <form className={style.loginform}onSubmit={handleSubmit}>
                    <p className={errMsg ? style.error : style.noshow }>
                    <FontAwesomeIcon className={style.erroricon} icon={faTriangleExclamation}/> {errMsg} </p>
                    <div className={style.inputsection}>
                        <label className={style.label} htmlFor="username"> Username or Email
                        <FontAwesomeIcon className={username && validUsername ? style.validity : style.noshow}
                        icon={faCheck}/>
                        </label>
                        <input
                            className={style.input}
                            id="username"
                            type="text"
                            onChange={(e) => {setUsername(e.target.value)}}
                            name="username"
                            value={username}
                            required
                            autoFocus
                            onFocus={() => setUsernameFocus(true)}
                            onBlur={() => setUsernameFocus(false)}
                            
                        />
                        
                    </div> 

                    <p className={username && usernameFocus && !validUsername ? style.guide : style.noshow}> <FontAwesomeIcon className={style.infoicon} icon={faCircleInfo}/> 5-21 characters. Must begin with a letter. Accepted characters include letters, numbers, hyphens, underscores and special characters: !@#$% </p>

                    <div className={style.inputsection}>
                        <label className={style.label}htmlFor="password"> Password
                        <FontAwesomeIcon className={password && validPassword ? style.validity : style.noshow}
                        icon={faCheck}/>
                        </label>
                        
                        <input
                            className={style.inputpassword}
                            id="password"
                            type="password"
                            onChange={(e) => {setPassword(e.target.value)}}
                            name="password"
                            value={password}
                            required
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        />
                    </div>

                    <p className={password && passwordFocus && !validPassword ? style.guide : style.noshow}> <FontAwesomeIcon className={style.infoicon} icon={faCircleInfo}/> 8-20 characters. Must include at least one of each: lowercase letter, uppercase letter, number and special character: !@#$% </p>

                    <div className={style.inputsection} >
                        <label className={style.label}htmlFor="confirmPassword"> Confirm Password
                        <FontAwesomeIcon className={confirmPassword && validConfirmPassword && validPassword ? style.validity : style.noshow}
                        icon={faCheck}/>
                        </label>
                        <input
                            className={style.inputconfirmpassword}
                            id="confirmPassword"
                            type="password"
                            onChange={(e) => {setConfirmPassword(e.target.value)}}
                            name="confirmPassword"
                            value={confirmPassword}
                            required
                        />
                    </div>

                    <p className={!usernameFocus && !passwordFocus && password && confirmPassword && !validConfirmPassword ? style.guide : style.noshow}> <FontAwesomeIcon className={style.infoicon} icon={faTriangleExclamation}/> Passwords do not match</p>

                    <br/>
                    <button disabled={validUsername && validConfirmPassword && validPassword ? false : true} className={style.signupbutton}>Create Account</button> 
                    
                </form>

                <div className={style.alternate}>
                    <p> Already have an account? </p>
                    <Link className={style.loginlink} to='/login'>Log In</Link>
                </div> 
            </section> 
            <div className={style.bgcirclelarge}></div>
            <div className={style.bgcirclesmall}></div>

        </div>

    )

}

export default Signup;