import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaRocket, FaRegBookmark } from "react-icons/fa";
import usePost from '../../customHooks/usePost';
import Postcard from '../../component/PostCard/Postcard';
import PostCardSkeleton from '../../component/PostCard/PostCardSkeleton/PostCardSkeleton';
import { CommentsWraper } from '../../component/CommentsWraper/CommentsWraper';

export default function Bookmarks() {

  const {data,isLoading,isFetched} = usePost(
    ['allPostsForBookmarks'],
    true,
    'posts?limit=100'
  )

  const [isOpen, setIsOpen] = useState(false)
  const [activePostId, setActivePostId] = useState(null)
  const [postToBeUpdate, setPostToBeUpdate] = useState(null)

  function handleClose(){
    setIsOpen(false)
  }

  const bookmarkedPosts = data?.posts?.filter(post => Boolean(post.bookmarked))

  return (
    <>
      <title>Bookmarks</title>

      <div className="min-h-screen bg-gradient-to-b from-[#3a1a67] via-[#09061f] to-[#12052c] relative overflow-hidden">

        {/* Stars */}
        <div className="absolute inset-0 stars"></div>
        <div className="absolute inset-0 twinkling"></div>

        <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">

          {/* Header */}

          <motion.div
            initial={{opacity:0,y:-30}}
            animate={{opacity:1,y:0}}
            className="mb-8"
          >

            <div className="flex items-center gap-4">

              <motion.div
                animate={{
                  rotate:[0,10,-10,0],
                  y:[0,-6,0]
                }}
                transition={{
                  repeat:Infinity,
                  duration:3
                }}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-[0_0_35px_#8b5cf6]"
              >
                <FaRocket className="text-white text-3xl"/>
              </motion.div>

              <div>
                <h1 className="text-4xl font-bold text-white">
                  Saved Galaxy
                </h1>

                <p className="text-violet-300 mt-1">
                  Your favorite posts across the universe
                </p>
              </div>

            </div>

          </motion.div>

          {/* Loading */}

          {isLoading && (

            <div className="space-y-4">

              {[1,2,3].map((i)=>(
                <div
                  key={i}
                  className="rounded-3xl bg-[#12052c]/60 border border-violet-500/20 backdrop-blur-lg p-4"
                >
                  <PostCardSkeleton/>
                </div>
              ))}

            </div>

          )}

          {/* Empty */}

          {isFetched && bookmarkedPosts?.length===0 && (

            <motion.div

              initial={{opacity:0,scale:.8}}
              animate={{opacity:1,scale:1}}

              className="mt-20 flex flex-col items-center justify-center text-center"

            >

              <motion.div

                animate={{
                  y:[0,-18,0],
                  rotate:[0,6,-6,0]
                }}

                transition={{
                  repeat:Infinity,
                  duration:4
                }}

                className="relative"

              >

                <div className="absolute inset-0 rounded-full blur-3xl bg-violet-500/40"></div>

                <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-[0_0_80px_#7c3aed]">

                  <FaRegBookmark className="text-white text-6xl"/>

                </div>

              </motion.div>

              <h2 className="text-white text-3xl font-bold mt-10">

                Your Space Library is Empty

              </h2>

              <p className="text-violet-300 mt-4 max-w-md leading-7">

                Bookmark amazing posts and they'll appear here like stars
                waiting inside your personal galaxy.

              </p>

            </motion.div>

          )}

          {/* Posts */}

          {isFetched && bookmarkedPosts?.length>0 && (

            <div className="space-y-6">

              {bookmarkedPosts.map((post)=>(

                <motion.div

                  key={post._id}

                  initial={{opacity:0,y:40}}
                  whileInView={{opacity:1,y:0}}
                  viewport={{once:true}}
                  transition={{duration:.5}}

                  className="relative"

                >

                  <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 blur-xl opacity-30"></div>

                  <div className="relative rounded-[28px] bg-[#0f0820]/80 border border-violet-500/20 backdrop-blur-xl p-3">

                    <Postcard
                      post={post}
                      setIsOpen={setIsOpen}
                      setActivePostId={setActivePostId}
                      setPostToBeUpdate={setPostToBeUpdate}
                    />

                  </div>

                </motion.div>

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