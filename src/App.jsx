import React from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Layout from './component/Layout/Layout'
import Post from './pages/Post/Post'
import Profile from './pages/Profile/Profile'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import AuthGuard from './Guards/AuthGuard'
import PostsGuards from './PostsGuards/PostsGuards'
import AuthContextProvider from './Context/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PostDetails from './pages/PostDetails/PostDetails'
import { Toaster } from 'react-hot-toast'
import Bookmarks from './pages/Bookmarks/Bookmarks'
import Settings from './pages/Settings/Settings'
import UserProfile from './pages/UserProfile/UserProfile';
import ErrorPage from './pages/ErrorPage/ErrorPage'

const routes = createBrowserRouter([
{path:"/",element:<Layout/>,children:[

{index:true,element:<PostsGuards><Post/></PostsGuards>},
{path:"profile",element:<PostsGuards><Profile/></PostsGuards>},
{path:"details/:id",element:<PostsGuards><PostDetails/></PostsGuards>},
{path:"login",element:   <AuthGuard><Login/></AuthGuard>},
{path:"*",element:<ErrorPage/>},
{path:"register",element:<AuthGuard><Register/></AuthGuard>},
{path:"bookmarks",element:<PostsGuards><Bookmarks/></PostsGuards>},
{path:"settings",element:<PostsGuards><Settings/></PostsGuards>},
{path:"user/:userId",element:<PostsGuards><UserProfile/></PostsGuards>},

]}

])

const queryClient = new QueryClient()


export default function App() {



 return <>
 
  <QueryClientProvider client={queryClient} >

<AuthContextProvider>

<RouterProvider router={routes} />
  <Toaster/>

  </AuthContextProvider>

  </QueryClientProvider>
 
 </>
 
 
}