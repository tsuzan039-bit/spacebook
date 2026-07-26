import { Button, Textarea } from 'flowbite-react'
import React, { useContext, useState } from 'react'
import { AuthContext } from './../Context/AuthContext';
import axios from 'axios'
import { headersObjData } from '../helpers/headersObj';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast'
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import "./Comment.css";

function Reply({reply,activePostId,commentId}){
  const {userData} = useContext(AuthContext)
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(reply.content)

  const isOwner = userData?._id === reply.commentCreator?._id

  const {mutate:deleteReplyMutate,isPending:isDeletingReply} = useMutation({
    mutationFn: deleteReply,
    onSuccess:()=>{
      queryClient.invalidateQueries(['replies',commentId]);
      queryClient.invalidateQueries(['totalCommentsCount', activePostId]);
      toast.success('reply deleted successfully')
    },
    onError:()=>{
      toast.error('something went wrong')
    }
  })

  async function deleteReply(){
    try{
      const {data} = await axios.delete(
        `https://route-posts.routemisr.com/posts/${activePostId}/comments/${reply._id}`,
        headersObjData()
      )
      return data
    }catch(err){
      throw err
    }
  }

  const {mutate:updateReplyMutate,isPending:isUpdatingReply} = useMutation({
    mutationFn: updateReply,
    onSuccess:()=>{
      queryClient.invalidateQueries(['replies',commentId]);
      toast.success('reply updated successfully')
      setIsEditing(false)
    },
    onError:()=>{
      toast.error('something went wrong')
    }
  })

  async function updateReply(){
    try{
      const {data} = await axios.put(
        `https://route-posts.routemisr.com/posts/${activePostId}/comments/${reply._id}`,
        { content: editContent },
        headersObjData()
      )
      return data
    }catch(err){
      throw err
    }
  }
return (
  <div
    className="relative flex gap-3 rounded-2xl p-3 mt-3
    bg-gradient-to-br from-[#140b30]/90 via-[#1b103f]/90 to-[#090617]/90
    border border-violet-500/30
    backdrop-blur-xl
    shadow-[0_0_25px_rgba(139,92,246,.25)]
    overflow-hidden group"
  >

    {/* Glow */}
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,#8b5cf6,transparent_65%)]"></div>

    {/* Stars */}
    <div className="reply-star s1"></div>
    <div className="reply-star s2"></div>
    <div className="reply-star s3"></div>

    <img
      src={
        reply.commentCreator?.photo ||
        'https://png.pngtree.com/png-vector/20220818/ourmid/pngtree-cartoon-dead-fish-png-image_6113748.png'
      }
      className="relative z-10
      size-[42px]
      rounded-full
      object-cover
      border-2
      border-violet-500
      shadow-[0_0_18px_#8b5cf6]"
      alt=""
    />

    <div className="flex-1 relative z-10">

      <div className="flex items-center gap-2">

        <h3 className="font-semibold text-violet-100">
          {reply.commentCreator?.name}
        </h3>

        <span
          className="text-[10px]
          bg-violet-600/30
          text-violet-200
          px-2
          rounded-full"
        >
          Crew
        </span>

      </div>

      {!isEditing &&

      <p className="text-violet-100 mt-2 leading-7">
        {reply.content}
      </p>

      }

      {isEditing &&

      <div
        className="mt-3
        rounded-xl
        border
        border-violet-500/30
        bg-[#140b30]/80
        p-3"
      >

        <Textarea
          value={editContent}
          onChange={(e)=>setEditContent(e.target.value)}
          rows={2}
          className="text-white bg-transparent"
        />

        <div className="flex gap-2 mt-3">

          <Button
            size="xs"
            onClick={()=>updateReplyMutate()}
            disabled={isUpdatingReply}
            className="bg-violet-600 hover:bg-violet-500 border-none"
          >
            {isUpdatingReply ? 'Saving...' : 'Save'}
          </Button>

          <Button
            size="xs"
            color="gray"
            onClick={()=>{
              setIsEditing(false)
              setEditContent(reply.content)
            }}
          >
            Cancel
          </Button>

        </div>

      </div>

      }

      {isOwner && !isEditing &&

      <div className="flex gap-2 mt-3">

        <Button
          size="xs"
          onClick={()=>setIsEditing(true)}
          className="bg-amber-500 hover:bg-amber-400 border-none"
        >
          Edit
        </Button>

        <Button
          size="xs"
          onClick={()=>deleteReplyMutate()}
          className="bg-red-600 hover:bg-red-500 border-none"
        >
          {isDeletingReply ? 'Deleting...' : 'Delete'}
        </Button>

      </div>

      }

    </div>

  </div>
)
}

export default function Comment({comment,setUpdateComment,activePostId,activeReplyCommentId,setActiveReplyCommentId}) {

if (!comment || !comment.commentCreator) return null;

const {createdAt,_id:id,content,likes} = comment
const {photo,_id:creatorId,name} = comment.commentCreator
const defultImg = 'https://png.pngtree.com/png-vector/20220818/ourmid/pngtree-cartoon-dead-fish-png-image_6113748.png'
const {userData}=useContext(AuthContext)

const queryClient = useQueryClient()

const isCommentLiked = likes?.includes(userData?._id)
const commentLikesCount = likes?.length ?? 0

// ✅ الريبلاي بتاع الكومنت ده مفتوح؟ (state مشتركة، كومنت واحد بس في المرة)
const isReplying = activeReplyCommentId === id

const [showReplies, setShowReplies] = useState(false)

const {register,handleSubmit,reset} = useForm({
  defaultValues:{content:''}
})

const {mutate:deleteMutate,isPending:isDeleting} = useMutation({
  mutationFn: deleteComment,
  onSuccess:()=>{
    queryClient.invalidateQueries(['comments',activePostId]);
    queryClient.invalidateQueries(['totalCommentsCount', activePostId]);
    queryClient.invalidateQueries(['commenters', activePostId]);
    toast.success('comment deleted successfully')
  },
  onError:()=>{
    toast.error('something went wrong')
  }
})

async function deleteComment(){
  try{
    const {data} = await axios.delete(
      `https://route-posts.routemisr.com/posts/${activePostId}/comments/${id}`,
      headersObjData()
    )
    return data
  }catch(err){
    throw err
  }
}

const {mutate:likeCommentMutate} = useMutation({
  mutationFn: toggleCommentLike,
  onSuccess:()=>{
    queryClient.invalidateQueries(['comments',activePostId]);
  },
  onError:()=>{
    toast.error('something went wrong')
  }
})

async function toggleCommentLike(){
  try{
    const {data} = await axios.put(
      `https://route-posts.routemisr.com/posts/${activePostId}/comments/${id}/like`,
      {},
      headersObjData()
    )
    return data
  }catch(err){
    throw err
  }
}

const {data:repliesData,isLoading:isLoadingReplies} = useQuery({
  queryFn: getReplies,
  queryKey:['replies',id],
  enabled: showReplies
})

async function getReplies(){
  try{
    const {data} = await axios.get(
      `https://route-posts.routemisr.com/posts/${activePostId}/comments/${id}/replies`,
      headersObjData()
    )
    return data
  }catch(err){
    throw err
  }
}

const {mutate:addReplyMutate,isPending:isAddingReply} = useMutation({
  mutationFn: addReply,
  onSuccess:()=>{
    queryClient.invalidateQueries(['replies',id]);
    queryClient.invalidateQueries(['totalCommentsCount', activePostId]);
    toast.success('reply added successfully')
    reset()
    setActiveReplyCommentId(null)   // ✅ نقفل الريبلاي بعد الإرسال، ونرجع الأصلية تظهر
    setShowReplies(true)
  },
  onError:()=>{
    toast.error('something went wrong')
  }
})

async function addReply(values){
  try{
    const {data} = await axios.post(
      `https://route-posts.routemisr.com/posts/${activePostId}/comments/${id}/replies`,
      { content: values.content },
      headersObjData()
    )
    return data
  }catch(err){
    throw err
  }
}

function toggleReplyBox(){
  if(isReplying){
    setActiveReplyCommentId(null)   // كنت فاتح ريبلاي ليه، اقفله
  } else {
    setActiveReplyCommentId(id)     // افتح ريبلاي للكومنت ده، ويقفل أي كومنت تاني كان فاتح
  }
}

  return (
<>
<div
className="
relative
overflow-hidden
rounded-[28px]
my-6
p-6

bg-gradient-to-br
from-[#090b22]
via-[#1b103f]
to-[#05030d]

border
border-violet-500/30

backdrop-blur-xl

shadow-[0_0_45px_rgba(139,92,246,.25)]

group

transition-all
duration-500

hover:scale-[1.015]
hover:shadow-[0_0_80px_rgba(139,92,246,.45)]
">

{/* Nebula */}
<div className="comment-nebula"></div>

{/* Stars */}
<div className="comment-star star1"></div>
<div className="comment-star star2"></div>
<div className="comment-star star3"></div>
<div className="comment-star star4"></div>
<div className="comment-star star5"></div>

{/* Planet */}
<div className="mini-planet"></div>

<div className="relative z-10 flex gap-4">

<img

src={photo || defultImg}

alt=""

className="
w-14
h-14
rounded-full
object-cover

border-2
border-violet-500

shadow-[0_0_25px_#8b5cf6]

transition
duration-500

group-hover:rotate-6
"
/>

<div className="flex-1">

<div className="flex items-center justify-between">

<div>

<h3
className="
text-lg
font-bold
text-violet-100
tracking-wide
"
>
{name}
</h3>

<p className="text-xs text-violet-300 mt-1">
🪐 {createdAt ? createdAt.split('T')[0] : ''}
</p>

</div>

<div className="comment-badge">
Galaxy User
</div>

</div>

<p
className="
mt-4
leading-8
text-violet-100
text-[17px]
"
>
{content}
</p>

{/* Buttons */}

<div className="flex flex-wrap gap-3 mt-5">

<div
className="
space-action-btn
"
>

{isCommentLiked ?

<AiFillLike

size={23}

className="cursor-pointer text-cyan-300"

onClick={()=>likeCommentMutate()}

/>

:

<AiOutlineLike

size={23}

className="cursor-pointer text-violet-200"

onClick={()=>likeCommentMutate()}

/>

}

<span>{commentLikesCount}</span>

</div>

<Button

size="xs"

className="space-comment-btn"

onClick={toggleReplyBox}

>

{isReplying ? 'Cancel Reply' : 'Reply'}

</Button>

<Button

size="xs"

className="space-comment-btn"

onClick={()=>setShowReplies(prev=>!prev)}

>

{showReplies ? 'Hide Replies' : 'View Replies'}

</Button>

{userData?._id===creatorId &&

<>

<Button

size="xs"

onClick={()=>setUpdateComment(comment)}

className="space-edit-btn"

>

Update

</Button>

<Button

size="xs"

onClick={()=>deleteMutate()}

className="space-delete-btn"

>

{isDeleting ? 'Deleting...' : 'Delete'}

</Button>

</>

}

</div>

{/* Reply Box */}

{isReplying &&

<form

onSubmit={handleSubmit(addReplyMutate)}

className="mt-6"

>

<div className="space-reply-box">

<Textarea

{...register('content')}

rows={2}

placeholder="Transmit your reply..."

className="bg-transparent text-white"

/>

<Button

type="submit"

disabled={isAddingReply}

className="mt-3 w-full bg-violet-600 hover:bg-violet-500"

>

{isAddingReply ?

'Sending...'

:

'Send Reply 🚀'}

</Button>

</div>

</form>

}

{/* Replies */}

{showReplies &&

<div className="reply-timeline mt-6">

{isLoadingReplies &&

<p className="text-violet-300">
Loading Replies...
</p>

}

{!isLoadingReplies &&
repliesData?.data?.replies?.length===0 &&

<div className="empty-replies">

✨

<p>No replies yet.</p>

</div>

}

{repliesData?.data?.replies?.map(reply=>

<Reply

key={reply._id}

reply={reply}

activePostId={activePostId}

commentId={id}

/>

)}

</div>

}

</div>

</div>

</div>

</>  )
}