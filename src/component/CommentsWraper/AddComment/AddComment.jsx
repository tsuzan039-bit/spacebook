import axios from 'axios'
import { Button, Card, Textarea } from 'flowbite-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { headersObjData } from '../../../helpers/headersObj'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast'

export default function AddComment({activePostId,commentToBeUpdate,setUpdateComment}) {
 const {register,handleSubmit,reset,setValue}= useForm({
    defaultValues:{
        content:''
    }
  })

const queryClient = useQueryClient()

const {mutate:addMutate} =useMutation({
  mutationFn:handleAddComment,
  onSuccess:()=>{
    queryClient.invalidateQueries(['comments',activePostId]);
    queryClient.invalidateQueries(['totalCommentsCount', activePostId])
    toast.success('comment added successfully');
    reset()
  },
  onError:()=>{
    toast.error('something went wrong')
  }
})

const {mutate:updateMutate} =useMutation({
  mutationFn:handleUpdateComment,
  onSuccess:()=>{
    queryClient.invalidateQueries(['comments',activePostId]);
    queryClient.invalidateQueries(['totalCommentsCount', activePostId])
    toast.success('comment updated successfully');
    reset()
    setUpdateComment(null)
  },
  onError:()=>{
    toast.error('something went wrong')
  }
})

 async function handleAddComment(values){
  try{ 
    const objSend = { content: values.content }
    const {data} = await axios.post(
      `https://route-posts.routemisr.com/posts/${activePostId}/comments`,
      objSend,
      headersObjData()
    )
    return data
  } catch(err){
    console.log(err)
    throw err
  }
}

async function handleUpdateComment(values){
  try{
    const objSend = { content: values.content }
    const {data} = await axios.put(
      `https://route-posts.routemisr.com/posts/${activePostId}/comments/${commentToBeUpdate._id}`,
      objSend,
      headersObjData()
    )
    return data
  } catch(err){
    console.log(err)
    throw err
  }
}

useEffect(() => {
  if(commentToBeUpdate){
    setValue('content',commentToBeUpdate.content)
  }
}, [commentToBeUpdate])

return (
<form
  onSubmit={handleSubmit(commentToBeUpdate ? updateMutate : addMutate)}
  className="sticky bottom-0 z-50"
>

<Card className="space-comment-card  h-[250px] w-[100%] border border-violet-500/30 bg-[#140924]/90 backdrop-blur-xl rounded-3xl shadow-[0_0_35px_rgba(139,92,246,.35)] relative overflow-hidden">

  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-violet-500/20 blur-3xl"></div>
  <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-cyan-400/20 blur-3xl"></div>

  <div className="flex items-center gap-2 mb-3 relative z-10">

    <div className="w-3 h-3 rounded-full bg-cyan-300 animate-pulse"></div>

    <p className="text-violet-200 font-semibold tracking-wider">
      {commentToBeUpdate ? "EDIT TRANSMISSION" : "SEND TRANSMISSION"}
    </p>

  </div>

  <Textarea
    {...register("content")}
    rows={3}
    placeholder={
      commentToBeUpdate
        ? "Edit your transmission..."
        : "Write something to the galaxy..."
    }
    className="!bg-[#1a0d30] !border-violet-500/30 !text-white placeholder:text-violet-300 rounded-2xl"
  />

  {!commentToBeUpdate &&

  <Button
    type="submit"
    className="mt-4 w-full  rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 border-0 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_25px_rgba(139,92,246,.5)]"
  >
    🚀 Send Comment
  </Button>

  }

  {commentToBeUpdate &&

  <div className="flex gap-3 mt-4">

    <Button
      type="submit"
      className="flex-1 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 border-0 hover:scale-105 transition-all"
    >
      ✨ Update
    </Button>

    <Button
      type="button"
      onClick={()=>{
        setUpdateComment(null)
        reset()
      }}
      className="flex-1 rounded-2xl bg-[#24133d] border border-violet-500/30 text-violet-200 hover:bg-violet-900 transition-all"
    >
      Cancel
    </Button>

  </div>

  }

</Card>

</form>
)
}