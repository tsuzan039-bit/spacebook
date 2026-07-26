import React from 'react'
import { Navigate } from 'react-router-dom'
export default function PostsGuards({children}) {


if(localStorage.getItem('token') === null){


    return <Navigate to={'/login'}/>
}else{
return children


}



  return (
<></>  )
}
