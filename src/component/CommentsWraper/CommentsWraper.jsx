import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useState } from "react";
import { headersObjData } from "../../helpers/headersObj";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import Comment from "../Comment";
import AddComment from "./AddComment/AddComment";
import "./CommentsWrapper.css";

export function CommentsWraper({isOpen, setIsOpen,handleClose,activePostId}) {

const {data,isFetched,isLoading}=useQuery({
    queryFn:getPostComments,
    queryKey:['comments',activePostId],
    enabled:Boolean(activePostId)
})

function handleUpdateComment(comment){
  setUpdateComment(comment)
  setActiveTab('add')
}
const [commentToBeUpdate, setUpdateComment] = useState()
const [activeReplyCommentId, setActiveReplyCommentId] = useState(null)

const [activeTab, setActiveTab] = useState('show')

async function getPostComments() {
    try{
        const {data}=await axios.get(`https://route-posts.routemisr.com/posts/${activePostId}/comments`,headersObjData())
        return data
    }catch (err){
        throw err;
    }
}

const commentsCount = data?.data?.comments?.length ?? 0

  return (
  <>
    <Drawer
      open={isOpen}
      onClose={handleClose}
      position="bottom"
      className="space-comments-drawer"
    >

      <div className="comments-bg comments-flex-layout">

        <div className="star star1"></div>
        <div className="star star2"></div>
        <div className="star star3"></div>
        <div className="planet"></div>

        <DrawerHeader
          title="💬 Space Comments"
          className="space-comments-header"
        />

        <div className="comments-tabs">
          <button
            className={`comments-tab-btn ${activeTab==='show' ? 'active' : ''}`}
            onClick={()=>setActiveTab('show')}
          >
            👁️ Show Comments {commentsCount > 0 && `(${commentsCount})`}
          </button>
          <button
            className={`comments-tab-btn ${activeTab==='add' ? 'active' : ''}`}
            onClick={()=>setActiveTab('add')}
          >
            ✍️ Add Comment
          </button>
        </div>

        <div className="comments-tab-content">

          {activeTab === 'show' &&
            <DrawerItems className="comments-scroll">

              {isLoading &&
                <Skeleton
                  width={"100%"}
                  height={80}
                  count={5}
                  baseColor="#21103b"
                  highlightColor="#412370"
                />
              }

              {isFetched &&
                data?.data?.comments?.length > 0 &&
                data.data.comments.map((comment)=>(
                  <Comment
                    key={comment._id ?? comment.id}
                    setUpdateComment={handleUpdateComment}   
                    comment={comment}
                    activePostId={activePostId}
                    activeReplyCommentId={activeReplyCommentId}
                    setActiveReplyCommentId={setActiveReplyCommentId}
                    closeCommentsDrawer={handleClose}
                  />
                ))
              }

              {isFetched &&
                data?.data?.comments?.length===0 &&

                <div className="empty-comments">
                  <div className="astronaut">
                    👨🏻‍🚀
                  </div>
                  <h2>No transmissions yet</h2>
                  <p>
                    Be the first explorer to leave a comment.
                  </p>
                  <button
                    className="empty-add-btn"
                    onClick={()=>setActiveTab('add')}
                  >
                    ✍️ Write the first comment
                  </button>
                </div>
              }

            </DrawerItems>
          }

          {activeTab === 'add' &&
            <div className="add-comment-tab w-full h-full">
              <AddComment
                setUpdateComment={setUpdateComment}
                commentToBeUpdate={commentToBeUpdate}
                activePostId={activePostId}
              />
            </div>
          }

        </div>

      </div>

    </Drawer>
  </>
)
}