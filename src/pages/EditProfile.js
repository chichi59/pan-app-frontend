import React from "react";
import axios, { axiosPrivate } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCircleInfo } from "@fortawesome/free-solid-svg-icons";



const EditProfile = () => {
    const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_!@#$%]{4,20}$/;

    const [profilePic, setProfilePic] = React.useState('')

    const [update, setUpdate] = React.useState(false);
    const [changed, setChanged] = React.useState(false);
    const [validUsername, setValidUsername] = React.useState(true);
    const [errMsg, setErrMsg] = React.useState('');

    const [userDetails, setUserDetails] = React.useState({
        firstname: '',
        lastname: '',
        username: ''
    })


    const navigate = useNavigate();


    //make submit button invalid unless valid username


    React.useEffect(() => {
        const getUserDetailsAndProfilePic = async () => {
            let uid = ''
            try {
                const response = await axiosPrivate.get('/users/me')
                const userdetails = {
                    firstname: response.data.firstname ? response.data.firstname : '',
                    lastname: response.data.lastname ? response.data.lastname : '',
                    username: response.data.username
                }


                setUserDetails(userdetails)
                uid = response.data._id;

            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
            }

            if (uid) {
                try {
                    const response = await axiosPrivate.get(`/users/explore/${uid}/profilepic`)
                    if (response.data.imageURL) {
                        setProfilePic(response.data.imageURL);
                        setUpdate(true);
                    }

                   


                } catch (err) {
                    console.log(err.response?.data);
                    console.log(err.response?.status);
                    console.log(err.response?.headers);
                    console.log(err.message)
                }
            }


        }


        getUserDetailsAndProfilePic();
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        let success = false;
        if (!validUsername){
            return
        } 

        try {
            const response = await axiosPrivate.patch('/users', {
                firstname: userDetails.firstname,
                lastname: userDetails.lastname,
                username: userDetails.username
            })

            if(!changed){
                success = true;
            }


        } catch (err) {
            if(err.response?.status === 409){
                setErrMsg('Username already taken')
                setUserDetails({...userDetails, username: ''})
                return
            }
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
            console.log(err.message)
            return

        }

        if (changed) {
            try {

                const formData = new FormData();
                formData.append('profilepic', profilePic);

                let response = null
                if (update) {
                    response = await axiosPrivate.patch('/users/profilepic', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                } else {
                    response = await axiosPrivate.post('/users/profilepic', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                }

                success = true;

            } catch (err) {
                console.log(err.response?.data);
                console.log(err.response?.status);
                console.log(err.response?.headers);
                console.log(err.message)
            }
        }

        if (success) {
            navigate('/profile', {replace: true})
        }


    }

    const handleEdit = (e) => {
        const name = e.target.name
        const value = e.target.value;

        if(name === 'username'){
            setValidUsername(USER_REGEX.test(value))

            if(errMsg && value.length > 0){
                setErrMsg('')
            }
        }

        setUserDetails({ ...userDetails, [name]: value });
    }

    const handleImgChange = (e) => {
        setProfilePic(e.target.files[0])
        setChanged(true)
    }




    return (
        <main>
            <form onSubmit={handleSubmit}>
                {errMsg && <p> {errMsg} </p>}
                <label htmlFor="username">
                    Username
                </label>
                <input id='username' type='text' value={userDetails.username} onChange={handleEdit} name='username' />

                {userDetails.username && !validUsername && <p> <FontAwesomeIcon icon={faCircleInfo}/> 5-21 characters. Must begin with a letter. Accepted characters include letters, numbers, hyphens, underscores and special characters: !@#$% </p>}


                <label htmlFor="firstname">
                    Firstname
                </label>
                <input id='firstname' type='text' value={userDetails.firstname} onChange={handleEdit} name='firstname' />

                <label htmlFor="lastname">
                    Lastname
                </label>
                <input id='lastname' type='text' value={userDetails.lastname} onChange={handleEdit} name='lastname' />


                {profilePic &&
                    <div>
                        <img src={profilePic instanceof File ? URL.createObjectURL(profilePic) : profilePic}></img>
                        <FontAwesomeIcon icon={faTrash} onClick={() => {setProfilePic(''); setChanged(true);}} />
                    </div>

                }

                <label htmlFor="profilepic">
                    Profile Picture
                </label>

                <input id='profilepic' type='file' accept='image/*' onChange={handleImgChange} name='profilepic' />

                <button> Update Profile </button>

            </form>




        </main>
    )

}

export default EditProfile; 