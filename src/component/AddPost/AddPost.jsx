import { Button, Textarea } from 'flowbite-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { FaImage } from "react-icons/fa6";
import { headersObjData } from './../../helpers/headersObj';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import './AddPost.css'
export default function AddPost({postToBeUpdate,setPostToBeUpdate}) {

  const {register,handleSubmit,reset,setValue}=useForm({
    defaultValues:{
      body:"",
      image:null
    }
  })

  const queryClient = useQueryClient()

  const {mutate:addMutate,isPending:isAdding}=useMutation({mutationFn:addPost,
    onSuccess:()=>{
      queryClient.invalidateQueries(['allPosts'])
      queryClient.invalidateQueries(['profilePosts'])
      toast.success('post added successfully')
      reset()
    },
    onError:(error)=>{
      console.log(error.response?.data)
      toast.error('post not added')
    }
  })

  const {mutate:updateMutate,isPending:isUpdating}=useMutation({mutationFn:updatePost,
    onSuccess:()=>{
      queryClient.invalidateQueries(['allPosts'])
      queryClient.invalidateQueries(['profilePosts'])
      queryClient.invalidateQueries(['details'])
      toast.success('post updated successfully')
      reset()
      setPostToBeUpdate(null)
    },
    onError:(error)=>{
      console.log(error.response?.data)
      toast.error('post not updated')
    }
  })

  async function addPost(values){
    const formData = new FormData();
    formData.append('body',values.body)

    if(values.image && values.image[0]){
      formData.append('image',values.image[0])
    }

    const response = await axios.post("https://route-posts.routemisr.com/posts",formData,headersObjData())
    return response
  }

  async function updatePost(values){
    const formData = new FormData();
    formData.append('body',values.body)

    if(values.image && values.image[0]){
      formData.append('image',values.image[0])
    }

    const response = await axios.put(
      `https://route-posts.routemisr.com/posts/${postToBeUpdate._id}`,
      formData,
      headersObjData()
    )
    return response
  }

  useEffect(() => {
    if(postToBeUpdate){
      setValue('body', postToBeUpdate.body)
    }
  }, [postToBeUpdate])

  return (
<>
<form
  onSubmit={handleSubmit(postToBeUpdate ? updateMutate : addMutate)}
  className="create-post-card"
>

  <div className="space-glow"></div>

  {postToBeUpdate && (
    <div className="editing-post">
      <span>🚀 Editing Transmission</span>

      <button
        type="button"
        onClick={()=>{
          setPostToBeUpdate(null)
          reset()
        }}
      >
        Cancel
      </button>
    </div>
  )}



<Textarea
  {...register("body")}
  rows={3}
  placeholder="Share something with the galaxy..."
  className="create-post-textarea"
/>





<div className="create-post-footer">

  <label htmlFor="postImg" className="photo-btn">
    <FaImage />
    <span>Upload Image</span>
  </label>

  <input
    {...register("image")}
    id="postImg"
    type="file"
    accept="image/*"
    className="hidden"
  />

  <Button
    type="submit"
    className="publish-post-btn"
  >
    {postToBeUpdate
      ? (isUpdating ? "Updating..." : "Update")
      : (isAdding ? "Launching..." : "🚀 Launch Post")}
  </Button>

</div>

</form>
</>  )
}