import React from 'react'
import { Navigate } from 'react-router-dom'
export default function AuthGuard({children}) {

if (localStorage.getItem('token') === null){
return children
}else{
  return <Navigate to={'/'} />
}





  return (
<>







</>  )
}
