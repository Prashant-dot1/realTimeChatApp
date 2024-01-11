import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validUser } from "../apis/auth";

function Start() {

    const pageRoute = useNavigate();
    
    useEffect(() => {
        async function isValidUser() {
            const data = await validUser();

            if(!data?.user){
                pageRoute("/login");
            }else{
                pageRoute("/chats");
                console.log("navigating to chats")
            }
        }
        isValidUser();

    }, [pageRoute])

    return (
        <div>
            <h3>please wait the page is loading</h3>
        </div>
    )
}

export default Start