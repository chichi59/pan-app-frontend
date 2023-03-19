import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import styles from '../css/FollowList.module.css';
import pp from '../img/profile.png'

const FollowList = ({followerDetails, goToProfile, unfollow}) => {

    const [deleteScreen, setDeleteScreen] = React.useState(new Array(followerDetails.length).fill(false))
    const [hover, setHover] = React.useState(-1);

    const deleteScreenToggle = (index) => {
        const del = [...deleteScreen];
        del[index] = !deleteScreen[index]
        setDeleteScreen(del);
    }

    return (<ul>
        {followerDetails.map((item, index) => {
            if (!deleteScreen[index]) {
                return (
                    <li onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(-1)} onClick={() => goToProfile(item.id)}>
                        {hover === index && <FontAwesomeIcon onClick={(e) => {e.stopPropagation(); deleteScreenToggle(index)}} icon={faCircleXmark} />}
                        <img src={item.imageURL ? item.imageURL : pp}></img>
                        <p> {item.username} </p>
                    </li>
                )

            } else {
                return (
                    <li>
                        <p> Unfollow {item.username}?</p>
                        <img src={item.imageURL ? item.imageURL : pp}></img>
                        <div className={styles.buttonset}>
                            <FontAwesomeIcon className={styles.selectyes} icon={faCheck}
                                onClick={() => {unfollow(item.id); setHover(-1);}} />
                            <FontAwesomeIcon className={styles.selectno} icon={faXmark}
                                onClick={() => {deleteScreenToggle(index); setHover(-1)}} />
                        </div>
                    </li>
                )

            }

        })}
    </ul>)

}


export default FollowList;