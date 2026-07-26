// import React, { useContext, useState } from 'react'
// import { useParams ,useLocation  } from 'react-router-dom'
// import { AuthContext } from '../../Context/AuthContext'
// import usePost from '../../customHooks/usePost'
// import Postcard from '../../component/PostCard/Postcard'
// import PostCardSkeleton from '../../component/PostCard/PostCardSkeleton/PostCardSkeleton'
// import { CommentsWraper } from '../../component/CommentsWraper/CommentsWraper'
// import axios from 'axios'
// import { headersObjData } from '../../helpers/headersObj'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { Button } from 'flowbite-react'
// import toast from 'react-hot-toast'

// export default function UserProfile() {

//   const {userId} = useParams()
//   const {userData} = useContext(AuthContext)
//   const queryClient = useQueryClient()
// const location = useLocation()
// const userHint = location.state?.userHint
//   const {data,isLoading,isFetched} = usePost(
//     ['userProfilePosts', userId],
//     Boolean(userId),
//     `users/${userId}/posts?limit=20`
//   )

//   const [isOpen, setIsOpen] = useState(false)
//   const [activePostId, setActivePostId] = useState(null)
//   const [postToBeUpdate, setPostToBeUpdate] = useState(null)

//   function handleClose(){
//     setIsOpen(false)
//   }

//   const firstPost = data?.posts?.[0]
// const profileOwner = firstPost?.sharedPost?.user ?? firstPost?.user ?? userHint
//   const {mutate:followMutate,isPending} = useMutation({
//     mutationFn: toggleFollow,
//     onSuccess:()=>{
//       toast.success('done')
//     },
//     onError:()=>{
//       toast.error('something went wrong')
//     }
//   })

//   async function toggleFollow(){
//     try{
//       const {data} = await axios.put(
//         `https://route-posts.routemisr.com/users/${userId}/follow`,
//         {},
//         headersObjData()
//       )
//       return data
//     }catch(err){
//       throw err
//     }
//   }

//   const isOwnProfile = userId === userData?._id

//   return (
//     <>
//       <title>profile</title>

//       <div className="min-h-screen py-4">
//         <div className="max-w-xl mx-auto px-3">

//           <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-3">
//             <img 
//               src={profileOwner?.photo || "https://i.pravatar.cc/100"} 
//               alt="user" 
//               className="w-14 h-14 rounded-full object-cover"
//             />
//             <div className='flex-1'>
//               <h2 className="font-semibold text-gray-800">
//                 {profileOwner?.name || "User"}
//               </h2>
//               {profileOwner?.username &&
//                 <p className="text-xs text-gray-500">@{profileOwner.username}</p>
//               }
//             </div>

//             {!isOwnProfile &&
//               <Button size='sm' onClick={()=>followMutate()} disabled={isPending}>
//                 follow
//               </Button>
//             }
//           </div>

//           {isLoading && (
//             <div className="space-y-3">
//               {[1,2].map((i) => (
//                 <div key={i} className="bg-white rounded-xl shadow-sm p-3">
//                   <PostCardSkeleton/>
//                 </div>
//               ))}
//             </div>
//           )}

//           {isFetched && data.posts?.length === 0 && (
//             <p className="text-gray-500 text-center mt-10">No posts yet</p>
//           )}

//           {isFetched && data.posts?.length > 0 && (
//             <div className="space-y-4">
//               {data.posts.map((post) => (
//                 <div 
//                   key={post._id} 
//                   className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3"
//                 >
//                   <Postcard 
//                     post={post}
//                     setIsOpen={setIsOpen}
//                     setActivePostId={setActivePostId}
//                     setPostToBeUpdate={setPostToBeUpdate}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}

//         </div>
//       </div>

//       <CommentsWraper 
//         isOpen={isOpen}
//         setIsOpen={setIsOpen}
//         handleClose={handleClose}
//         activePostId={activePostId}
//       />
//     </>
//   )
// }








import React, { useContext, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthContext'
import usePost from '../../customHooks/usePost'
import Postcard from '../../component/PostCard/Postcard'
import PostCardSkeleton from '../../component/PostCard/PostCardSkeleton/PostCardSkeleton'
import { CommentsWraper } from '../../component/CommentsWraper/CommentsWraper'
import axios from 'axios'
import { headersObjData } from '../../helpers/headersObj'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import toast from 'react-hot-toast'
import "./UserProfile.css";
export default function UserProfile() {

  const { userId } = useParams()
  const { userData } = useContext(AuthContext)
  const queryClient = useQueryClient()

  const location = useLocation()
  const userHint = location.state?.userHint

  const { data, isLoading, isFetched } = usePost(
    ['userProfilePosts', userId],
    Boolean(userId),
    `users/${userId}/posts?limit=20`
  )

  const [isOpen, setIsOpen] = useState(false)
  const [activePostId, setActivePostId] = useState(null)
  const [postToBeUpdate, setPostToBeUpdate] = useState(null)

  function handleClose() {
    setIsOpen(false)
  }

  const firstPost = data?.posts?.[0]
  const profileOwner = firstPost?.sharedPost?.user ?? firstPost?.user ?? userHint

  const { mutate: followMutate, isPending } = useMutation({
    mutationFn: toggleFollow,
    onSuccess: () => {
      toast.success('done')
    },
    onError: () => {
      toast.error('something went wrong')
    }
  })

  async function toggleFollow() {
    try {
      const { data } = await axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        headersObjData()
      )
      return data
    } catch (err) {
      throw err
    }
  }

  const isOwnProfile = userId === userData?._id

  return (
    <>
      <title>Profile</title>

      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#20103e_0%,#0b0818_45%,#05020d_100%)] py-6 relative overflow-hidden">

        <div className="absolute top-12 left-10 w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></div>
        <div className="absolute top-24 right-20 w-1 h-1 rounded-full bg-white animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse"></div>

        <div className="absolute -right-24 -top-20 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
        <div className="absolute -left-24 bottom-0 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div className="max-w-xl mx-auto px-3">

          <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#090816]/80 backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,.15)] p-6 mb-6">

            <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400/20 via-violet-500/20 to-fuchsia-500/20 blur-2xl"></div>

            <div className="relative flex items-center gap-5">

              <div className="relative">

                <div className="absolute inset-0 rounded-full bg-cyan-400 blur-xl opacity-60 animate-pulse"></div>

                <img
                  src={profileOwner?.photo || "https://i.pravatar.cc/100"}
                  alt="user"
                  className="relative w-20 h-20 rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_25px_#22d3ee]"
                />

              </div>

              <div className="flex-1">

                <h2 className="text-white text-2xl font-bold">
                  {profileOwner?.name || "Explorer"}
                </h2>

                {profileOwner?.username &&
                  <p className="text-cyan-300 mt-1">
                    @{profileOwner.username}
                  </p>
                }

                <div className="flex gap-2 mt-3 flex-wrap">

                  <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
                    🚀 Space Explorer
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs bg-violet-500/15 border border-violet-400/30 text-violet-300">
                    🌌 Galaxy Citizen
                  </span>

                </div>

              </div>

              {!isOwnProfile &&
                <Button
                  size="sm"
                  onClick={() => followMutate()}
                  disabled={isPending}
                  className="!rounded-full !px-6 !bg-gradient-to-r !from-cyan-500 !to-violet-600 hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,211,238,.4)]"
                >
                  {isPending ? "Following..." : "🚀 Follow"}
                </Button>
              }

            </div>

          </div>

          {isFetched && data.posts?.length === 0 && (
            <div className="relative overflow-hidden rounded-[30px] border border-cyan-400/30 bg-[#0a0f25]/80 backdrop-blur-xl py-20 px-8 text-center shadow-[0_0_80px_rgba(0,255,255,.15)]">

              <div className="absolute w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full top-[-80px] left-[-80px]" />
              <div className="absolute w-72 h-72 bg-fuchsia-500/10 blur-[120px] rounded-full bottom-[-80px] right-[-80px]" />

              <div className="relative z-10">

                <div className="text-7xl animate-bounce mb-4">
                  🚀
                </div>

                <h2 className="text-white text-3xl font-bold mb-3">
                  Empty Galaxy
                </h2>

                <p className="text-cyan-200 text-sm">
                  {profileOwner?.name || "This explorer"} hasn't shared
                  anything yet.
                </p>

                <div className="mt-8 flex justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping delay-200"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping delay-500"></span>
                </div>

              </div>

            </div>
          )}

          {isFetched && data.posts?.length > 0 && (
            <div className="space-y-8">
              {data.posts.map((post) => (
                <div
                  key={post._id}
                  className="relative group"
                >
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-[35px] bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-indigo-500/10 blur-2xl opacity-0 group-hover:opacity-100 duration-500" />

                  <div className="relative">
                    <Postcard
                      post={post}
                      setIsOpen={setIsOpen}
                      setActivePostId={setActivePostId}
                      setPostToBeUpdate={setPostToBeUpdate}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <CommentsWraper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleClose={handleClose}
        activePostId={activePostId}
      />
    </>
  )
}


