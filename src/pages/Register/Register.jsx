import React, { useState } from 'react'
import { Button, Checkbox, Label, TextInput, Radio} from "flowbite-react";
import axios from 'axios';
import {useForm} from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema } from '../../Schemas/AuthSchema';
import AppAlert from '../../component/AppAlert/AppAlert';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
// import { data } from 'react-router-dom';
import { GiAstronautHelmet } from "react-icons/gi";
import { TbRocket } from "react-icons/tb";
import "./Register.css";
import { FaUserAstronaut } from 'react-icons/fa';









export default function Register() {

const [msg,setMsg] = useState()


const [Loading, setLoading] = useState(false)
const navigate= useNavigate()






const {register,handleSubmit, formState} = useForm({
  mode:'onSubmit',
reValidateMode:'onChange',
resolver:zodResolver(registrationSchema),

defaultValues:{


    name: "",
    email:"",
    password:"",
    rePassword:"",
    dateOfBirth:"",
    gender:undefined
}


})
// console.log(register());

async function registerData(values){

setLoading(true)
// ✅ 
try {
  const { data } = await axios.post('https://route-posts.routemisr.com/users/signup', values)
  setMsg(data.message) 
  navigate('/login')
} catch (error) {
  setMsg(error.response.data.message) 
}finally{

setLoading(false)

}

  
//   try{
//     const {data} = await axios.post('https://route-posts.routemisr.com/users/signup',values)  
//   console.log(data.message);

// if(data.message ==="success"){

// setMsg(data.message)

// }


//   }
//  catch (error) {
//     console.log(error.response.data); 


//   }

  
}









  return (
<>



<form
onSubmit={handleSubmit(registerData)}
className="min-h-screen flex justify-center items-center relative overflow-hidden px-4"
>

<div className="space-stars"></div>

<div className="planet planet-one"></div>

<div className="planet planet-two"></div>

<div className="meteor"></div>

<div className="space-glow"></div>
<div className="register-space-card w-full md:w-[700px] p-10 relative overflow-hidden"><div className=''>


<div className="astronaut-box">

👩‍🚀

</div>
<h1 className="space-title">

JOIN THE GALAXY

</h1>

<p className="space-subtitle">

Create your cosmic account

</p>
</div>
<div  className=''>
        <div className="mb-2 block">
          <Label
className="space-label" htmlFor="name">Name</Label>
        </div>
        <TextInput
className="space-input"
theme={{
field:{
input:{
base:"space-input-field"
}
}
}} {...register('name')} id="name" type="text" placeholder="suzan tarek...." required />



{formState.errors.name && (
<AppAlert
    color={'failure'}
    content={formState.errors.name.message}
  />)}


                <div className="mb-2 block">
          <Label
className="space-label" htmlFor="email1">Email</Label>
        </div>
      <TextInput
className="space-input"
theme={{
field:{
input:{
base:"space-input-field"
}
}
}} {...register('email')} id="email1" type="email" placeholder="name@gmail.com" required />

{formState.errors.email && (
<AppAlert
    color={'failure'}
    content={formState.errors.email.message}
  />)}



                <div className="mb-2 block">
          <Label
className="space-label" htmlFor="password">Password</Label>
        </div>
        <TextInput
className="space-input"
theme={{
field:{
input:{
base:"space-input-field"
}
}
}} {...register('password')} id="password" type="password" placeholder="Enter Your Password" required />

{formState.errors.password && (
<AppAlert
    color={'failure'}
    content={formState.errors.password.message}
  />)}


                <div className="mb-2 block">
          <Label
className="space-label" htmlFor="rePassword">re-password</Label>
        </div>
        <TextInput
className="space-input"
theme={{
field:{
input:{
base:"space-input-field"
}
}
}} {...register('rePassword')} id="rePassword" type="password" placeholder="Enter Your re-password" required />



{formState.errors.rePassword && (
<AppAlert
    color={'failure'}
    content={formState.errors.rePassword.message}
  />)}


                <div className="mb-2 block">
          <Label
className="space-label" htmlFor="dob">Date of birth</Label>
        </div>
        <TextInput
className="space-input"
theme={{
field:{
input:{
base:"space-input-field"
}
}
}} {...register('dateOfBirth')} id="dob" type="date" placeholder="Enter Your Date of birth " required />



{formState.errors.dateOfBirth && (
<AppAlert
    color={'failure'}
    content={formState.errors.name.message}
  />)}














{/* Gender */}

<div className="gender-box mt-8">

  <h3 className="space-section-title">
    Choose your gender
  </h3>

  <div className="grid grid-cols-2 gap-5">

    <label htmlFor="male" className="space-gender-card">

      <Radio
        id="male"
        {...register("gender")}
        value="male"
        className="hidden"
      />

<GiAstronautHelmet className="text-5xl text-cyan-300 mb-2" />
      <span className="space-label">
        Male
      </span>

    </label>

    <label htmlFor="female" className="space-gender-card">

      <Radio
        id="female"
        {...register("gender")}
        value="female"
        className="hidden"
      />



<FaUserAstronaut className="text-5xl text-cyan-300 mb-2" />
      <span className="space-label">
        Female
      </span>

    </label>

  </div>

</div>

</div>

<Button
  type="submit"
  className="space-register-btn mt-10 w-full"
>
  {Loading ? (
    <>
      Launching...

      <ClipLoader
        color="#37edd1"
        size={16}
        className="ms-2"
        speedMultiplier={1}
      />
    </>
  ) : (
    <>
      🚀 Create Space Account
    </>
  )}
</Button>

{msg && (
  <div className="mt-6">
    <AppAlert
      color={msg === "account created" ? "success" : "failure"}
      content={msg}
    />
  </div>
)}

<div className="orbit-ring"></div>
<div className="orbit-ring second"></div>

</div>
</form>

</>  )
} 
