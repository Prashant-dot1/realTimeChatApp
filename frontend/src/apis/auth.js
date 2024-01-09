import axios from "axios";

const url = "http://localhost:3000"

export async function loginUser(body){
    try{
        const res = await axios.post(`${url}/auth/login`, body);
        return res;
    }
    catch(e){
        console.log(`Error im loginUser method ${e}`)
    }
}


export async function registerUser(body){

    try{
        const res = await axios.post(`${url}/auth/register`, body);
        return res;
    }catch(e){
        console.log(`Error in registeruser method ${e}`)
    }
}


export async function validUser(){
    try{
        const token = localStorage.getItem("userToken"); // this will have Bearer with it 
        const instance = axios.create({
            baseURL: `${url}`,
            headers: {'Authorization': token}
          });
        
        const res = await instance.get("/auth/valid");
        // const res = await instance.get("/auth/valid",{
        //     headers: {'Authorization': token}
        // });
        return res.data;
    }catch(e){
        console.log(`Error in validUser method ${e}`);
    }
}