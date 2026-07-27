import { Button, Textarea } from 'flowbite-react'
import React, { useContext, useState } from 'react'
import { AuthContext } from './../Context/AuthContext';
import axios from 'axios'
import { headersObjData } from '../helpers/headersObj';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast'
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { Link } from 'react-router-dom';
import "./Comment.css";

const defultImg = 'https://png.pngtree.com/png-vector/20220818/ourmid/pngtree-cartoon-dead-fish-png-image_6113748.png'

function ActionLink({ children, onClick, active, danger, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        text-xs sm:text-[13px] font-semibold tracking-wide
        transition-colors duration-200
        disabled:opacity-50
        ${active ? 'text-cyan-300' : danger ? 'text-red-300 hover:text-red-200' : 'text-violet-300 hover:text-violet-100'}
      `}
    >
      {children}
    </button>
  )
}

function Dot() {
  return <span className="text-violet-500/40 text-xs select-none">•</span>
}

function Reply({ reply, activePostId, commentId, closeCommentsDrawer }) {
  const { userData } = useContext(AuthContext)
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(reply.content)

  const isOwner = userData?._id === reply.commentCreator?._id
  const replyCreatorId = reply.commentCreator?._id
  const replyCreatorName = reply.commentCreator?.name
  const replyCreatorPhoto = reply.commentCreator?.photo

  const { mutate: deleteReplyMutate, isPending: isDeletingReply } = useMutation({
    mutationFn: deleteReply,
    onSuccess: () => {
      queryClient.invalidateQueries(['replies', commentId]);
      queryClient.invalidateQueries(['totalCommentsCount', activePostId]);
      toast.success('reply deleted successfully')
    },
    onError: () => {
      toast.error('something went wrong')
    }
  })

  async function deleteReply() {
    const { data } = await axios.delete(
      `https://route-posts.routemisr.com/posts/${activePostId}/comments/${reply._id}`,
      headersObjData()
    )
    return data
  }

  const { mutate: updateReplyMutate, isPending: isUpdatingReply } = useMutation({
    mutationFn: updateReply,
    onSuccess: () => {
      queryClient.invalidateQueries(['replies', commentId]);
      toast.success('reply updated successfully')
      setIsEditing(false)
    },
    onError: () => {
      toast.error('something went wrong')
    }
  })

  async function updateReply() {
    const { data } = await axios.put(
      `https://route-posts.routemisr.com/posts/${activePostId}/comments/${reply._id}`,
      { content: editContent },
      headersObjData()
    )
    return data
  }

  return (
    <div
      className="
        relative flex gap-2 sm:gap-3 rounded-2xl p-2.5 sm:p-3 mt-3
        w-full min-w-0
        bg-gradient-to-br from-[#140b30]/90 via-[#1b103f]/90 to-[#090617]/90
        border border-violet-500/30
        backdrop-blur-xl
        shadow-[0_0_20px_rgba(139,92,246,.2)]
        overflow-hidden
      "
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,#8b5cf6,transparent_65%)] pointer-events-none"></div>

      <Link
        to={`/user/${replyCreatorId}`}
        state={{ userHint: { name: replyCreatorName, photo: replyCreatorPhoto } }}
        onClick={closeCommentsDrawer}
        className="relative z-20 shrink-0"
      >
        <img
          src={replyCreatorPhoto || defultImg}
          className="size-[32px] sm:size-[42px] rounded-full object-cover border-2 border-violet-500 shadow-[0_0_14px_#8b5cf6] cursor-pointer"
          alt=""
        />
      </Link>

      <div className="flex-1 min-w-0 relative z-10">

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to={`/user/${replyCreatorId}`}
            state={{ userHint: { name: replyCreatorName, photo: replyCreatorPhoto } }}
            onClick={closeCommentsDrawer}
            className="relative z-20"
          >
            <h3 className="font-semibold text-violet-100 text-sm sm:text-base truncate max-w-[55vw] sm:max-w-none hover:underline cursor-pointer">
              {replyCreatorName}
            </h3>
          </Link>
          <span className="text-[9px] sm:text-[10px] bg-violet-600/30 text-violet-200 px-2 rounded-full shrink-0">
            Crew
          </span>
        </div>

        {!isEditing && (
          <p className="text-violet-100 mt-1.5 leading-6 text-sm sm:text-[15px] break-words">
            {reply.content}
          </p>
        )}

        {isEditing && (
          <div className="mt-2 rounded-xl border border-violet-500/30 bg-[#140b30]/80 p-2 sm:p-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
              className="text-white bg-transparent w-full text-sm"
            />
            <div className="flex gap-2 mt-2">
              <Button
                size="xs"
                onClick={() => updateReplyMutate()}
                disabled={isUpdatingReply}
                className="bg-violet-600 hover:bg-violet-500 border-none"
              >
                {isUpdatingReply ? 'Saving...' : 'Save'}
              </Button>
              <Button
                size="xs"
                color="gray"
                onClick={() => {
                  setIsEditing(false)
                  setEditContent(reply.content)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isOwner && !isEditing && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <ActionLink onClick={() => setIsEditing(true)}>Edit</ActionLink>
            <Dot />
            <ActionLink danger onClick={() => deleteReplyMutate()} disabled={isDeletingReply}>
              {isDeletingReply ? 'Deleting...' : 'Delete'}
            </ActionLink>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Comment({ comment, setUpdateComment, activePostId, activeReplyCommentId, setActiveReplyCommentId, closeCommentsDrawer }) {

  if (!comment || !comment.commentCreator) return null;

  const { createdAt, _id: id, content, likes } = comment
  const { photo, _id: creatorId, name } = comment.commentCreator
  const { userData } = useContext(AuthContext)

  const queryClient = useQueryClient()

  const isCommentLiked = likes?.includes(userData?._id)
  const commentLikesCount = likes?.length ?? 0

  const isReplying = activeReplyCommentId === id

  const [showReplies, setShowReplies] = useState(false)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { content: '' }
  })

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', activePostId]);
      queryClient.invalidateQueries(['totalCommentsCount', activePostId]);
      queryClient.invalidateQueries(['commenters', activePostId]);
      toast.success('comment deleted successfully')
    },
    onError: () => {
      toast.error('something went wrong')
    }
  })

  async function deleteComment() {
    const { data } = await axios.delete(
      `https://route-posts.routemisr.com/posts/${activePostId}/comments/${id}`,
      headersObjData()
    )
    return data
  }

  const { mutate: likeCommentMutate } = useMutation({
    mutationFn: toggleCommentLike,
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', activePostId]);
    },
    onError: () => {
      toast.error('something went wrong')
    }
  })

  async function toggleCommentLike() {
    const { data } = await axios.put(
      `https://route-posts.routemisr.com/posts/${activePostId}/comments/${id}/like`,
      {},
      headersObjData()
    )
    return data
  }

  const { data: repliesData, isLoading: isLoadingReplies } = useQuery({
    queryFn: getReplies,
    queryKey: ['replies', id],
    enabled: showReplies
  })

  async function getReplies() {
    const { data } = await axios.get(
      `https://route-posts.routemisr.com/posts/${activePostId}/comments/${id}/replies`,
      headersObjData()
    )
    return data
  }

  const { mutate: addReplyMutate, isPending: isAddingReply } = useMutation({
    mutationFn: addReply,
    onSuccess: () => {
      queryClient.invalidateQueries(['replies', id]);
      queryClient.invalidateQueries(['totalCommentsCount', activePostId]);
      toast.success('reply added successfully')
      reset()
      setActiveReplyCommentId(null)
      setShowReplies(true)
    },
    onError: () => {
      toast.error('something went wrong')
    }
  })

  async function addReply(values) {
    const { data } = await axios.post(
      `https://route-posts.routemisr.com/posts/${activePostId}/comments/${id}/replies`,
      { content: values.content },
      headersObjData()
    )
    return data
  }

  function toggleReplyBox() {
    if (isReplying) {
      setActiveReplyCommentId(null)
    } else {
      setActiveReplyCommentId(id)
    }
  }

  const repliesCount = repliesData?.data?.replies?.length ?? null

  return (
    <div
      className="
        relative rounded-[22px] sm:rounded-[28px] my-4 sm:my-6
        p-3.5 sm:p-6
        w-full max-w-full
        overflow-hidden
        bg-gradient-to-br from-[#090b22] via-[#1b103f] to-[#05030d]
        border border-violet-500/30
        backdrop-blur-xl
        shadow-[0_0_35px_rgba(139,92,246,.22)]
        group
        transition-all duration-500
        hover:shadow-[0_0_60px_rgba(139,92,246,.4)]
      "
    >
      <div className="comment-nebula pointer-events-none"></div>
      <div className="comment-star star1 pointer-events-none"></div>
      <div className="comment-star star2 pointer-events-none"></div>
      <div className="comment-star star3 pointer-events-none"></div>

      <div className="relative z-10 flex gap-2.5 sm:gap-4 min-w-0">

        <Link
          to={`/user/${creatorId}`}
          state={{ userHint: { name, photo } }}
          onClick={closeCommentsDrawer}
          className="relative z-20 shrink-0"
        >
          <img
            src={photo || defultImg}
            alt=""
            className="
              w-10 h-10 sm:w-14 sm:h-14
              rounded-full object-cover
              border-2 border-violet-500
              shadow-[0_0_18px_#8b5cf6]
              transition duration-500
              group-hover:rotate-6
              cursor-pointer
            "
          />
        </Link>

        <div className="flex-1 min-w-0">

          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                to={`/user/${creatorId}`}
                state={{ userHint: { name, photo } }}
                onClick={closeCommentsDrawer}
                className="relative z-20"
              >
                <h3 className="text-sm sm:text-lg font-bold text-violet-100 tracking-wide truncate hover:underline cursor-pointer">
                  {name}
                </h3>
              </Link>
              <p className="text-[11px] sm:text-xs text-violet-300 mt-0.5">
                🪐 {createdAt ? createdAt.split('T')[0] : ''}
              </p>
            </div>

            <span className="hidden sm:inline-block shrink-0 text-[10px] bg-violet-600/25 text-violet-200 px-2 py-0.5 rounded-full">
              Galaxy User
            </span>
          </div>

          <p className="mt-2 sm:mt-3 leading-6 sm:leading-8 text-violet-100 text-sm sm:text-[16px] break-words">
            {content}
          </p>

          <div className="flex items-center gap-2 sm:gap-2.5 mt-3 flex-wrap">

            <button
              onClick={() => likeCommentMutate()}
              className="flex items-center gap-1 text-xs sm:text-[13px] font-semibold text-violet-300 hover:text-violet-100"
            >
              {isCommentLiked ? (
                <AiFillLike className="text-cyan-300" size={14} />
              ) : (
                <AiOutlineLike size={14} />
              )}
              <span>{commentLikesCount}</span>
            </button>

            <Dot />

            <ActionLink active={isReplying} onClick={toggleReplyBox}>
              {isReplying ? 'Cancel' : 'Reply'}
            </ActionLink>

            <Dot />

            <ActionLink active={showReplies} onClick={() => setShowReplies(!showReplies)}>
              {showReplies
                ? 'Hide replies'
                : repliesCount !== null
                  ? `${repliesCount} ${repliesCount === 1 ? 'Reply' : 'Replies'}`
                  : 'View replies'}
            </ActionLink>

            {userData?._id === creatorId && (
              <>
                <Dot />
                <ActionLink onClick={() => setUpdateComment(comment)}>Edit</ActionLink>
                <Dot />
                <ActionLink danger onClick={() => deleteMutate()} disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </ActionLink>
              </>
            )}
          </div>

          {isReplying && (
            <form onSubmit={handleSubmit(addReplyMutate)} className="mt-3 w-full min-w-0">
              <div className="rounded-xl border border-violet-500/30 bg-[#140b30]/70 p-2.5 sm:p-3 w-full">
                <div className="text-[11px] sm:text-xs text-violet-300 mb-2">
                  🚀 Reply to <span className="text-violet-100 font-semibold">{name}</span>
                </div>

                <Textarea
                  {...register("content")}
                  rows={3}
                  placeholder="Write your reply..."
                  className="w-full text-sm bg-[#0b0620]/70 text-violet-100 border-violet-500/30"
                />

                <div className="flex justify-end gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveReplyCommentId(null)
                      reset()
                    }}
                    className="text-xs sm:text-sm text-violet-300 hover:text-violet-100 px-2 py-1.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingReply}
                    className="text-xs sm:text-sm bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg"
                  >
                    {isAddingReply ? "Sending..." : "Send 🚀"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {showReplies && (
            <div className="mt-2 w-full min-w-0 pl-2 sm:pl-4 border-l-2 border-violet-500/20">

              {isLoadingReplies && (
                <p className="text-violet-300 text-xs sm:text-sm py-2">Loading replies...</p>
              )}

              {!isLoadingReplies && repliesData?.data?.replies?.length === 0 && (
                <div className="text-violet-300 text-xs sm:text-sm py-2 flex items-center gap-1.5">
                  <span>✨</span>
                  <p>No replies yet.</p>
                </div>
              )}

              {repliesData?.data?.replies?.map(reply =>
                <Reply
                  key={reply._id}
                  reply={reply}
                  activePostId={activePostId}
                  commentId={id}
                  closeCommentsDrawer={closeCommentsDrawer}
                />
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}