import React, { useState } from 'react'
import { Button, Checkbox, Label, TextInput, Radio} from "flowbite-react";
import axios from 'axios';
import {useForm} from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registrationSchema } from '../../Schemas/AuthSchema';
import AppAlert from '../../component/AppAlert/AppAlert';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
// import { data } from 'react-router-dom';




import "./Login.css";








export default function Login() {

const [msg,setMsg] = useState()
const [Loading, setLoading] = useState(false)
const navigate =useNavigate()
   const {setToken} = useContext(AuthContext)






const {register,handleSubmit, formState} = useForm({
  mode:'onSubmit',
reValidateMode:'onChange',
resolver:zodResolver(loginSchema),

defaultValues:{

    email:"",
    password:"",
   
}


})

async function loginData(values){

setLoading(true)
try {
  const { data } = await axios.post('https://route-posts.routemisr.com/users/signin',
     values)
     ;console.log(data);
        console.log('Full response:', data)
    console.log('token:', data.data.token) 
     console.log(data.data.message);
     
     
  setMsg(data.message) 
   localStorage.setItem('token', data.data.token)
setToken(data.data.token)
   navigate('/')
  
} catch (error) {
  setMsg(error.response.data.message) 
}finally{

setLoading(false)

}

  

  
}









  return (
<>



<form
  onSubmit={handleSubmit(loginData)}
  className=" mt-2 min-h-screen flex justify-center items-center relative px-4"
>
  {/* Stars */}
  <div className="space-stars"></div>

  {/* Planet */}
  <div className="planet planet-one"></div>

  {/* Planet */}
  <div className="planet planet-two"></div>

  {/* Glow */}
  <div className="space-glow"></div>
<div className="login-space-card w-full md:w-[650px] p-10 relative"> <div className="astronaut-box">

🚀

</div>
<h1 className="space-title">

WELCOME BACK

</h1>

<p className="space-subtitle">

Access your galaxy account

</p>
<div  className=''>
 




                <div className="mb-2 block">
          <Label

className="space-label"

htmlFor="email1"
>Email</Label>
        </div>
        <TextInput

className="space-input"

theme={{
field:{
input:{
base:"space-input-field"
}
}
}}



 {...register('email')} id="email1" type="email" placeholder="name@gmail.com" required />

{formState.errors.email && (
<AppAlert
    color={'failure'}
    content={formState.errors.email.message}
  />)}



                <div className="mb-2 block">
          <Label className='space-label' htmlFor="password">Password</Label>
        </div>
        <TextInput

className="space-input"

theme={{
field:{
input:{
base:"space-input-field"
}
}
}}




 {...register('password')} id="password" type="password" placeholder="Enter Your Password" required />

{formState.errors.password && (
<AppAlert
    color={'failure'}
    content={formState.errors.password.message}
  />)}


            




















      </div>

<Button className="space-login-btn mt-8 w-full" type='submit'>
  {Loading?<> Loading 
   <ClipLoader color="#37edd1"
  size={15} className='ms-2'
  speedMultiplier={1}/>
  
  </>:'submit'}
</Button>





{msg && (
  <AppAlert
    color={msg === 'account created' ? 'success' : 'failure'}
    content={msg}
  />
)}


<div className="orbit-ring"></div>

<div className="orbit-ring second"></div>

</div>
</form>

</>  )
} 
