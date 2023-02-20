import Logo from '../components/Logo.js'
import style from '../css/Login.module.css'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import axios from '../api/axios'
import useAuth from '../hooks/useAuth.js'
import { Link, useNavigate, useLocation } from 'react-router-dom'



const LOGIN_URL = '/auth'

function Login(){

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dash"
    const { setAuth } = useAuth();

    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    
    const [errMsg, setErrMsg] = React.useState('')

    React.useEffect(() => {
        setErrMsg('')
    }, [username, password])


    const handleSubmit = async (event) => {
        event.preventDefault()
        let success = false;
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

        }catch(error){
            if(!error?.response){
                setErrMsg('No server response')
            }else if(error.response?.status === 400){
                setErrMsg('Missing username or password')
            }else if(error.response?.status === 401){
                setErrMsg(error.response.data.message)
            }else{
                setErrMsg('Login failed')
            }

            return

        }

        if(success){
            navigate(from, {replace: true})
        }    




    }


    return (
        <div className={style.loginpage}>
            <div className={style.bgcircle}></div>
            <section className={style.loginsection}>
                <Logo />
                <h3 className={style.logingreeting}>Hello again, hope you're hungry!</h3>

                <form className={style.loginform}onSubmit={handleSubmit}>
                    <p className={errMsg ? style.error : style.noshow }>
                    <FontAwesomeIcon className={style.erroricon} icon={faTriangleExclamation}/> {errMsg} </p>

                    <div className={style.inputsection}>
                        <label className={style.label} htmlFor="username"> Username or Email</label>
                        <input
                            className={style.input}
                            id="username"
                            type="text"
                            onChange={(e) => {setUsername(e.target.value)}}
                            name="username"
                            value={username}
                            autoFocus
                            required
                        />

                    </div>

                    <div className={style.inputsection}>
                        <label className={style.label}htmlFor="password"> Password</label>
                        <input
                            className={style.inputpassword}
                            id="password"
                            type="password"
                            onChange={(e) => {setPassword(e.target.value)}}
                            name="password"
                            value={password}
                            required
                        />
                    </div>
                    
                    
                    <br/>
                    <button disabled={username && password ? false : true}className={style.loginbutton}>Log In</button> 
                    
                </form>

                <div className={style.alternate}>
                    <p> New to Pan? </p>
                    <Link className={style.signuplink} to='/signup'>Sign up</Link>
                </div> 
            </section> 

        </div>

    )

}

export default Login;