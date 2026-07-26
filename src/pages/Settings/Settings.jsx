import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Card, Label, TextInput } from 'flowbite-react'
import axios from 'axios'
import { headersObjData } from '../../helpers/headersObj'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthContext'
import "./Settings.css";

export default function Settings() {

  const {setToken} = useContext(AuthContext)
  const navigate = useNavigate()

  const {register,handleSubmit,reset,formState:{errors}} = useForm({
    defaultValues:{
      password:'',
      newPassword:''
    }
  })

  const {mutate,isPending} = useMutation({
    mutationFn: changePassword,
    onSuccess:(data)=>{
      reset()

      // ✅ نمسك التوكن الجديد لو السيرفر رجّعه
      const newToken = data?.data?.token ?? data?.token ?? data?.data?.accessToken

      if(newToken){
        localStorage.setItem('token', newToken)
        setToken(newToken)
        toast.success('password changed successfully')
      } else {
        // ✅ لو مفيش توكن جديد، التوكن القديم بقى ملغي، لازم تسجيل دخول تاني
        toast.success('password changed, please login again')
        localStorage.removeItem('token')
        setToken(null)
        navigate('/login')
      }
    },
    onError:(error)=>{
      toast.error(error.response?.data?.message || 'something went wrong')
    }
  })

  async function changePassword(values){
    try{
      const {data} = await axios.patch(
        `https://route-posts.routemisr.com/users/change-password`,
        values,
        headersObjData()
      )
      return data
    }catch(err){
      console.log(err)
      throw err
    }
  }

  return (
    <>
      <title>settings</title>

<div className="space-settings-page">        <div className="max-w-xl mx-auto px-3">

<div className="space-settings-title">

    <span>⚙️</span>

    <div>
        <h2>Account Settings</h2>
        <p>Manage your Nebula account</p>
    </div>

</div>
<Card className="space-settings-card">            <h3 className="space-card-title">
    🔒 Change Password
</h3>

            <form onSubmit={handleSubmit(mutate)} className='flex flex-col gap-4'>

              <div>
                <Label className="space-label"
 htmlFor="password">Current Password</Label>
                <TextInput  className="space-input"

                  id="password" 
                  type="password"
                  {...register('password', {required:'current password is required'})}
                />
                {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>}
              </div>

              <div>
                <Label className="space-label"
 htmlFor="newPassword">New Password</Label>
                <TextInput  className="space-input"

                  id="newPassword" 
                  type="password"
                  {...register('newPassword', {required:'new password is required', minLength:{value:6,message:'at least 6 characters'}})}
                />
                {errors.newPassword && <p className='text-red-500 text-xs mt-1'>{errors.newPassword.message}</p>}
              </div>

              <Button type='submit' className="space-save-btn"
 disabled={isPending}>
                {isPending ? 'saving...' : 'change password'}
              </Button>

            </form>
          </Card>

          <p className="space-note">

🚀 More profile customization will arrive in future updates.

</p>

        </div>
      </div>
    </>
  )
}