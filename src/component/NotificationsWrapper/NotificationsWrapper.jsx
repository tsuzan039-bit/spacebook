// import { Dropdown, DropdownHeader, DropdownItem, DropdownDivider, Button } from "flowbite-react";
// import React, { useEffect, useRef } from 'react'
// import { FaBell } from "react-icons/fa";
// import axios from 'axios'
// import { headersObjData } from '../../helpers/headersObj';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';

// function getNotificationText(notif){
//   const actorName = notif.actor?.name ?? 'Someone'
//   switch(notif.type){
//     case 'like_post': return `${actorName} liked your post`
//     case 'like_comment': return `${actorName} liked your comment`
//     case 'comment_post': return `${actorName} commented on your post`
//     case 'reply_comment': return `${actorName} replied to your comment`
//     case 'share_post': return `${actorName} shared your post`
//     case 'bookmark_post': return `${actorName} bookmarked your post`
//     case 'follow_user': return `${actorName} started following you`
//     default: return `${actorName} interacted with your content`
//   }
// }

// export default function NotificationsWrapper() {

//   const queryClient = useQueryClient()
//   const navigate = useNavigate()
//   const previousCountRef = useRef(null)

//   const {data:unreadData} = useQuery({
//     queryFn: getUnreadCount,
//     queryKey:['unreadCount'],
//     refetchInterval: 15000
//   })

//   async function getUnreadCount(){
//     try{
//       const {data} = await axios.get(
//         `https://route-posts.routemisr.com/notifications/unread-count`,
//         headersObjData()
//       )
//       return data
//     }catch(err){
//       throw err
//     }
//   }

//   const unreadCount = unreadData?.data?.count ?? 0

//   useEffect(() => {
//     if(previousCountRef.current !== null && unreadCount > previousCountRef.current){
//       toast('🔔 You have a new notification', {icon: '🔔'})
//       queryClient.invalidateQueries(['notifications'])
//     }
//     previousCountRef.current = unreadCount
//   }, [unreadCount])

//   const {data:notificationsData,isLoading} = useQuery({
//     queryFn: getNotifications,
//     queryKey:['notifications'],
//     refetchInterval: 15000
//   })

//   async function getNotifications(){
//     try{
//       const {data} = await axios.get(
//         `https://route-posts.routemisr.com/notifications?page=1&limit=20`,
//         headersObjData()
//       )
//       return data
//     }catch(err){
//       throw err
//     }
//   }

//   // ✅ نفلتر الإشعارات "الميتة" اللي المحتوى بتاعها اتمسح (entity فاضية)
//   const rawNotifications = notificationsData?.data?.notifications ?? []
//   const validNotifications = rawNotifications.filter(n => n.entity != null)

//   const {mutate:markOneRead} = useMutation({
//     mutationFn: markAsRead,
//     onSuccess:()=>{
//       queryClient.invalidateQueries(['notifications'])
//       queryClient.invalidateQueries(['unreadCount'])
//     }
//   })

//   async function markAsRead(notificationId){
//     try{
//       const {data} = await axios.patch(
//         `https://route-posts.routemisr.com/notifications/${notificationId}/read`,
//         {},
//         headersObjData()
//       )
//       return data
//     }catch(err){
//       throw err
//     }
//   }

//   const {mutate:markAllRead,isPending:isMarkingAll} = useMutation({
//     mutationFn: markAllAsRead,
//     onSuccess:()=>{
//       queryClient.invalidateQueries(['notifications'])
//       queryClient.invalidateQueries(['unreadCount'])
//     }
//   })

//   async function markAllAsRead(){
//     try{
//       const {data} = await axios.patch(
//         `https://route-posts.routemisr.com/notifications/read-all`,
//         {},
//         headersObjData()
//       )
//       return data
//     }catch(err){
//       throw err
//     }
//   }

//   function handleNotifClick(notif){
//     if(!notif.isRead){
//       markOneRead(notif._id)
//     }

//     if(notif.entityType === 'post' && notif.entityId){
//       navigate(`/details/${notif.entityId}`)
//     } else if(notif.entityType === 'user' && notif.entityId){
//       navigate(`/user/${notif.entityId}`)
//     }
//   }

//   return (
//     <Dropdown
//       arrowIcon={false}
//       inline
//       label={
//         <div className='relative'>
//           <FaBell size={22} className={`text-gray-600 ${unreadCount > 0 ? 'animate-pulse' : ''}`}/>
//           {unreadCount > 0 &&
//             <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full size-[18px] flex items-center justify-center'>
//               {unreadCount > 9 ? '9+' : unreadCount}
//             </span>
//           }
//         </div>
//       }
//     >
//       <DropdownHeader>
//         <div className='flex items-center justify-between'>
//           <span className='font-semibold'>Notifications</span>
//           <Button size='xs' onClick={()=>markAllRead()} disabled={isMarkingAll}>
//             {isMarkingAll ? '...' : 'mark all read'}
//           </Button>
//         </div>
//       </DropdownHeader>

//       <div className='max-h-80 overflow-y-auto w-72'>
//         {isLoading && <p className='p-3 text-sm text-center'>loading...</p>}

//         {!isLoading && validNotifications.length === 0 &&
//           <p className='p-3 text-sm text-center'>no notifications</p>
//         }

//         {validNotifications.map((notif)=>(
//           <div key={notif._id}>
//             <DropdownItem 
//               onClick={()=>handleNotifClick(notif)}
//               className={!notif.isRead ? 'bg-blue-50 font-medium' : ''}
//             >
//               <div className='flex items-center gap-2'>
//                 {notif.actor?.photo && 
//                   <img src={notif.actor.photo} className='size-[30px] rounded-full object-cover' alt=""/>
//                 }
//                 <span className='text-sm'>{getNotificationText(notif)}</span>
//               </div>
//             </DropdownItem>
//             <DropdownDivider/>
//           </div>
//         ))}
//       </div>
//     </Dropdown>

//   )
// }


















import { Dropdown, DropdownHeader, DropdownItem, DropdownDivider, Button } from "flowbite-react";
import React, { useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import axios from "axios";
import { headersObjData } from "../../helpers/headersObj";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function getNotificationText(notif) {
  const actorName = notif.actor?.name ?? "Someone";

  switch (notif.type) {
    case "like_post":
      return `${actorName} liked your post`;

    case "like_comment":
      return `${actorName} liked your comment`;

    case "comment_post":
      return `${actorName} commented on your post`;

    case "reply_comment":
      return `${actorName} replied to your comment`;

    case "share_post":
      return `${actorName} shared your post`;

    case "bookmark_post":
      return `${actorName} bookmarked your post`;

    case "follow_user":
      return `${actorName} started following you`;

    default:
      return `${actorName} interacted with your content`;
  }
}

export default function NotificationsWrapper() {

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const previousCountRef = useRef(null);

  const { data: unreadData } = useQuery({
    queryFn: getUnreadCount,
    queryKey: ["unreadCount"],
    refetchInterval: 15000
  });

  async function getUnreadCount() {
    try {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/notifications/unread-count`,
        headersObjData()
      );
      return data;
    } catch (err) {
      throw err;
    }
  }

  const unreadCount = unreadData?.data?.count ?? 0;

  useEffect(() => {
    if (
      previousCountRef.current !== null &&
      unreadCount > previousCountRef.current
    ) {
      toast("🚀 New transmission received!", {
        icon: "🛰️"
      });

      queryClient.invalidateQueries(["notifications"]);
    }

    previousCountRef.current = unreadCount;
  }, [unreadCount]);

  const { data: notificationsData, isLoading } = useQuery({
    queryFn: getNotifications,
    queryKey: ["notifications"],
    refetchInterval: 15000
  });

  async function getNotifications() {
    try {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/notifications?page=1&limit=20`,
        headersObjData()
      );

      return data;
    } catch (err) {
      throw err;
    }
  }

  const rawNotifications =
    notificationsData?.data?.notifications ?? [];

  const validNotifications = rawNotifications.filter(
    (n) => n.entity != null
  );

  const { mutate: markOneRead } = useMutation({
    mutationFn: markAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["unreadCount"]);
    }
  });

  async function markAsRead(notificationId) {
    try {
      const { data } = await axios.patch(
        `https://route-posts.routemisr.com/notifications/${notificationId}/read`,
        {},
        headersObjData()
      );

      return data;
    } catch (err) {
      throw err;
    }
  }

  const {
    mutate: markAllRead,
    isPending: isMarkingAll
  } = useMutation({
    mutationFn: markAllAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["unreadCount"]);
    }
  });

  async function markAllAsRead() {
    try {
      const { data } = await axios.patch(
        `https://route-posts.routemisr.com/notifications/read-all`,
        {},
        headersObjData()
      );

      return data;
    } catch (err) {
      throw err;
    }
  }

  function handleNotifClick(notif) {

    if (!notif.isRead) {
      markOneRead(notif._id);
    }

    if (notif.entityType === "post" && notif.entityId) {
      navigate(`/details/${notif.entityId}`);
    }

    else if (notif.entityType === "user" && notif.entityId) {
      navigate(`/user/${notif.entityId}`);
    }
  }

return (
  <Dropdown
    arrowIcon={false}
    inline
    className="!bg-[#0b0618]/95 backdrop-blur-xl border border-cyan-500/30 rounded-3xl shadow-[0_0_40px_rgba(34,211,238,.25)]"
    label={
      <div className="relative group cursor-pointer">

        <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl group-hover:scale-125 transition duration-500"></div>

        <div className="relative flex items-center justify-center w-11 h-11 rounded-full border border-cyan-400/40 bg-[#120726]/70 backdrop-blur-xl hover:border-cyan-300 hover:shadow-[0_0_25px_#38bdf8] transition-all">

          <FaBell
            size={20}
            className={`text-cyan-300 ${
              unreadCount > 0 ? "animate-bounce" : ""
            }`}
          />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] font-bold flex items-center justify-center border border-white animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>

      </div>
    }
  >

    <DropdownHeader className="border-b border-cyan-500/20">

      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-cyan-300 font-bold text-base">
            🚀 Notifications
          </h3>

          <p className="text-xs text-violet-300">
            Interstellar Activity
          </p>

        </div>

        <Button
          size="xs"
          onClick={() => markAllRead()}
          disabled={isMarkingAll}
          className="!bg-gradient-to-r !from-cyan-500 !to-violet-600 rounded-full hover:scale-105 transition"
        >
          {isMarkingAll ? "..." : "Mark all"}
        </Button>

      </div>

    </DropdownHeader>

<div className="max-h-[420px] w-[320px] overflow-y-auto overflow-x-hidden custom-scroll">
      {isLoading && (

        <div className="py-10 flex flex-col items-center">

          <div className="text-5xl animate-spin">
            🛰️
          </div>

          <p className="text-cyan-300 mt-4 animate-pulse">
            Scanning Galaxy...
          </p>

        </div>

      )}

      {!isLoading && validNotifications.length === 0 && (

        <div className="py-10 flex flex-col items-center">

          <div className="text-6xl animate-bounce">
            🌌
          </div>

          <p className="mt-4 text-cyan-300 font-semibold">
            No transmissions detected
          </p>

          <p className="text-xs text-violet-300 mt-2">
            Your galaxy is peaceful.
          </p>

        </div>

      )}

      {validNotifications.map((notif) => (

        <div key={notif._id}>

          <DropdownItem
            onClick={() => handleNotifClick(notif)}
            className={`
              rounded-xl
              mx-2
              my-2
              transition-all
              ${
                !notif.isRead
                  ? "!bg-cyan-500/10 border border-cyan-500/20"
                  : "hover:!bg-violet-500/10"
              }
            `}
          >

            <div className="flex items-center gap-3">

              <img
                src={
                  notif.actor?.photo ||
                  "https://i.pravatar.cc/100"
                }
                className="w-11 h-11 rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_18px_#38bdf8]"
                alt=""
              />

              <div className="flex-1">

                <p className="text-white text-sm leading-5">
                  {getNotificationText(notif)}
                </p>

                <p className="text-cyan-300 text-xs mt-1">
                  {notif.createdAt?.split("T")[0]}
                </p>

              </div>

              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              )}

            </div>

          </DropdownItem>

          <DropdownDivider className="border-violet-500/20" />

        </div>

      ))}

    </div>

  </Dropdown>
);
}