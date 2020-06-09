 import axios from "axios"

 export  function  post(config) {
    //发送post 请求
     const instance = axios.create({
         timeout:10000,
         //发送请求的默认端口，之后可以进行修改,
         method:"post",
         headers:{
           "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
         },
         baseURL:"http://localhost:5858/WebGIS_Practicum_war_exploded"
     });

     return instance(config);
 }