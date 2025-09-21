import { useParams } from "react-router-dom"

const RedirectLink = () => {
    const { id } = useParams();
    return (
        <div>RedirectLink: {id}</div>
    )
}

export default RedirectLink