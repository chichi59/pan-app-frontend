import AddRecipe from "./AddRecipe";
import { useParams } from "react-router-dom";


const EditRecipe = () => {
    const { id } = useParams();

    return (
        
        <>
            <AddRecipe recipeid={id} />
        </>
    )
}

export default EditRecipe;