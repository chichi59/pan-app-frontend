import React from 'react'
import styles from '../css/AddCoverImage.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation, faCircleXmark } from '@fortawesome/free-solid-svg-icons'


function AddCoverImage({onCoverImageChange, coverImages, deleteCoverPic}){
    return (
        <section className={styles.coversection}>
            <ul className={styles.imagesection}>
                {coverImages.map((item, index) => {
                    return (
                        <li key={index} className={styles.pic}>
                            <FontAwesomeIcon onClick={() => deleteCoverPic(index)} className={styles.delete} icon={faCircleXmark}/>
                            <img src={item instanceof File ? URL.createObjectURL(item): item}/>
                        </li>
                        
                    )
                })}
            </ul>

            <form >
                Upload images of your finished dish &#40;max 3&#41;:
                <label className={styles.imagebutton} htmlFor="imageinput"> Add Images </label>
                <input className={styles.input} id="imageinput" name="imageinput" type="file" multiple accept="image/*" onChange={onCoverImageChange} />
                {coverImages.length > 3 && 
                <p className={styles.error}>
                <FontAwesomeIcon icon={faTriangleExclamation}/>
                You can only upload 3 cover images.
                </p>
                }
            
            </form>

            


        </section>
    )
}


export default AddCoverImage;