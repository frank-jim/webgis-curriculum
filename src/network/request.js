import axios from 'axios'


// export function request(config,success,failure) {
//
//     console.log("HHHHHHHHHHHHHHHH")
//     //1.创建实例
//     const instance = axios.create({
//         baseURL:"http://httpbin.org",
//         timeout:5000
//     });
//     instance(config).then(res=>{
//         console.log(res);
//         success(res);
//     }).catch(res => {
//         failure(res)
//     });
// }

export function request(config) {
    // return new Promise(((resolve, reject) => {
    //     const instance = axios.create({
    //         baseURL:"http://httpbin.org",
    //         timeout:5000
    //     });
    //
    //     instance(config).then(res=>{
    //         resolve(res)
    //     }).catch(res=>{
    //         reject(res)
    //     });
    // }));
    //instance 本身也是一个实例，这里可以直接使用 返回promise
    const instance = axios.create({
        baseURL:"http://httpbin.org",
        timeout:5000
    });
    //2. Axios 拦截器
    //拦截 request 传入两个函数 ，请求成功，请求失败
    instance.interceptors.request.use(config=>{

        // config 一些信息，不符合服务器要求
        // 发生网络请求时，会界面会发送一些信息
        //网络请求，必须携带一些信息

        console.log(config);

        //必须要进行return
        return config;
    },error => {
        console.log(error);
    });

    //响应拦截,请求成功，产生response
    instance.interceptors.response.use(res=>{
        //这里会拦截掉 结果，然后必须进行返回一些数据
        console.log(res);
        return res.data;
    },error => {
        console.log(error);
    })
    return instance(config);
}