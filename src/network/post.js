 import axios from "axios"

 export  function  post(config) {
    //发送post 请求
     const instance = axios.create({
         timeout:200000,
         //发送请求的默认端口，之后可以进行修改,
         method:"post",
         headers:{
           "Content-Type":"application/json; charset=UTF-8"
         },
         withCredentials:true,
         baseURL:"http://localhost:5858/WebGIS_Practicum_war_exploded"
     });

     return instance(config);
 }
 export function weather(config) {
    const instance = axios.create({
        timeout:10000,
        method:"get",
        headers:{
            "Content-Type":"application/json; charset=UTF-8"
        },
        baseURL:"http://wthrcdn.etouch.cn"
    })
     return instance(config);
 }