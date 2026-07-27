import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import usePost from '../../customHooks/usePost';
import Postcard from '../../component/PostCard/Postcard';
import PostCardSkeleton from '../../component/PostCard/PostCardSkeleton/PostCardSkeleton';
import AddPost from '../../component/AddPost/AddPost';
import { CommentsWraper } from '../../component/CommentsWraper/CommentsWraper';
import { useState } from 'react';
import FollowSuggestions from './../../component/FollowSuggestions/FollowSuggestions';

export default function Post() {
const [isOpen, setIsOpen] = useState(false);
const [activePostId, setActivePostId] = useState(false);
const [postToBeUpdate, setPostToBeUpdate] = useState(null);

  const handleClose = () => setIsOpen(false);

const {data,isLoading,isFetched,isError,isFetching}=usePost(['allPosts'],true,'posts?limit=50&sort=-createdAt')

  return (
    <>
      <title>home</title>

      <div className="relative min-h-screen bg-cover bg-center bg-fixed"
       style={{
    backgroundImage: "url('/ChatGPT Image Jul 7, 2026, 06_44_00 PM.png')",
  }}
  
  >
        <div className="absolute inset-0  backdrop-blur-[0.25px] pointer-events-none"></div>

        <div className="max-w-xl mx-auto px-3">






          {/* Add / Update Post */}
          <div className="mb-4  rounded-xl shadow-sm p-3">
            <AddPost 
              postToBeUpdate={postToBeUpdate}
              setPostToBeUpdate={setPostToBeUpdate}
            />
          </div>
<div className="mb-4">
  <FollowSuggestions/>
</div>
          {/* Loading */}
          {isLoading && (
            <div className="space-y-3 ">
              {[1,2,3].map((i) => (
                <div className=" rounded-xl shadow-sm p-3" key={i}>
                  <PostCardSkeleton/>
                </div>
              ))}
            </div>
          )}

          {/* Posts */}
          {isFetched && (
            <div className="space-y-4">
              {data?.posts?.map((post) => (
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
      <CommentsWraper isOpen={isOpen} setIsOpen={setIsOpen} handleClose={handleClose} activePostId={activePostId}/>
    </>
  )
}