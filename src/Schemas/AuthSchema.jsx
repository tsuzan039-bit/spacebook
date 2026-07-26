

import {  z } from "zod";


















export const registrationSchema =z.object({

  name: z.string().min(5,"Min Chars Is 5").max(20,"Max Chars Is 20"),
    email:z.string().min(1,'Email is required').email("Email Is Not Valid"),
 password: z.string()
  .min(8, "Minimum 8 characters")
  .regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    "Password must contain: uppercase, lowercase, number, and special character (#?!@$%^&*-)"
  ),
rePassword: z.string().min(1,'re-password is required'),
    dateOfBirth:z.string().refine((value)=> new Date(value) < new Date (),'Date Is Not Valid'),
    gender:z.enum(["male","female"])

}).refine((value)=> value.rePassword === value.password, {
  message:'Password & RePassword not Matched',
  path:['rePassword']
})































export const loginSchema =z.object({

    email:z.string().min(1,'Email is required').email("Email Is Not Valid"),
 password: z.string()
  .min(8, "Minimum 8 characters")
  .regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    "Password must contain: uppercase, lowercase, number, and special character (#?!@$%^&*-)"
  ),
   

})