import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { headersObjData } from '../helpers/headersObj'

export default function usePost(queryKey,isEnabled,endPoint) {
  
  
  
  
  const {data,isLoading,isFetched,isError,isFetching} = useQuery({
    queryFn: getPosts,
    queryKey:[...queryKey],
    enabled: isEnabled,
    retry: false
  })
  
      


async function getPosts(){


try{
    const {data} = await axios.get(`https://route-posts.routemisr.com/${endPoint}`,headersObjData())
console.log(data.data ,'FROM POST HOOK......')
console.log(data, 'testttttttttt');
return data.data 




}
catch(err){
  console.log(err,'FROM GET POST HOOK...............' )
  throw err
}



   




}

  return {data,isLoading,isFetched,isError,isFetching}     
   }





















// const {data,isLoading,isFetched,} =useQuery({
//   queryFn:getUserPosts,
//   queryKey:['USER POSTS'],
//   enabled:Boolean(userData?._id)
// })



// async function getUserPosts(){


// try{const {data} = await axios.get(`https://route-posts.routemisr.com/users/${userData._id}/posts?limit=2`,headersObjData)
// console.log(data.data.posts)
// return data.data.posts  

// }catch(err){
//   console.log(err,'FROM GET ALL POSTSS...............' )
//   return []
// }


// }
