<template>
    <div id="main">

    </div>
</template>

<script>
    import echarts from "echarts"
    import {post} from "../../network/post";

    export default {
        name: "CityGroupChart",
        data() {
            return {
                option: {
                    title: {
                        text: '城市分类查询'
                    },
                    tooltip: {},
                    legend: {
                        data: ['销量']
                    },
                    series: [{
                        type: 'pie',
                    }],
                    queryResult:null,
                },
                echarts:null,
                //指定数据源 以及绘制的类型
                series: [{
                    //图表基本类型
                    type:"bar",
                    //数据源
                }],
                dataset:null
            }
        },
        methods:{
            initChart(){
                this.echarts = echarts.init(document.getElementById("main"));
                this.echarts.setOption(this.option)
            },
            getCityType(adclass){
                    if(adclass===2){
                        return "省会"
                    }else if(adclass===1){
                        return "首都"
                    }else if(adclass===9){
                        return "特别行政区"
                    }else {
                        return "城市"
                    }
            }
        },
        mounted() {
            this.initChart();
            //请求城市数据
            post({
                url:"./DataQueryServlet",
                params:{
                    QueryType:"1"
                }
            }).then((res)=>{
                let resultstr = res.data.data.result;
                console.log(resultstr)
                console.log(JSON.parse(resultstr));
                this.queryResult = JSON.parse(resultstr);
                let xaxis = {
                    data:["首都","省会","城市","特别行政区"],
                    type :"category"
                }
                let source = [];

                for( let item of this.queryResult){
                    source.push({
                        name:this.getCityType(item.adclass),
                        value:item.citycount
                    })
                }
                this.dataset = {
                    source:source
                }
                this.echarts.setOption({
                    dataset:this.dataset
                })
            })


        }
    }
</script>

<style scoped>
    #main{
        width: 400px;
        height: 500px;
        margin-top: 50px;
    }
</style>