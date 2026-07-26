import React, { useContext, useState, useRef } from 'react'
import { AuthContext } from '../../Context/AuthContext';
import usePost from '../../customHooks/usePost';
import Postcard from '../../component/PostCard/Postcard';
import PostCardSkeleton from '../../component/PostCard/PostCardSkeleton/PostCardSkeleton';
import AddPost from '../../component/AddPost/AddPost';
import { CommentsWraper } from '../../component/CommentsWraper/CommentsWraper';
import axios from 'axios';
import { headersObjData } from '../../helpers/headersObj';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FaCamera } from "react-icons/fa";
import ProfilePhotoCropper from '../../component/ProfilePhotoCropper/ProfilePhotoCropper';
import { Link } from 'react-router-dom';
import { parseGIF, decompressFrames } from 'gifuct-js'

export default function Profile() {

  const {userData, getLoggedInUserData} = useContext(AuthContext)
  const queryClient = useQueryClient()

  const {data,isLoading,isFetched,isError,isFetching,isSuccess} = usePost(
    ['profilePosts'],
    Boolean(userData?._id),
    `users/${userData?._id}/posts?limit=2`
  )

  const [isOpen, setIsOpen] = useState(false)
  const [activePostId, setActivePostId] = useState(null)
  const [postToBeUpdate, setPostToBeUpdate] = useState(null)

  const fileInputRef = useRef(null)
  const [pendingFile, setPendingFile] = useState(null)   // ✅ ملف مؤقت لحد ما يخلص القصّ

  function handleClose(){
    setIsOpen(false)
  }

  // ✅ رفع الصورة + إنشاء بوست تلقائي بعدها
  const {mutate:uploadPhotoMutate,isPending:isUploadingPhoto} = useMutation({
    mutationFn: uploadPhoto,
    onSuccess:async ()=>{
      toast.success('profile photo updated successfully')
      await getLoggedInUserData()
      queryClient.invalidateQueries(['allPosts'])
      queryClient.invalidateQueries(['profilePosts'])
    },
    onError:()=>{
      toast.error('something went wrong')
    }
  })

  async function uploadPhoto(file){
    try{
      // 1) رفع الصورة كصورة بروفايل
      const formData = new FormData()
      formData.append('photo', file)

      const {data} = await axios.put(
        `https://route-posts.routemisr.com/users/upload-photo`,
        formData,
        headersObjData()
      )

      // 2) ✅ إنشاء بوست تلقائي بنفس الصورة، زي فيسبوك
      const postFormData = new FormData()
      postFormData.append('body', `${userData?.name ?? 'User'} updated their profile picture`)
      postFormData.append('image', file)

      await axios.post(
        `https://route-posts.routemisr.com/posts`,
        postFormData,
        headersObjData()
      )

      return data
    }catch(err){
      console.log(err)
      throw err
    }
  }



async function getGifDurationMs(file){
  const buffer = await file.arrayBuffer()
  const gif = parseGIF(buffer)
  const frames = decompressFrames(gif, false)
  return frames.reduce((sum, f) => sum + (f.delay || 100), 0)
}

async function handleFileSelected(e){
  const file = e.target.files[0]
  if(!file) return

  if(file.type === 'image/gif'){
    const duration = await getGifDurationMs(file)
    if(duration > 3000){
      toast.error('the GIF must be 3 seconds or shorter')
      e.target.value = ''
      return
    }
    uploadPhotoMutate(file)
  } else {
    setPendingFile(file)
  }
  e.target.value = ''
}



  function handleFileSelected(e){
    const file = e.target.files[0]
    if(!file) return

    // ✅ لو GIF، منعملش قصّ عشان منجمدش الحركة، نرفعها زي ما هي مباشرة
    if(file.type === 'image/gif'){
      uploadPhotoMutate(file)
    } else {
      setPendingFile(file)   // ✅ صورة عادية، نفتح مودال القصّ
    }

    e.target.value = ''   // ✅ نسمح باختيار نفس الملف تاني لو احتاج
  }

  function handleCropCancel(){
    setPendingFile(null)
  }

  function handleCropped(croppedFile){
    setPendingFile(null)
    uploadPhotoMutate(croppedFile)
  }

  return (
    <>
      <title>profile</title>

<div
  className="
  min-h-screen
  py-8
  relative
  overflow-hidden
  bg-[#10023e]
"
>





{/* Aurora */}

<div className="absolute inset-0 pointer-events-none">

    <div className="floatGlow left-0 top-0"></div>

    <div
        className="floatGlow"
        style={{
            right:0,
            bottom:0,
            position:"absolute"
        }}
    ></div>

    <div className="star" style={{top:"5%",left:"12%"}}></div>
    <div className="star" style={{top:"15%",left:"80%"}}></div>
    <div className="star" style={{top:"32%",left:"40%"}}></div>
    <div className="star" style={{top:"65%",left:"90%"}}></div>
    <div className="star" style={{top:"80%",left:"25%"}}></div>

</div>

        <div className="max-w-2xl mx-auto px-4 relative z-10">

          {/* Profile Header */}
          {/* <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-3">

            <div className='relative'>
              <img 
                src={userData?.photo || "https://i.pravatar.cc/100"} 
                alt="user" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <button
                type='button'
                onClick={()=>fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className='absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1 flex items-center justify-center'
              >
                <FaCamera size={10}/>
              </button>
              <input 
                type='file' 
                accept='image/*'
                ref={fileInputRef}
                onChange={handleFileSelected}
                className='hidden'
              />
            </div>

            <div>
              <h2 className="font-semibold text-sm text-cyan-200-800">
                {userData?.name || "User"}
                {isUploadingPhoto && <span className='text-xs text-cyan-200-400 ml-2'>uploading...</span>}
              </h2>
              <p className="text-xs text-cyan-200-500">
                View your posts
              </p>
            </div>
          </div> */}
{/* Profile Header */}
<div
className="
relative
overflow-hidden
rounded-[30px]
border
border-violet-500/30
bg-white/5
backdrop-blur-2xl
shadow-[0_0_50px_rgba(139,92,246,.25)]
p-6
mb-8
flex
items-center
gap-5
">
  <div className='relative'>
    <img 
      src={userData?.photo || "https://i.pravatar.cc/100"} 
      alt="user" 
className="
w-24
h-24
rounded-full
object-cover
border-[3px]
border-cyan-400
shadow-[0_0_35px_#22d3ee]
transition
duration-500
hover:scale-110
w-14 h-14 rounded-full object-cover border-2 border-violet-500 shadow-[0_0_20px_#8b5cf6]
"    />
    <button
      type='button'
      onClick={()=>fileInputRef.current?.click()}
      disabled={isUploadingPhoto}
className="
absolute
-bottom-2
-right-2
w-10
h-10
rounded-full
bg-gradient-to-r
from-cyan-500
to-violet-600
text-white
flex
items-center
justify-center
shadow-[0_0_20px_#22d3ee]
hover:scale-110
transition
"    >
      <FaCamera size={10}/>
    </button>
    <input 
      type='file' 
      accept='image/*'
      ref={fileInputRef}
      onChange={handleFileSelected}
      className='hidden'
    />
  </div>

  <div className='flex-1'>
<h2
className="
text-white
font-bold
text-2xl
tracking-wide
">      {userData?.name || "User"}
      {isUploadingPhoto && <span className="text-cyan-300 text-sm ml-3 animate-pulse">uploading...</span>}
    </h2>

    {/* ✅ بيانات إضافية */}
    {userData?.username &&
      <p className="text-xs text-cyan-200-500">@{userData.username}</p>
    }
    {userData?.bio &&
      <p className="text-xs text-cyan-200-600 mt-1">{userData.bio}</p>
    }
    {userData?.dateOfBirth &&
      <p className="text-xs text-cyan-200-400 mt-1">
        Born {new Date(userData.dateOfBirth).toLocaleDateString()}
      </p>
    }
  </div>

  {/* ✅ لينك لصفحة الإعدادات */}
  <Link to="/settings" className="px-4
py-2
rounded-full
bg-gradient-to-r
from-cyan-500
to-violet-600
text-white
text-sm
shadow-[0_0_20px_#7c3aed]
hover:scale-105
transition
">
    Settings
  </Link>
</div>
          {/* Add / Update Post */}
          <div className="mb-4">
            <AddPost 
              postToBeUpdate={postToBeUpdate}
              setPostToBeUpdate={setPostToBeUpdate}
            />
          </div>

          {/* Loading */}
          {(isLoading || (Boolean(userData?._id) == false)) && (
            <div className="space-y-3">
              {[1,2].map((i) => (
                <div key={i} className=" rounded-xl shadow-sm p-3">
                  <PostCardSkeleton/>
                </div>
              ))}
            </div>
          )}

          {/* Posts */}
          {isFetched && (
            <div className="space-y-4">
             {data.posts?.map((post) => (
                            <div 
                              key={post._id} 
                            >
                              <Postcard 
                                post={post} 
                                setActivePostId={setActivePostId} 
                                setIsOpen={setIsOpen}
                                setPostToBeUpdate={setPostToBeUpdate}
                              />
                            </div>
                          ))}
            </div>
          )}

        </div>

      </div>

      {/* ✅ مودال قصّ الصورة */}
      {pendingFile &&
        <ProfilePhotoCropper 
          file={pendingFile}
          onCancel={handleCropCancel}
          onCropped={handleCropped}
        />
      }

      <CommentsWraper 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleClose={handleClose}
        activePostId={activePostId}
      />
    </>
  )
}