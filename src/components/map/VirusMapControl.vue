<template>
    <div>
    <el-collapse-transition >
        <el-container >
            <el-header>今日疫情: {{ProName}}</el-header>
            <el-main>
                <el-row type="flex" align="middle">
                    <el-col :span="8" style="color: red">
                        省份累计确诊
                    </el-col>
                    <el-col :span="4" style="color: red">
                        {{confirm}}
                    </el-col>
                    <el-col :span="6" style="color: #ff4d51" :offset="2">
                        当日确诊
                    </el-col>
                    <el-col :span="4" style="color: #ff4d51">
                        {{newConfirm}}
                    </el-col>
                </el-row >
                <el-divider><i class="el-icon-s-check"></i></el-divider>
                <el-row type="flex" align="middle">
                    <el-col :span="8" style="color: #6c6565">
                        死亡病例
                    </el-col>
                    <el-col :span="4" style="color: #6c6565">
                        {{dead}}
                    </el-col>
                    <el-col :span="6" style="color: #37fa65" :offset="2">
                        治愈人数
                    </el-col>
                    <el-col :span="4" style="color: #37fa65">
                        {{heal}}
                    </el-col>
                </el-row>
                <el-divider><i class="el-icon-s-check"></i></el-divider>
                <el-row type="flex" align="middle" style="color: orangered">
                    <el-col :span="8" :offset="4">
                        万人感染率
                    </el-col>
                    <el-col :span="8">
                        {{infectionRate.toFixed(4)}}
                    </el-col>
                </el-row>
            </el-main>
            <el-footer>
                <el-col :span="8" :offset="2">
                    <el-button type="text" style="color: springgreen;font-size: 12pt;font-family: 幼圆"
                               @click="closeVirusMap" >
                        关闭图层
                    </el-button>

                </el-col>
                <el-col :span="8" :offset="2">
                    <el-button type="text" style="color: #48d4ff;font-size: 12pt;font-family: 幼圆"
                               @click="OpenHistoryData" > {{ChartButtonContent}}
                    </el-button>
                </el-col>
            </el-footer>
        </el-container>
    </el-collapse-transition>
        <transition name="el-zoom-in-top"  >
                <div  v-if="IsChartShow"  id="ChatData" class="history" ></div>
        </transition>
    </div>
</template>

<script>
    import echarts from "echarts"
    import {post} from "../../network/post";
    import {Loading} from "element-ui";

    export default {
        name: "VirusMapControl",
        props:{
            ProName:{
                type:String,
                default:""
            },
            newConfirm:{
                type:Number,
                default: 0
            },
            confirm:{
                type:Number,
                default: 0
            },
            dead:{
                type:Number,
                default: 0
            },
            heal:{
                type:Number,
                default: 0
            },
            infectionRate:{
                type:Number,
                default: 0
            },
            adcode99:{
                type:Number,
                default: 0
            },
        },
        data(){
            return{
                Option:{
                    tooltip : {},
                    legend:{},
                    xAxis:[
                        { type:'time', gridIndex:0,name:"日期"},
                        { type:'time', gridIndex:1,name:"日期"}
                        ],
                    dataZoom: [
                        {
                            type: 'slider',
                            xAxisIndex: 0,
                            start: 0,
                            end: 100,
                            bottom:1
                        },
                        {
                            type: 'slider',
                            yAxisIndex: 0,
                            start: 0,
                            end: 100,
                        },
                        {
                            type: 'slider',
                            xAxisIndex: 1,
                            start: 0,
                            end: 100,
                            bottom:1
                        },
                        {
                            type: 'slider',
                            yAxisIndex: 1,
                            start: 0,
                            end: 100,
                            left:10
                        }
                    ],
                    grid: [
                        {left: '55%'},
                        {right: '55%'}
                    ],
                    yAxis:[
                        {type: 'value',gridIndex: 0,name:"人数"},
                        {type: 'value',gridIndex: 1,name:"人数"}
                    ],
                    series:[]
                },
                dataset:{
                    source:null,
                    dimensions:[
                        {
                            name:"id",
                            type:'int',
                        },
                        {
                            name:"date",
                            type:'time',
                        },
                        {
                            name:"confirm",
                            type:'int',
                        },
                        {
                            name:"dead",
                            type:'int',
                        },
                        {
                            name:"heal",
                            type:'int',
                        },
                        {
                            name:"newconfirm",
                            type:'int',
                        },
                        {
                            name:"newheal",
                            type:'int',
                        },
                        {
                            name:"newdead",
                            type:'int',
                        }
                    ],
                },
                virusChart:null,
                IsChartShow:false
            }
        },
        computed:{
          ChartButtonContent(){
              if(this.IsChartShow){
                  return "关闭历史统计"
              }else {
                  return "打开历史数据"
              }
          }
        },
        methods: {
            closeVirusMap() {
                //清空所有数据
                console.log("click")
                this.$EventBus.$emit("CloseVirusMap");
                this.$store.commit("CloseVirusInfo");
            },
            OpenHistoryData() {
                if(this.adcode99===0){
                    return
                }
                if(this.IsChartShow){
                    this.IsChartShow = false;
                    return;
                }else {
                    this.IsChartShow = true

                    post({
                        url: "./DataQueryServlet",
                        params: {
                            QueryType: 6,
                            adcode99: this.adcode99
                        }
                    }).then((res) => {
                        this.initialChart();
                        let historyData = JSON.parse(res.data.data.historyData)
                        this.resolveData(historyData)
                    })
                }

            },
            initialChart(){
                this.virusChart = echarts.init(document.getElementById("ChatData"));
                this.virusChart.setOption(this.Option)
            },
            resolveData(historyData){
                this.dataset.source = historyData;
                let ConfirmSerie = {
                    name:"总计确诊人数",
                    smooth:true,
                    type:'line',
                    symbol:'circle',
                    showSymbol : false,
                    itemStyle: {
                        color:"#f31d1d"
                    },
                    emphasis: {
                        color: 'rgb(241,101,7)',
                        borderWidth: 18,
                        borderColor: 'rgba(239,130,73,0.42)'
                    },
                    encode: {
                        x: 'date',
                        y: 'confirm'
                    },
                    tooltip:{
                        triggers:'axis',
                        backgroundColor:'rgba(0,0,0,0.8)' ,
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#ff0000'
                            }
                        },
                        formatter(params) {
                            return params.seriesName+ " <br/>"+
                                params.marker+"日期:" +params.data.date+" <br/>"+
                                params.marker+"确诊人数:"+
                                params.data.confirm ;

                        }
                    },
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                };
                let newConfirmSerie = {
                    name:"当日确诊人数",
                    smooth:true,
                    type:'line',
                    symbol:'circle',
                    legend:{
                        type:'plain'
                    },
                    showSymbol : false,
                    itemStyle: {
                        color:"#ff4800"
                    },
                    emphasis: {
                        color: 'rgb(241,101,7)',
                        borderWidth: 18,
                        borderColor: 'rgba(239,130,73,0.42)'
                    },
                    encode: {
                        x: 'date',
                        y: 'newconfirm'
                    },
                    tooltip:{
                        triggers:'axis',
                        backgroundColor:'rgba(0,0,0,0.8)' ,
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#ff0000'
                            }
                        },
                        formatter(params) {
                            return params.seriesName+ " <br/>"+
                                params.marker+"日期:" +params.data.date+" <br/>"+
                                params.marker+"新确诊人数:"+
                                params.data.newconfirm ;

                        }
                    },
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                };
                let HealSerie = {
                    type:'bar',
                    legend:{
                        type:'plain'
                    },
                    encode: {
                        x: 'date',
                        y: 'heal',
                    },
                    tooltip:{
                        triggers:'axis',
                        backgroundColor:'rgba(0,0,0,0.8)' ,
                        axisPointer: {
                           type: 'cross',
                           label: {
                               backgroundColor: '#6a7985'
                           }
                       },
                        formatter(params) {
                            return params.seriesName+ " <br/>"+
                                params.marker+"日期:" +params.data.date+" <br/>"+
                                params.marker+"治愈人数:"+
                                params.data.heal ;

                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 300,
                            shadowColor: '#E9F01D',

                        },
                        color:"#2e80f3"
                    },
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    name:"总计治愈人数",
                };
                let newHealSerie = {
                    type:'bar',
                    legend:{
                        type:'plain'
                    },
                    encode: {
                        x: 'date',
                        y: 'newheal',
                    },
                    tooltip:{
                        triggers:'axis',
                        backgroundColor:'rgba(0,0,0,0.8)' ,
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        },
                        formatter(params) {
                            return params.seriesName+ " <br/>"+
                                params.marker+"日期:" +params.data.date+" <br/>"+
                                params.marker+"新治愈人数:"+
                                params.data.newheal ;

                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 300,
                            shadowColor: '#E9F01D',

                        },
                        color:"#09fd51"
                    },
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    name:"当日治愈人数",
                };
                this.virusChart.setOption({
                    dataset: this.dataset,
                    series: [ConfirmSerie,HealSerie,newConfirmSerie,newHealSerie,]
                });
            }
        }
    }
</script>

<style scoped>

    .el-container{
        margin-top: 40px;
        position: absolute;
        width: 360px;
        left: 5%;
        top: 15%;
        z-index: 8;
        padding: 10px;
        border-radius: 30px;

    }
    .el-header, .el-footer {
        background-color: #f57c7c;
        color: #333;
        text-align: center;
        width: 340px;
        font-size: 20px;
        line-height: 40px;
        /*  使用deep进行穿透样式设置  使用！important进行默认行内样式的配置 */
        height: 40px!important;
        border-radius: 5px;
    }
    .el-main {
        border-radius: 5px;
        background-color: #f6f6f6;
        color: #333;
        text-align: center;
        padding: 0px;
    }
    .el-row{
        margin: 20px;
    }
    .animation{
        position: absolute;
        width: 60%;
        height: 30%;
        left: 6%;
        top: 63%;
        z-index: 9;
        background: #d2d4d5;
        border-radius: 10px;
        opacity: 80%;
    }
    .history{
        position: absolute;
        width: 60%;
        height: 35%;
        left: 6%;
        top: 63%;
        z-index: 9;
        background: #d2d4d5;
        border-radius: 10px;
        opacity: 80%;
    }
</style>