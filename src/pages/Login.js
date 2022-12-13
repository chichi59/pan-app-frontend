import { Link } from 'react-router-dom'
import Logo from '../components/Logo.js'
import style from '../css/Login.module.css'
import React from 'react'

function Login(){

    const [formData, setFormData] = React.useState(
        {
            username: "",
            password: ""
        }
    )

    function handleChange(event){
        setFormData((oldFormData) => {
            const {name, value} = event.target
            return {
                ...oldFormData,
                [name]: value
            }

        })
    }

    function handleSubmit(event){
        event.preventDefault()
    }


    return (
        <div className={style.loginpage}>
            <div className={style.bgcircle}></div>
            <section className={style.loginsection}>
                <Logo />
                <h3 className={style.logingreeting}>Hello again, hope you're hungry!</h3>
                <form className={style.loginform}onSubmit={handleSubmit}>
                    <label className={style.label} htmlFor="username"> Username or Email</label>
                    <input
                        className={style.input}
                        id="username"
                        type="text"
                        onChange={handleChange}
                        name="username"
                        value={formData.username}
                    />
                    <label className={style.label}htmlFor="password"> Password</label>
                    <input
                        className={style.inputpassword}
                        id="password"
                        type="password"
                        onChange={handleChange}
                        name="password"
                        value={formData.password}
                    />

                    <br/>
                    <button className={style.loginbutton}>Log In</button> 
                    
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