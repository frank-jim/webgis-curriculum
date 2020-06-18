<template>
    <el-autocomplete v-model="inputContent" placeholder="请输入当前您要查询的内容" :fetch-suggestions="querySearch"
                     suffix-icon="el-icon-search" @select="handleSelect" @blur="clearCityMap" >

    </el-autocomplete>
</template>

<script>
    import {post} from "../../network/post";
    import axios from "axios"

    export default {
        name: "SearchBar",
        data(){
            return{
                inputContent:"",
                state: '',
                timeout:  null,
                searchResult:[],
            }
        },
        methods:{
            /**
             * 响应查询函数，（自动完成时的响应函数，也就是输入信息后，进行数据查找
             * @param queryString 输入框内的查询字符串
             * @param callback 响应函数 这是时实际上返回的数据
             */
            querySearch(queryString, callback){
                //querystring 是得到的查询字符串
                //对字符串进行判断,如果为空就直接返回空
                if(queryString.trim()===""||queryString.trim===null)
                    return callback([]);
                else {
                    //注释掉的内容实际上是在模拟网络请求
                    // clearTimeout(this.timeout);
                    // this.timeout = setTimeout(() => {
                    //     callback([]);
                    // }, 3000 * Math.random());
                    post({
                        url:"./SearchServlet",
                        data:{
                            name:queryString
                        },
                        params:{
                            //暂时就将数据放在这里
                            //TODO 有时间，解决一下，后端获取payload数据，或者获取form-data内的表单数据
                            name:queryString
                        }
                    }).then((res)=>{
                        if(res.data.status===200){
                            let geojson = JSON.parse(res.data.data.geojson);
                            this.getArrayFromGeoJson(geojson);
                            this.$parent.$parent.$refs["mapview"].createFeatureByGeoJson(res.data.data.geojson);
                            return callback(this.searchResult);
                            //TODO 这里实际上需要修改的，耦合太严重，但是如果不耦合就无法完成实时更新
                        }else {
                            return callback([]);
                        }
                    });

                }
            },
            /***
             *  从Json字符串里获得对象
             * @param geojson
             */
            getArrayFromGeoJson(geojson){
                this.searchResult = [];
                for(let feature of geojson.features){
                    this.searchResult.push({
                        id:feature.properties.id,
                        //demo里已经说明 ，这里展示的数据只能是 value
                        value:feature.properties.name
                    });
                }
            },
            /**
             * 处理点击事件， 进行详情查询
             * @param item 包含 value ：name id：fid
             */
            handleSelect(item){
                this.$emit("SearchInfo",item);
            },
            clearCityMap(){
                if(!this.$store.state.showInfo&&this.inputContent===""){
                    console.log("清除当前内容");
                    this.$EventBus.$emit("clearCityFeature")
                }
            }
        }
    }
</script>

<style scoped>
    .el-autocomplete{
        width: 350px;
        height: 30px;
    }
</style>