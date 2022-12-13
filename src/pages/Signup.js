import { Link } from 'react-router-dom'
import Logo from '../components/Logo.js'
import style from '../css/Signup.module.css'
import React from 'react'

function Signup(){

    const [passwordMismatch, setPasswordMismatch] = React.useState(false)
    const [formData, setFormData] = React.useState(
        {
            username: "",
            password: "",
            confirmPassword: ""
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
        if(formData.password !== formData.confirmPassword){
            setPasswordMismatch(true)
        }else{
            setPasswordMismatch(false)
        }
    }


    return (
        <div className={style.loginpage}>
            <section className={style.loginsection}>
                <Logo />
                <h3 className={style.logingreeting}>Ready to get started?</h3>
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

                    <label className={style.label}htmlFor="confirmPassword"> Confirm Password</label>
                    <input
                        className={passwordMismatch ? style.nogap : style.inputconfirmpassword}
                        id="confirmPassword"
                        type="password"
                        onChange={handleChange}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                    />

                    <p className={passwordMismatch ? style.mismatch : style.noshow}> Passwords do not match</p>

                    <br/>
                    <button className={style.signupbutton}>Create Account</button> 
                    
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