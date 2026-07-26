import React from 'react'
import { Button } from 'flowbite-react'
import axios from 'axios'
import { headersObjData } from '../../helpers/headersObj'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import "./FollowSuggestions.css"

export default function FollowSuggestions() {

  const queryClient = useQueryClient()

  const {data,isLoading} = useQuery({
    queryFn: getSuggestions,
    queryKey:['followSuggestions']
  })

  async function getSuggestions(){
    try{
      const {data} = await axios.get(
        `https://route-posts.routemisr.com/users/suggestions?limit=10`,
        headersObjData()
      )
      return data
    }catch(err){
      console.log(err)
      throw err
    }
  }

  const {mutate:followMutate,isPending} = useMutation({
    mutationFn: toggleFollow,
    onSuccess:(data,userId)=>{
      queryClient.setQueryData(['followSuggestions'], (oldData) => {
        if(!oldData?.data?.suggestions) return oldData
        return {
          ...oldData,
          data:{
            ...oldData.data,
            suggestions: oldData.data.suggestions.map(u => 
              u._id === userId ? {...u, isFollowing: !u.isFollowing} : u
            )
          }
        }
      })
      toast.success('done')
    },
    onError:()=>{
      toast.error('something went wrong')
    }
  })

  async function toggleFollow(userId){
    try{
      const {data} = await axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        headersObjData()
      )
      return data
    }catch(err){
      console.log(err)
      throw err
    }
  }

  if(isLoading) return null

  const suggestions = data?.data?.suggestions ?? []

  if(suggestions.length === 0) return null

  return (
    <div className='suggestions-wrapper mb-4'>
      <h3 className='suggestions-title'>People you may know</h3>

      <div className='suggestions-scroll'>
        {suggestions.map((user)=>(
          <div key={user._id} className='suggestion-card'>
            <Link to={`/user/${user._id}`} className='flex flex-col items-center gap-2'>
              <img 
                src={user.photo || 'https://i.pravatar.cc/100'} 
                className='suggestion-avatar'
                alt=""
              />
              <span className='suggestion-name'>{user.name}</span>
            </Link>

            <Button 
              size='xs' 
              className='w-full mt-2'
              onClick={()=>followMutate(user._id)}
              disabled={isPending}
            >
              {user.isFollowing ? 'unfollow' : 'follow'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}