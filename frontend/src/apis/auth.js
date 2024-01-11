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

export const searchUsers = async (id) => {
    try {
      const token = localStorage.getItem('userToken');
  
      return await API(token).get(`/api/user?search=${id}`);
    } catch (error) {
      console.log('error in search users api');
    }
  };
  export const updateUser = async (id, body) => {
    try {
      const token = localStorage.getItem('userToken');
  
      const { data } = await API(token).patch(`/api/users/update/${id}`, body);
      return data;
    } catch (error) {
      console.log('error in update user api');
      toast.error('Something Went Wrong.try Again!');
    }
  };