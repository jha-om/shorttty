import { useParams } from "react-router-dom"

const Link = () => {
    const { id } = useParams();
    return (
        <div>Link: {id}</div>
    )
}

export default Link