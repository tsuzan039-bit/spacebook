import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { headersObjData } from '../helpers/headersObj'

export const AuthContext =  createContext()

export default function AuthContextProvider({children}) {

const [token, setToken] = useState(localStorage.getItem('token'))
const [userData, setuserData] = useState(null)

async function getLoggedInUserData(){
try{
  const {data} = await axios.get('https://route-posts.routemisr.com/users/profile-data',
  headersObjData()
)
  setuserData(data.data.user)
}
catch(err){
  console.log(err,userData);
};
}

useEffect(() => {
  if (token) {
    getLoggedInUserData()
  } else {
    setuserData(null)
  }
}, [token])

  return <AuthContext.Provider value={{token,setToken,userData,setuserData,getLoggedInUserData}}>

{children}

  </AuthContext.Provider>
}