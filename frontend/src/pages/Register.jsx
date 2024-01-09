import { useState } from "react"
import { BsEmojiExpressionless, BsEmojiLaughing } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../apis/auth";

const defaultData ={
    firstName: "",
    lastName : "",
    email : "",
    password : ""
}

function Register() {

    const [formData , setFormData] = useState(defaultData);
    const pageRoute = useNavigate();
    const [isLoading , setIsLoading] = useState(false)
    const [showPass , setShowPass] = useState(false)

    function handleOnChange(e){
        setFormData({...formData , [e.target.name] : e.target.value})
    }

    async function handleOnSubmit(e){
        e.preventDefault();

        if(formData.email.includes("@") && formData.password.length > 6){
            const res = await registerUser(formData);

            if(res.data?.token){
                localStorage.setItem("userToken", `Bearer ${res.data.token}`)
                toast.success("Successfully regisutered")
                setIsLoading(false)
                pageRoute("/chats");
            }
            else{
                setIsLoading(false)
                toast.error("Invalid creds");
            }
        }
        else{
            setIsLoading(false)
            toast.error("provide prper creds")
            setFormData({...formData , password : ""})
        }
    }

    return (
        <div>
            <form onSubmit={handleOnSubmit}>
                <div>
                    <input type="text" name="firstname" placeholder="firstname" onChange={handleOnChange}/>
                    <input type="text" name="lastname" placeholder="lastname" onChange={handleOnChange}/>
                </div>
                <div>
                    <input type="text" name="email" placeholder="email" value={formData.email} onChange={handleOnChange} />
                </div>
                <div>
                    <input type={showPass ? "text" : "password"} name="password" placeholder="password" onChange={handleOnChange}/>
                    {
                        !showPass ? <button type="button"><BsEmojiLaughing onClick={() => setShowPass(!showPass)}/></button> : <button type="button"><BsEmojiExpressionless onClick={() => setShowPass(!showPass)}/></button>
                    }
                </div>
                <button type="submit">
                    <p>Register</p>
                </button>
            </form>
        </div>
    )

}

export default Register