import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Postcard from '../../component/PostCard/Postcard'
import PostCardSkeleton from '../../component/PostCard/PostCardSkeleton/PostCardSkeleton'
import usePost from './../../customHooks/usePost'
import { CommentsWraper } from '../../component/CommentsWraper/CommentsWraper'
import './PostDetails.css'

export default function PostDetails() {
const [isOpen, setIsOpen] = useState(false)
const [activePostId, setActivePostId] = useState(null)
const [postToBeUpdate, setPostToBeUpdate] = useState(null)

function handleClose(){
  setIsOpen(false)
}
  const { id } = useParams()

  const { data, isLoading, isFetched, isError } = usePost(
    ['details'],
    true,
    `posts/${id}`
  )

  return (
    <>
      <title>Post Details</title>

      <div className="space-details-page">

        {/* Stars */}
        <div className="space-star" style={{top:'8%',left:'10%'}}></div>
        <div className="space-star" style={{top:'18%',right:'15%'}}></div>
        <div className="space-star" style={{top:'65%',left:'20%'}}></div>
        <div className="space-star" style={{bottom:'15%',right:'10%'}}></div>

        <div className="space-details-container">

          <div className="space-details-title">
            <span>🪐</span>
            <h1>Post Details</h1>
          </div>

          {isLoading && (
            <div className="space-details-card">
              <PostCardSkeleton />
            </div>
          )}

          {isError && (
            <div className="space-empty-post">

              <div className="space-empty-icon">
                ☄️
              </div>

              <h2>This post disappeared</h2>

              <p>
                It may have been deleted by its owner
                or traveled to another galaxy.
              </p>

            </div>
          )}

          {isFetched && !isError && (
            <div className="space-details-card">
              <Postcard
                post={data?.post}
                setIsOpen={setIsOpen}
                setActivePostId={setActivePostId}
                setPostToBeUpdate={setPostToBeUpdate}
              />
            </div>
          )}

        </div>

      </div>

      {/* ✅ الدرج بتاع الكومنتات، كان ناقص خالص */}
      <CommentsWraper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleClose={handleClose}
        activePostId={activePostId}
      />
    </>
  )
}