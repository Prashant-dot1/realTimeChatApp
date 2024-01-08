import { useState } from "react"
import {toast}  from "react-toastify"
import { loginUser } from "../apis/auth";
import {BsEmojiLaughing , BsEmojiExpressionless} from "react-icons/bs"


const defaultData = {
    email : "",
    password : ""
}

function Login () {
    const [formData , setFormData] = useState(defaultData);
    const [showPass , setShowPass] = useState(false);
    const [isLoading , setIsLoading] = useState(false);

    function handleOnChange(e){
        setFormData({...formData , [e.target.name] : e.target.value})
    }

    async function formSubmit(e) {
        e.preventDefault();

        if(formData.email.includes("@") && formData.password.length > 6){
            setIsLoading(true);
            // api call to login the user and get the token 
            const response = await loginUser(formData);
            const data = response.data;
            if(data?.token){
                localStorage.setItem("userToken",`Bearer ${data.token}`);
                toast.success("Successfully login!")
                console.log("login success")
                setIsLoading(false);
                // pageRoute("/chats");
            }
            else{
                setIsLoading(false)
                console.log("login failed")
                toast.error("invalid credentials")
                setFormData({...formData , password : ""});
            }

        }else{
            setIsLoading(false);
            toast.error("Invalid Creds");
            setFormData(defaultData);
        }
    }

    return (
        <>
        <form onSubmit={formSubmit}>
            <div>
              <input onChange={handleOnChange} name="email" type="text" placeholder='Email' value={formData.email} required />

            </div>
            <div className='relative'>

              <input onChange={handleOnChange} type={showPass ? "text" : "password"} name="password" placeholder='Password' value={formData.password} required />
              {
                !showPass ? <button type='button'><BsEmojiLaughing onClick={() => setShowPass(!showPass)} /></button> : <button type='button'> <BsEmojiExpressionless onClick={() => setShowPass(!showPass)} /></button>
              }
            </div>

            <button type='submit'>
              <p>Login</p>
            </button>
            {/* <div className='border-t-[1px] w-[100%] sm:w-[80%] my-3' ></div> */}

          </form>
          </>
    )
}

export default Login