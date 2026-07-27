import { Card, Modal, ModalHeader, ModalBody, Textarea } from 'flowbite-react'
import React, { useContext, useState } from 'react'
import { FaInfoCircle } from "react-icons/fa";
import { FaCommentAlt, FaShare, FaImage } from "react-icons/fa";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import {formatDistanceToNow} from 'date-fns'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import { headersObjData } from '../../helpers/headersObj';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import "../../Postcard.css";
import { motion } from "framer-motion";

function isVideoUrl(url){
  return /\.(mp4|webm|mov|ogg)$/i.test(url ?? '')
}

export default function Postcard({post,setIsOpen,setActivePostId,setPostToBeUpdate}) {
    if (!post || !post.user) return null;

    const postId = post.id ?? post._id

    const displayPost = post.sharedPost ?? post
    const {body, image:postImg} = displayPost
    const {name, photo:userImg, _id:contentAuthorId} = displayPost.user ?? {}

    const {name:sharerName, photo:sharerImg, _id:sharerId} = post.user ?? {}

    const {createdAt:postDate} = post
   const {userData}= useContext(AuthContext)
   const queryClient=useQueryClient()
   if (!postDate) return null;
   
   const result = formatDistanceToNow(new Date(postDate))

   const isLiked = post.likes?.includes(userData?._id)
   const likesCount = post.likesCount ?? post.likes?.length ?? 0
   const isBookmarked = Boolean(post.bookmarked)
   const commentsCount = post.commentsCount ?? 0
   const sharesCount = post.sharesCount ?? 0

   const [showShareBox, setShowShareBox] = useState(false)
   const [caption, setCaption] = useState('')

   const [showLikesModal, setShowLikesModal] = useState(false)
   const [showCommentersModal, setShowCommentersModal] = useState(false)

   const [isEditingPost, setIsEditingPost] = useState(false)
   const [editBody, setEditBody] = useState('')
   const [editImageFile, setEditImageFile] = useState(null)

   const [optimisticLike, setOptimisticLike] = useState(null)
   const displayIsLiked = optimisticLike ? optimisticLike.isLiked : isLiked
   const displayLikesCount = optimisticLike ? optimisticLike.likesCount : likesCount

   const [optimisticBookmark, setOptimisticBookmark] = useState(null)
   const displayIsBookmarked = optimisticBookmark !== null ? optimisticBookmark : isBookmarked

   function startEditing(){
     setEditBody(post.body ?? '')
     setEditImageFile(null)
     setIsEditingPost(true)
   }

   function cancelEditing(){
     setIsEditingPost(false)
     setEditBody('')
     setEditImageFile(null)
   }
   
   const {mutate,isPending}=useMutation({mutationFn:deletePost,
    onSuccess:()=>{
      queryClient.invalidateQueries(['allPosts'])
      queryClient.invalidateQueries(['profilePosts'])
      queryClient.invalidateQueries(['allPostsForBookmarks'])
      toast.success('POST DELETED SUCCESSFULLY!')
    },
    onError:()=>{
        toast.error('something went wrong')
    }
   })
   
async function deletePost(){
    try{
      const response = await axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, headersObjData())
      return response
    }catch(err){
      throw err
    }
}

const {mutate:deleteShareMutate,isPending:isDeletingShare} = useMutation({
  mutationFn: deleteShare,
  onSuccess:()=>{
    queryClient.invalidateQueries(['allPosts'])
    queryClient.invalidateQueries(['profilePosts'])
    queryClient.invalidateQueries(['allPostsForBookmarks'])
    toast.success('share removed successfully')
  },
  onError:()=>{
    toast.error('something went wrong')
  }
})

async function deleteShare(){
  try{
    const response = await axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, headersObjData())
    return response
  }catch(err){
    throw err
  }
}

const {mutate:updatePostMutate,isPending:isUpdatingPost} = useMutation({
  mutationFn: updatePost,
  onSuccess:()=>{
    queryClient.invalidateQueries(['allPosts'])
    queryClient.invalidateQueries(['profilePosts'])
    queryClient.invalidateQueries(['allPostsForBookmarks'])
    queryClient.invalidateQueries(['details'])
    toast.success('updated successfully')
    cancelEditing()
  },
  onError:()=>{
    toast.error('something went wrong')
  }
})

async function updatePost(){
  try{
    const formData = new FormData()
    formData.append('body', editBody)
    if(editImageFile){
      formData.append('image', editImageFile)
    }

    const {data} = await axios.put(
      `https://route-posts.routemisr.com/posts/${postId}`,
      formData,
      headersObjData()
    )
    return data
  }catch(err){
    throw err
  }
}

function handleLikeClick(){
  const nextIsLiked = !displayIsLiked
  setOptimisticLike({
    isLiked: nextIsLiked,
    likesCount: displayLikesCount + (nextIsLiked ? 1 : -1)
  })
  likeMutate()
}

const {mutate:likeMutate} = useMutation({
  mutationFn: toggleLike,
  onSuccess: async ()=>{
    await Promise.all([
      queryClient.invalidateQueries(['allPosts']),
      queryClient.invalidateQueries(['profilePosts']),
      queryClient.invalidateQueries(['details']),
      queryClient.invalidateQueries(['allPostsForBookmarks']),
      queryClient.invalidateQueries(['postLikes',postId]),
    ])
    setOptimisticLike(null)
  },
  onError:()=>{
    toast.error('something went wrong')
    setOptimisticLike(null)
  }
})

async function toggleLike(){
  try{
    const {data} = await axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/like`,
      {},
      headersObjData()
    )
    return data
  }catch(err){
    throw err
  }
}

// ✅ الدالة دي بتكتب قيمة "next" مباشرة في كل الكاشات مرة واحدة، من غير أي عكس تاني
function patchBookmarkEverywhere(nextValue){
  const updateList = (oldData) => {
    if(!oldData?.posts) return oldData
    return {
      ...oldData,
      posts: oldData.posts.map(p => {
        const pId = p.id ?? p._id
        return pId === postId ? {...p, bookmarked: nextValue} : p
      })
    }
  }

  queryClient.setQueryData(['allPosts'], updateList)
  queryClient.setQueryData(['profilePosts'], updateList)
  queryClient.setQueryData(['allPostsForBookmarks'], updateList)

  queryClient.setQueryData(['details'], (oldData) => {
    if(!oldData?.post) return oldData
    const pId = oldData.post.id ?? oldData.post._id
    if(pId !== postId) return oldData
    return {...oldData, post: {...oldData.post, bookmarked: nextValue}}
  })
}

function handleBookmarkClick(){
  const wasBookmarked = displayIsBookmarked
  const next = !wasBookmarked

  setOptimisticBookmark(next)
  patchBookmarkEverywhere(next)
  toast.success(next ? 'added to bookmarks' : 'removed from bookmarks')

  bookmarkMutate(undefined, {
    onSuccess: () => {
      setOptimisticBookmark(null)
    },
    onError: () => {
      toast.error('something went wrong, reverted')
      patchBookmarkEverywhere(wasBookmarked)
      setOptimisticBookmark(null)
    }
  })
}

const {mutate:bookmarkMutate} = useMutation({
  mutationFn: toggleBookmark
})

async function toggleBookmark(){
  try{
    const {data} = await axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
      {},
      headersObjData()
    )
    return data
  }catch(err){
    throw err
  }
}

const {mutate:shareMutate,isPending:isSharing} = useMutation({
  mutationFn: sharePost,
  onSuccess:()=>{
    queryClient.invalidateQueries(['allPosts'])
    queryClient.invalidateQueries(['profilePosts'])
    queryClient.invalidateQueries(['allPostsForBookmarks'])
    toast.success('post shared successfully')
    setCaption('')
    setShowShareBox(false)
  },
  onError:()=>{
    toast.error('something went wrong')
  }
})

async function sharePost(){
  try{
    const {data} = await axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/share`,
      { body: caption },
      headersObjData()
    )
    return data
  }catch(err){
    throw err
  }
}

const {data:likesData,isLoading:isLoadingLikes} = useQuery({
  queryFn: getPostLikes,
  queryKey:['postLikes',postId],
  enabled: showLikesModal
})

async function getPostLikes(){
  try{
    const {data} = await axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/likes?page=1&limit=50`,
      headersObjData()
    )
    return data
  }catch(err){
    throw err
  }
}

const totalCommentsCount = commentsCount

const {data:commentersData, isLoading:isLoadingCommenters} = useQuery({
  queryKey:['commenters', postId],
  queryFn: async () => {
    const {data} = await axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments?limit=50`,
      headersObjData()
    )
    const comments = data?.data?.comments ?? []
    const uniqueMap = new Map()
    comments.forEach(c => {
      const u = c.commentCreator
      if(u?._id && !uniqueMap.has(u._id)) uniqueMap.set(u._id, u)
    })
    return Array.from(uniqueMap.values())
  },
  enabled: showCommentersModal
})

function handleClickComment(){
 setIsOpen(true);
 setActivePostId(postId)
}

    return (
<>

<motion.div
  initial={{ opacity: 0, y: 40, scale: 0.96 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: .6 }}
  whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
  className="relative"
>
<Card className="post-card w-full my-8  overflow-hidden">



<div className="stars">
  {[...Array(30)].map((_,i)=>(
    <span
      key={i}
      className="star"
      style={{
        left:`${Math.random()*100}%`,
        top:`${Math.random()*100}%`,
        animationDelay:`${Math.random()*4}s`,
        animationDuration:`${2+Math.random()*4}s`
      }}
    />
  ))}
</div>


<div className="saturn">
</div>

<div className="card-glow"></div>

{post.sharedPost && (
  <div className="mb-4 relative z-10">

    {/* Shared text */}
    <div className="mb-3">
      <div className="flex items-center gap-2 text-violet-200 text-sm">
       {sharerImg && (
  <Link
    to={`/user/${sharerId}`}
    state={{ userHint: { name: sharerName, photo: sharerImg } }}
  >
    <img
      src={sharerImg}
      className="size-7 rounded-full object-cover border border-cyan-400/40 cursor-pointer"
      alt=""
    />
  </Link>
)}

        <span className="shared-post-text">
          🚀 {sharerName} shared this post
        </span>
      </div>
    </div>

    {/* Owner buttons */}
    {sharerId === userData?._id && !isEditingPost && (
      <div className="flex flex-wrap gap-2">

        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={startEditing}
          className="space-edit-btn flex items-center justify-center gap-1.5"
        >
          <span className="btn-glow"></span>
          
          <span>Edit</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => deleteShareMutate()}
          className="space-remove-btn flex items-center justify-center gap-1.5"
        >
          <span className="btn-glow"></span>
          
          <span>
            {isDeletingShare ? "Removing..." : "Remove"}
          </span>
        </motion.button>

      </div>
    )}

  </div>
)}

{post.sharedPost && !isEditingPost && post.body &&
<p className='text-violet-100 text-lg mb-2 relative z-10'>{post.body}</p>
}

<div className="flex items-center justify-between relative z-20">

  <div className="flex items-center gap-4">

    <motion.div
      whileHover={{scale:1.1}}
      animate={{
        boxShadow:[
          "0 0 20px #7c3aed",
          "0 0 45px #06b6d4",
          "0 0 20px #7c3aed"
        ]
      }}
      transition={{ duration:3, repeat:Infinity }}
      className="relative rounded-full"
    >
 {userImg && (
  <Link
    to={`/user/${contentAuthorId}`}
    state={{ userHint: { name, photo: userImg } }}
  >
    <img
      className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 cursor-pointer"
      src={userImg}
      alt={name}
    />
  </Link>
)}
      <div className="online-orbit"></div>
    </motion.div>

    <div>
      <motion.h2
        animate={{
          textShadow:[
            "0 0 5px #fff",
            "0 0 18px #8b5cf6",
            "0 0 5px #fff"
          ]
        }}
        transition={{ repeat:Infinity, duration:2 }}
        className="text-white font-bold text-lg"
      >
        {name}
      </motion.h2>

      <p className="text-cyan-200 text-xs tracking-widest">
        🚀 {result}
      </p>
    </div>

  </div>

  <motion.div
    animate={{ rotate:[0,360] }}
    transition={{ repeat:Infinity, duration:15, ease:"linear" }}
    className="text-3xl"
  >
    
  </motion.div>

</div>

{contentAuthorId === userData?._id && !post.sharedPost && !isEditingPost &&
<div className="flex gap-3 mt-4">

<motion.button
  whileHover={{scale:1.06,y:-2}}
  whileTap={{scale:.95}}
  onClick={startEditing}
  className="space-edit-btn"
>
  <span className="btn-glow"></span>
   Edit
</motion.button>

<motion.button
  whileHover={{scale:1.06,y:-2}}
  whileTap={{scale:.95}}
  onClick={()=>mutate()}
  className="space-delete-btn"
>
  <span className="btn-glow"></span>
  {isPending ? "Deleting..." : " Delete"}
</motion.button>

</div>
}

{!isEditingPost &&
<p className="text-white text-xl leading-9 my-5 relative z-10">
  {body}
</p>
}

{!isEditingPost && postImg && (
  isVideoUrl(postImg)
    ? (
      <motion.div
        whileHover={{scale:1.02}}
        transition={{duration:.4}}
        className="relative z-20 overflow-hidden rounded-[28px]"
      >
        <div className="image-orbit"></div>
        <video
          src={postImg}
          controls
          className="rounded-[28px] w-full max-h-[450px] object-cover"
        />
        <div className="image-glow"></div>
      </motion.div>
    )
    : (
      <motion.div
        whileHover={{scale:1.02}}
        transition={{duration:.4}}
        className="relative z-20 overflow-hidden rounded-[28px]"
      >
        <div className="image-orbit"></div>
        <img
          src={postImg}
          className="rounded-[28px] w-full max-h-[450px] object-cover transition duration-700 hover:scale-110"
          alt=""
        />
        <div className="image-glow"></div>
      </motion.div>
    )
)}

{isEditingPost &&
<div className='mt-3 mb-5 relative z-10 bg-[#1a0b2e] border border-violet-500/30 p-3 rounded-lg'>
  <Textarea 
    value={editBody}
    onChange={(e)=>setEditBody(e.target.value)}
    rows={3}
    className='text-white bg-transparent'
    placeholder="write something..."
  />

  {!post.sharedPost &&
    <div className='mt-2'>
      <input 
        type='file' 
        accept='image/*,video/*'
        id={`edit-image-${postId}`}
        className='hidden'
        onChange={(e)=>setEditImageFile(e.target.files[0])}
      />
      <label 
        htmlFor={`edit-image-${postId}`}
        className='inline-flex items-center gap-2 text-violet-200 text-sm cursor-pointer hover:underline'
      >
        <FaImage/> {editImageFile ? editImageFile.name : 'change photo/video (optional)'}
      </label>
    </div>
  }

  <div className='flex gap-3 mt-3'>
    <motion.button
      whileHover={{scale:1.05}}
      whileTap={{scale:.95}}
      onClick={()=>updatePostMutate()}
      disabled={isUpdatingPost}
      className="space-save-btn"
    >
      <span className="btn-glow"></span>
      {isUpdatingPost ? 'Saving...' : '💾 Save'}
    </motion.button>

    <motion.button
      whileHover={{scale:1.05}}
      whileTap={{scale:.95}}
      onClick={cancelEditing}
      disabled={isUpdatingPost}
      className="space-cancel-btn"
    >
      Cancel
    </motion.button>
  </div>
</div>
}

<motion.div
  initial={{opacity:0,y:20}}
  whileInView={{opacity:1,y:0}}
  transition={{delay:.2}}
  className="flex justify-between items-center relative z-20 mt-5 px-2"
>
  <motion.div
    whileHover={{scale:1.12,y:-3}}
    whileTap={{scale:.9}}
    className="space-action"
  >
    {displayIsLiked 
     ?
      <motion.div
        animate={{
          scale:[1,1.25,1],
          filter:[
            "drop-shadow(0 0 6px #60a5fa)",
            "drop-shadow(0 0 20px #38bdf8)",
            "drop-shadow(0 0 6px #60a5fa)"
          ]
        }}
        transition={{ repeat:Infinity, duration:1.5 }}
      >
        <AiFillLike
          size={38}
          className="cursor-pointer text-cyan-300"
          onClick={handleLikeClick}
        />
      </motion.div>
     :
      <AiOutlineLike
        size={38}
        className="cursor-pointer text-violet-200"
        onClick={handleLikeClick}
      />
    }

    <span
      className="space-counter"
      onClick={()=>displayLikesCount>0 && setShowLikesModal(true)}
    >
      {displayLikesCount}
    </span>
  </motion.div>

  <motion.div
    whileHover={{scale:1.12,rotate:-8}}
    whileTap={{scale:.9}}
    className="space-action"
  >
    <FaCommentAlt onClick={handleClickComment} size={34} className="cursor-pointer text-violet-200"/>
    <span 
      className='space-counter'
      onClick={()=>totalCommentsCount > 0 && setShowCommentersModal(true)}
    >
      {totalCommentsCount}
    </span>
  </motion.div>

  <motion.div
    whileHover={{scale:1.12}}
    whileTap={{scale:.9}}
    className="space-action"
  >
    <FaShare 
      size={32} 
      className={`cursor-pointer text-violet-200 ${isSharing ? 'opacity-50' : ''}`} 
      onClick={()=>setShowShareBox(prev => !prev)}
    />
    <span className='space-counter'>{sharesCount}</span>
  </motion.div>

  <motion.div
    whileHover={{scale:1.2,rotate:15}}
    whileTap={{scale:.9}}
  >
    {displayIsBookmarked ?
      <FaBookmark
        size={34}
        className="cursor-pointer text-yellow-300 drop-shadow-[0_0_15px_gold]"
        onClick={handleBookmarkClick}
      />
      :
      <FaRegBookmark
        size={34}
        className="cursor-pointer text-violet-200"
        onClick={handleBookmarkClick}
      />
    }
  </motion.div>

  <motion.div
    whileHover={{rotate:180,scale:1.2}}
    transition={{duration:.5}}
  >
    <Link to={`/details/${postId}`}>
      <FaInfoCircle size={34} className="text-cyan-300"/>
    </Link>
  </motion.div>
</motion.div>

{showShareBox &&
<div className='mt-3 bg-[#1a0b2e] border border-violet-500/30 p-3 rounded-lg relative z-10'>
  <Textarea 
    value={caption}
    onChange={(e)=>setCaption(e.target.value)}
    placeholder="write something about this share (optional)..."
    rows={2}
    className='text-white bg-transparent'
  />
  <div className='flex gap-3 mt-2'>
    <motion.button
      whileHover={{scale:1.05}}
      whileTap={{scale:.95}}
      onClick={()=>shareMutate()}
      disabled={isSharing}
      className="space-share-btn"
    >
      <span className="btn-glow"></span>
      {isSharing ? 'Sharing...' : '🚀 Share Now'}
    </motion.button>

    <motion.button
      whileHover={{scale:1.05}}
      whileTap={{scale:.95}}
      onClick={()=>{setShowShareBox(false); setCaption('')}}
      className="space-cancel-btn"
    >
      Cancel
    </motion.button>
  </div>
</div>
}

</Card>
</motion.div>


















<Modal
  show={showLikesModal}
  onClose={() => setShowLikesModal(false)}
  size="md"
  className="likes-modal"
>
 <ModalHeader className="likes-header">
  💜 People who liked this post
</ModalHeader>

  <ModalBody className="likes-body">

    {isLoadingLikes && (
      <p className="likes-loading">
        Loading explorers...
      </p>
    )}

    {!isLoadingLikes && likesData?.data?.likes?.length === 0 && (
      <div className="likes-empty">
        <div className="empty-planet">🪐</div>
        <h3>No likes yet</h3>
        <p>Be the first astronaut to like this post.</p>
      </div>
    )}

    <div className="likes-list">

      {likesData?.data?.likes?.map((likeUser) => (

        <motion.div
          key={likeUser._id}
          whileHover={{ scale: 1.03 }}
          className="like-user-card"
        >

          <Link
  to={`/user/${likeUser._id}`}
  state={{ userHint: { name: likeUser.name, photo: likeUser.photo } }}
>
  <img
    src={likeUser.photo || "https://png.pngtree.com/png-vector/20220818/ourmid/pngtree-cartoon-dead-fish-png-image_6113748.png"}
    className="like-avatar cursor-pointer"
    alt=""
  />
</Link>

          <div className="flex-1">

            <h4>{likeUser.name}</h4>

            <span>🚀 Space Explorer</span>

          </div>

          <div className="like-heart">
            ❤️
          </div>

        </motion.div>

      ))}

    </div>

    <div className="mt-5 flex justify-end">

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: .95 }}
        onClick={() => setShowLikesModal(false)}
        className="space-modal-btn"
      >
        Close
      </motion.button>

    </div>

  </ModalBody>
</Modal>

<Modal
  show={showCommentersModal}
  onClose={() => setShowCommentersModal(false)}
  size="sm"
  className="likes-modal"
>
  <ModalHeader className="likes-header">
    💬 People who commented
  </ModalHeader>

  <ModalBody className="likes-body">

    {isLoadingCommenters && (
      <p className="likes-loading">
        Loading explorers...
      </p>
    )}

    {!isLoadingCommenters && commentersData?.length === 0 && (
      <div className="likes-empty">
        <div className="empty-planet">🪐</div>
        <h3>No comments yet</h3>
        <p>Be the first astronaut to comment.</p>
      </div>
    )}

    <div className="likes-list">

      {commentersData?.map((commenter) => (

        <motion.div
          key={commenter._id}
          whileHover={{ scale: 1.03 }}
          className="like-user-card"
        >

        <Link
  to={`/user/${commenter._id}`}
  state={{ userHint: { name: commenter.name, photo: commenter.photo } }}
>
  <img 
    src={commenter.photo || 'https://png.pngtree.com/png-vector/20220818/ourmid/pngtree-cartoon-dead-fish-png-image_6113748.png'} 
    className='size-[35px] rounded-full object-cover cursor-pointer'
    alt=""
  />
</Link>

          <div className="flex-1">
            <h4>{commenter.name}</h4>
            <span>🚀 Space Explorer</span>
          </div>

          <div className="like-heart">
            💬
          </div>

        </motion.div>

      ))}

    </div>

    <div className="mt-5 flex justify-end">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: .95 }}
        onClick={() => setShowCommentersModal(false)}
        className="space-modal-btn"
      >
        Close
      </motion.button>
    </div>

  </ModalBody>
</Modal>

</>  )
}