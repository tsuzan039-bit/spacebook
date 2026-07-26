import React from 'react'
import { Alert } from "flowbite-react";

export default function AppAlert({color,content}) {








  return (
<>





  <Alert color={color}  className=' my-3  text-red-500  font-bold  ' >
{content}    </Alert>






</>  )
}
