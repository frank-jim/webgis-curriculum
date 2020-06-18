<template>
    <div id="map">
        <div id="popup" class="ol-popup">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content">
                <code>
                    {{ctrPoint}}
                </code>
            </div>
        </div>
        <heatslider/>
        <route-plan-control />
        <ProWeMapControl/>
        <VirusMapControl  v-if="this.$store.state.VirusInfoShow"
                          :confirm="confirm" :heal="heal" :new-confirm="newConfirm" :dead="dead"
                         :infection-rate="confirm/population"
                          :adcode99="virusProadcode99" :pro-name="virusPorName"/>
    </div>
</template>


<script>
    import {Map,View,Feature} from "ol"
    import {Tile,Image,Vector as VectorLayer,Heatmap as HeatmapLayer} from "ol/layer"
    import {OSM,ImageWMS,Vector as VectorSource} from "ol/source"
    import * as control from "ol/control"
    import 'ol/ol.css'
    import
    { baseMapStyle,
        highlightStyle,styleVector,routeMarkerStyle,createLabelStyle,routeStyle,StartFeatureStyle,EndFeatureStyle,getProWeStyle,getVirusWeStyle}
    from
            "./map_style"
    import {Point,LineString} from "ol/geom"
    import { GeoJSON } from 'ol/format'
    import  Overlay  from 'ol/Overlay'

    import geojson1 from "@/assets/data/GeoJSON_HB.json"
    import {FullScreen,ZoomSlider,ZoomToExtent} from "ol/control"
    import Heatslider from "./heatslider";
    import {post} from "../../network/post";
    import RoutePlanControl from "./RoutePlanControl";
    import {getVectorContext} from "ol/render";
    import ProWeMapControl from "./ProWeMapControl";
    import OverviewMap from "ol/control/OverviewMap";
    import {transformExtent,transform,Projection} from "ol/proj"
    import VirusMapControl from "./VirusMapControl";

    export default {
        name: "mapView",
        components: {VirusMapControl, ProWeMapControl, RoutePlanControl, Heatslider},
        data(){
            return{
                format:'image/png',
                map:null,
                bounds : [73.44696044921875, 3.408477306365967,
                    135.08583068847656, 53.557926177978516],

                mapView:null,
                pro:null,
                maxZoom:16,
                minZoom:3,
                //底图数据
                osmLayer:null,
                chinaBase:null,
                vectorSource:null,
                vectorLayer:null,
                handPoint : false,
                ctrPress:false,
                ctrPoint:null,
                overlay:null,
                //空间分析图层
                heatmaplayer:null,
                heatsource:null,
                //路径导航图层:
                routeLayer:null,
                routeSource:null,
                StartFeature:null,
                EndFeature:null,
                routeFeature:null,
                now:null,
                routeAnimating:false,
                routeCoords:null,
                routeMarker:null,
                num:0,
                //路径取点
                getStartPoint:false,
                getEndPoint:false,
                //省域权重图层
                ProWeLayer:null,
                ProWeSource:null,
                //疫情地图:
                virusMapLayer:null,
                virusMapSource:null,
                getVirusInfo:false,
                newConfirm:0,
                confirm:0,
                dead:0,
                heal:0,
                population:1,
                virusProadcode99:0,
                virusPorName:"",
                floatfeature:null

            }
        },
        created() {

        },
        mounted() {
            //页面构建完成
            this.initMap();

            //监听服务总线发送的事件 , 添加热力图
            this.$EventBus.$on("addHeatMap",()=>{
                console.log("MapView收到事件");
                console.log(this.heatmaplayer);
                console.log(this.map);
                this.map.addLayer(this.heatmaplayer)
            });
            this.$EventBus.$on("removeHeatMap",()=>{
                console.log("MapView收到事件");

                this.map.removeLayer(this.heatmaplayer);
            });


            //----------------- Begin Province Weight Map--------------//
            this.$EventBus.$on("openProWeMap",()=>{
                this.map.addLayer(this.ProWeLayer);
            })
            this.$EventBus.$on("CloseProWeMap",()=>{
                this.map.removeLayer(this.ProWeLayer);
            })

            //-----------------------start route ---------------------/
            this.$EventBus.$on("routeQuery",(routeArray)=>{

                // console.log(routeArray);

                //这个路径做出来 坐标点是反的，从终点到起点,
                //坐标点不一定相等，因为城市点和道路点不一样

                //bug 这里 要素的坐标点数据 是投影数据，但是实际上传递过来的数据是经纬度数据
                if(!this.isCoordNear(this.projectTransform(routeArray[0]),this.StartFeature.getGeometry().getCoordinates())
                &&
                    !this.isCoordNear(this.projectTransform(routeArray[routeArray.length-1]),this.EndFeature.getGeometry().getCoordinates())){
                    let length = routeArray.length;
                    for(let i=0;i<length/2;i++){
                        let temp = routeArray[i];
                        routeArray[i] = routeArray[length-i-1];
                        routeArray[length-i-1] = temp;
                    }
                }
                this.routeCoords = routeArray;
                for(let i=0;i<routeArray.length;i++){
                    this.routeCoords[i] = this.projectTransform(routeArray[i]);
                }
                this.routeMarker.setGeometry(new Point( this.routeCoords[0]));
                this.routeFeature.setGeometry(new LineString(this.routeCoords));
                console.log(this.map);
            });
            this.$EventBus.$on("setStartCoords",Coords=>{
                this.JumpToLocal(Coords);
                console.log("StartCoords:"+ Coords);
                this.StartFeature.setGeometry(new Point(this.projectTransform(Coords)))
            })
            this.$EventBus.$on("setEndCoords",Coords=>{
                this.JumpToLocal(Coords);
                this.EndFeature.setGeometry(new Point(this.projectTransform(Coords)))
            })
            this.$EventBus.$on("getRoutePoint",type=>{
                if(type==="start"){
                    this.getStartPoint = true;
                }else if(type==="end"){
                    this.getEndPoint = true;
                }
            })
            this.$EventBus.$on("clearRouteLayer",()=>{

                //不要全部清除，只是清除坐标数据
                this.StartFeature.setGeometry(null);
                this.EndFeature.setGeometry(null);
                this.routeFeature.setGeometry(null);
                this.routeMarker.setGeometry(null);
            })
            this.$EventBus.$on("BeginRouteAnimation",()=>{
                //开始展示动画
                console.log("开始展示动画");

                this.routeMarker.setStyle(routeMarkerStyle);
                this.StartRouteAnimating();
            })
            //-----------------------end route ---------------------//

            //----------------------virus map ------------------------//
            this.$EventBus.$on("CreateVirusMap",geojson=>{
                this.virusMapSource.addFeatures((new GeoJSON()).readFeatures(geojson,{
                    dataProjection:"EPSG:4326",
                    featureProjection:"EPSG:3857"
                }));
                this.getVirusInfo = true;
                this.map.addLayer(this.virusMapLayer);
            })
            this.$EventBus.$on("OpenVirusMap",geojson=>{
                console.log("OpenMap");
                this.getVirusInfo = true;
                this.map.addLayer(this.virusMapLayer);
            })
            this.$EventBus.$on("CloseVirusMap",geojson=>{
                this.getVirusInfo = false;
                this.map.removeLayer(this.virusMapLayer);
            })

            //-------------------- begin map control ---------------------//
            this.$EventBus.$on("clearCityFeature",()=>{
                this.vectorSource.clear(true);
            })

        },
        methods:{
            initMap(){
                //生命周期函数，当整体被创建的时候就执行该函数
                /**
                 * 1.展示地图1,，原始地图，
                 * 2.展示地图2 OSM 底图
                 * 3.展示要素地图 geojson
                 * TODO 要将坐标系转化为web 墨卡托投影坐标系，否则看起来有很大的变形
                 */
                //----------------------------基础地图展示部分------------------------------//
                //构建投影
                this.pro = new Projection({
                    //经纬度坐标系
                    // code:'EPSG:4326',
                    // units:'degrees',
                    //投影坐标系
                    code:"EPSG:3857",
                    units:"m",
                    axisOrientation:'neu'
                    // global:true 这里如果要选择全局的话，必须在投影里设置切片，也就是slice参数
                })
                //构建视图
                this.mapView = new View({
                    projection:this.pro
                })
                //  1。构建OSM底图图层
                this.osmLayer = new Tile({
                    //瓦片地图OSM底图
                    source:new OSM(),
                });
                this.chinaBase = new Image({
                    //地图源
                    source:new ImageWMS({
                        ratio:1,
                        url: this.$store.state.GeoServer_url+'/stars/wms',
                        //参数
                        params: {
                            'FORMAT': this.format,
                            'VERSION': '1.1.1',
                            "LAYERS": 'stars:bou2_4p',
                            "exceptions": 'application/vnd.ogc.se_inimage'
                        }
                    }),
                    opacity:0.5,
                });
                //初始化矢量数据源
                this.vectorSource = new VectorSource({});
                this.vectorLayer = new VectorLayer({
                    name:"retrieveLayer",
                    source: this.vectorSource,
                    style: styleVector,
                });
                this.vectorSource.addFeatures((new GeoJSON()).readFeatures(geojson1,{
                    //可以设置投影方式！！！
                    dataProjection:"EPSG:4326",
                    featureProjection:"EPSG:3857"
                }));
                this.map = new Map({
                    controls: control.defaults({
                    }).extend([
                        new FullScreen(),
                        new ZoomSlider(),
                        new ZoomToExtent()
                    ]),
                    target:'map',
                    layers: [
                        this.osmLayer,
                        this.chinaBase,
                        this.vectorLayer
                    ],
                    view:this.mapView
                });
                //投影坐标转换
                let proExtend = transformExtent(this.bounds, "EPSG:4326", "EPSG:3857");
                this.map.getView().fit(proExtend,this.map.getSize());

                //经纬度坐标系
                // this.map.getView().fit(this.bounds,this.map.getSize());

                this.mapView.setMaxZoom(this.maxZoom);
                this.mapView.setMinZoom(this.minZoom);

                //
                this.HighLightFeature();
                this.createheatMap();
                this.createRouteMap();
                this.createProWeMap();

                this.createOverViewMap();
                this.createVirusLayer();

            },
            createOverViewMap(){

                this.map.addControl(new OverviewMap({
                    layers:[
                        new Tile({
                            //瓦片地图OSM底图
                            source:new OSM(),
                        }),
                        new Image({
                            //地图源
                            source:new ImageWMS({
                                ratio:1,
                                url: this.$store.state.GeoServer_url+'/stars/wms',
                                //参数
                                params: {
                                    'FORMAT': this.format,
                                    'VERSION': '1.1.1',
                                    "LAYERS": 'stars:bou2_4p',
                                    "exceptions": 'application/vnd.ogc.se_inimage'
                                }
                            }),
                            opacity:0.5
                        })
                    ],
                    view:new View({
                        projection: this.pro
                    })
                }))
            },
            createFeatureByGeoJson(geojson) {
                //清除矢量内容
                this.vectorSource.clear(true);
                //渲染搜索结果
                let features = JSON.parse(geojson).features;
                for(let i=0;i<features.length;i++){
                    //这里通过函数更新表单，产生结果数据
                    let coordinate = features[i].geometry.coordinates;//坐标数据
                    let name = features[i].properties.name;
                    //坐标投影变换
                    let proCoords = this.projectTransform(coordinate);

                    let newFeature = new Feature({
                        geometry: new Point(proCoords),  //几何信息
                        name: name,
                        fid:features[i].properties.id
                    });
                    newFeature.setStyle(createLabelStyle(newFeature));      //设置要素样式
                    this.vectorSource.addFeature(newFeature);
                }
                // setTimeout(()=>{
                //     this.vectorSource.addFeatures((new GeoJSON()).readFeatures(JSON.parse(geojson)));
                //     console.log("ERROR")
                // },1000);
            },
            HighLightFeature(){
                /***
                 * 高亮显示模块，实际上就是替换一种style 响应 pointmove 事件，进行要素遍历
                 * @type {null}
                 */

                this.getPoint();
                let selected = null;
                let lastVirusFeature = null;
                this.map.on('pointermove', (e)=>{
                    if (selected !== null) {

                        selected.setStyle(createLabelStyle(selected));
                        selected = null;
                        //要素被样式被修改过
                        this.map.getTargetElement().style.cursor="auto"
                    }
                    if(this.floatfeature!==null){
                        this.floatfeature.setStyle(getVirusWeStyle);
                    }
//---------------------------展示坐标信息 ----------------------------------//
                    if(this.ctrPress&&this.handPoint){
                        let pixel = this.map.getEventPixel(e.originalEvent);
                        let coord = this.map.getCoordinateFromPixel(pixel);
                        //经纬度坐标 展示
                        this.ctrPoint = transform(coord,"EPSG:3857","EPSG:4326");

                        this.overlay.setPosition(coord);
                    }
                    else {
                        this.overlay.setPosition(undefined);
                    }
                    this.map.forEachFeatureAtPixel(e.pixel, (f,layer)=>{
                        //只在地图查询的时候执行这个
                        if(layer.values_.name==="retrieveLayer")
                        {
                            if(f.style_!=null){
                                this.map.getTargetElement().style.cursor="pointer"
                                selected = f;
                                f.setStyle(highlightStyle);
                            }
                            else{
                                this.map.getTargetElement().style.cursor="auto"
                            }
                        }else if(layer.values_.name==="virusmap"){
                            if(f!==lastVirusFeature){
                                //疫情地图的查询
                                this.floatfeature = f;
                                f.setStyle(highlightStyle)
                                // lastVirusFeature = f;
                                return true;
                            }

                        }

                    });
                });

            },
            JumpToLocal(coord){
                //动画，变位更连贯
                // this.mapView.setCenter(coord);
                // this.mapView.setZoom(6);
                //ADDITION 添加坐标投影
                let proCoord = this.projectTransform(coord);
                this.mapView.animate({ // 只设置需要的属性即可
                    center: proCoord, // 中心点
                    zoom: 6, // 缩放级别
                    rotation: undefined, // 缩放完成view视图旋转弧度
                    duration: 1000 // 缩放持续时间，默认不需要设置
                })
            },
            getPoint(){
                //坐标显示层
                this.overlay = new Overlay({
                    element: document.getElementById("popup"),
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                this.map.addOverlay(this.overlay);
                //crosshair 光标十字线 开启地图取点功能
                document.onkeydown = (e)=> {
                    if(e.keyCode===17&&(this.handPoint||this.getStartPoint||this.getEndPoint)){
                        console.log("getPoint");
                        this.ctrPress = true;
                        this.map.getTargetElement().style.cursor="crosshair"
                    }
                }
                document.onkeyup = (e)=>{
                    this.map.getTargetElement().style.cursor="auto"
                    if(e.keyCode===17){
                        this.ctrPress = false;
                    }
                }
                this.map.on("singleclick",(e)=>{
                    //得到点击坐标，进行返回
                    console.log("singleclick");
                    if(this.ctrPress){
                        let pixel = this.map.getEventPixel(e.originalEvent);
                        let coord = this.map.getCoordinateFromPixel(pixel);

                        //coord 本身就行投影坐标，如果要定位的话，直接采用这个坐标即可
                        this.ctrPoint = transform(coord,"EPSG:3857","EPSG:4326");

                        console.log(this.ctrPoint);
                        if(this.handPoint){
                            this.$parent.$refs['search-view'].$refs['update'].HandleCoords(this.ctrPoint);
                            this.handPoint = false;
                        }
                        else if(this.getStartPoint){
                            this.$EventBus.$emit("returnRoutePoint",{
                                type:"start",
                                coords:this.ctrPoint
                            })
                            this.StartFeature.setGeometry(new Point(coord))
                            this.getStartPoint = false;
                        }
                        else if(this.getEndPoint){
                            this.$EventBus.$emit("returnRoutePoint",{
                                type:"end",
                                coords:this.ctrPoint
                            })
                            this.EndFeature.setGeometry(new Point(coord));
                            this.getEndPoint = false;
                        }
                    }
                    if(this.getVirusInfo){
                        console.log("AAAA")
                        console.log(this.floatfeature)
                        if(this.floatfeature!=null){
                            this.confirm = this.floatfeature.get("confirm")
                            this.heal = this.floatfeature.get("heal")
                            this.newConfirm = this.floatfeature.get("newConfirm")
                            this.dead = this.floatfeature.get("dead")
                            this.virusPorName = this.floatfeature.get("name")
                            this.virusProadcode99 = this.floatfeature.get("adcode99")
                            this.population = this.floatfeature.get("population")
                        }
                    }
                })
            },
            projectTransform(coords){
             let proCoords = transform(coords,"EPSG:4326","EPSG:3857");
             return proCoords;
            },
            createheatMap(){
                //初始化矢量数据源
                this.heatsource = new VectorSource({});
                // this.heatsource.addFeatures((new GeoJSON()).readFeatures(headmapsource));
                // this.heatmaplayer = new HeatmapLayer({
                //     source: this.heatsource,
                //     blur:10,
                //     radius:20,
                //     weight:function (feature) {
                //         console.log(feature)
                //         return 10
                //     }
                // });
                // this.map.addLayer(this.heatmaplayer);
                post({
                    url:"./DataQueryServlet",
                    params:{
                        QueryType:2
                    }
                }).then((res)=>{
                    let geojson = JSON.parse(res.data.data.geojson);
                    this.heatsource.addFeatures((new GeoJSON()).readFeatures(geojson,{
                        dataProjection:"EPSG:4326",
                        featureProjection:"EPSG:3857"
                    }));
                    this.heatmaplayer = new HeatmapLayer({
                        name:"heatmaplayer",
                        source: this.heatsource,
                        blur:10,
                        radius:20,
                        weight:(feature)=> {
                            let adclass = parseInt(feature.values_.cityclass);
                            return this.getCityWeight(adclass);
                        }
                    });
                })
            },
            createRouteMap(){
                this.routeSource = new VectorSource({});
                this.routeLayer = new VectorLayer({
                    source: this.routeSource,
                    // 可以添加标识的，在values里面就可以找到这个添加的标识_ layer.values_.name !!!!!!!!!!!!!!!!!!!
                    name:"routeLayer"
                });
                this.map.addLayer(this.routeLayer);

                //添加起点和终点
                this.StartFeature = new Feature({
                    // geometry: new Point(coordinate),  //几何信息
                    name: "StartPoint",
                });
                this.StartFeature.setStyle(StartFeatureStyle);

                this.EndFeature = new Feature({
                    // geometry: new Point(coordinate),  //几何信息
                    name: "EndPoint",
                });
                this.EndFeature.setStyle(EndFeatureStyle);

                this.routeFeature = new Feature({
                    name:"routeFeature"
                })
                this.routeFeature.setStyle(routeStyle)

                this.routeMarker = new Feature({
                });
                this.routeMarker.setStyle(routeMarkerStyle);

                this.routeSource.addFeature(this.routeMarker);

                this.routeSource.addFeature(this.routeFeature);
                this.routeSource.addFeature(this.StartFeature);
                this.routeSource.addFeature(this.EndFeature);

            },
            moveFeature(event) {
                let vectorContext = getVectorContext(event);
                let frameState = event.frameState;

                if (this.routeAnimating) {
                    let elapsedTime = frameState.time - this.now;
                    // here the trick to increase speed is to jump some indexes
                    // on lineString coordinates
                    let index = Math.round(200 * elapsedTime / 1000);

                    if (index >= this.routeCoords.length) {
                        this.EndRouteAnimating();
                        return;
                    }

                    //routeCoords要从路径点内取出来
                    let currentPoint = new Point(this.routeCoords[index]);
                    let feature = new Feature(currentPoint);
                    vectorContext.drawFeature(feature, routeMarkerStyle);
                }
                // tell OpenLayers to continue the postrender animation
                this.map.render();
            },
            StartRouteAnimating(){
                if (this.routeAnimating) {
                    this.EndRouteAnimating();
                } else {


                    this.routeAnimating = true;
                    this.now = new Date().getTime();
                    // hide geoMarker
                    this.routeMarker.setStyle(null);
                    this.routeLayer.on('postrender', this.moveFeature);
                    this.map.render();
                }
            },
            createVirusLayer(){
                this.virusMapSource = new VectorSource();
                this.virusMapLayer = new VectorLayer({
                    name:"virusmap",
                    style:getVirusWeStyle,
                    source:this.virusMapSource
                });

                // post({
                //     url:"./DataQueryServlet",
                //     params:{
                //         QueryType:4
                //     }
                // }).then(res=>{
                //     //专题图，就是不同要素设置不同的style
                //     let geojson = JSON.parse(res.data.data.geojson);
                //     this.ProWeSource.addFeatures((new GeoJSON()).readFeatures(geojson,{
                //         dataProjection:"EPSG:4326",
                //         featureProjection:"EPSG:3857"
                //     }));
                // })
            }
            ,
            EndRouteAnimating(){
                this.routeAnimating = false;

                // if animation cancelled clear the marker
                let geometry = this.routeMarker.getGeometry();
                geometry.setCoordinates(this.routeCoords[0]);
                //remove listener
                this.routeLayer.un('postrender', this.moveFeature);
            },
            // pro-- province we- weight
            createProWeMap(){
                this.ProWeSource = new VectorSource();
                this.ProWeLayer = new VectorLayer({
                    style:getProWeStyle,
                    source:this.ProWeSource

                });

                post({
                    url:"./DataQueryServlet",
                    params:{
                        QueryType:4
                    }
                }).then(res=>{
                    //专题图，就是不同要素设置不同的style
                    let geojson = JSON.parse(res.data.data.geojson);
                    this.ProWeSource.addFeatures((new GeoJSON()).readFeatures(geojson,{
                        dataProjection:"EPSG:4326",
                        featureProjection:"EPSG:3857"
                    }));
                })
            },
            getCityWeight(adclass){
                if(adclass===2){
                    return 6
                }else if(adclass===1){
                    return 10
                }else if(adclass===9){
                    return 8
                }else {
                    return 4
                }
            },
            isCoordNear(coord1,coord2){
                //这里转变为了实际投影坐标，经纬度相差0.02 需要各自转换
                //判断两点是否邻近
                console.log("coord1 :"+coord1);
                console.log("coord2 :"+coord2);
                let dx = Math.abs(coord1[0]-coord2[0]);
                let dy = Math.abs(coord1[1]-coord2[1]);
                console.log("dx :"+dx);
                console.log("dy :"+dy);

                return (dx<1800&&dy<2000);
            }
        }
    }
</script>

<style scoped>
    #map{
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 1;
    }
    .ol-popup {
        position: absolute;
        background-color: white;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
        min-width: 280px;
    }
</style>