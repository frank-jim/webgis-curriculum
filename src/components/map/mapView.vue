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
    </div>
</template>


<script>
    import {Map,View,Feature} from "ol"
    import {Tile,Image,Vector as VectorLayer} from "ol/layer"
    import {OSM,ImageWMS,Vector as VectorSource} from "ol/source"
    import {Projection} from "ol/proj"
    import * as control from "ol/control"
    import 'ol/ol.css'
    import {highlightStyle,styleVector,createLabelStyle} from "./map_style"
    import {Point} from "ol/geom"
    import { GeoJSON } from 'ol/format'
    import  Overlay  from 'ol/Overlay'

    import geojson1 from "@/assets/data/GeoJSON_HB.json"
    import {FullScreen,ZoomSlider,ZoomToExtent} from "ol/control"
    export default {
        name: "mapView",
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
                vectorSource:null,
                vectorLayer:null,
                handPoint : false,
                ctrPress:false,
                ctrPoint:null,
                overlay:null
            }
        },
        created() {

        },
        mounted() {
            //页面构建完成
            this.initMap();
        },
        methods:{
            initMap(){
                //生命周期函数，当整体被创建的时候就执行该函数
                /**
                 * 1.展示地图1,，原始地图，
                 * 2.展示地图2 OSM 底图
                 * 3.展示要素地图 geojson
                 */
                //----------------------------基础地图展示部分------------------------------//
                //构建投影
                this.pro = new Projection({
                    code:'EPSG:4326',
                    units:'degrees',
                    axisOrientation:'neu'
                    // global:true 这里如果要选择全局的话，必须在投影里设置切片，也就是slice参数
                })
                //构建视图
                this.mapView = new View({
                    projection:this.pro
                })
                //  1。构建OSM底图图层
                let osmLayer = new Tile({
                    //瓦片地图OSM底图
                    source:new OSM(),
                });
                let chinaBase = new Image({
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
                });
                //初始化矢量数据源
                this.vectorSource = new VectorSource({});
                this.vectorLayer = new VectorLayer({
                    source: this.vectorSource,
                    style: styleVector,
                });
                this.vectorSource.addFeatures((new GeoJSON()).readFeatures(geojson1));
                this.map = new Map({
                    controls: control.defaults({
                    }).extend([
                        new FullScreen(),
                        new ZoomSlider(),
                        new ZoomToExtent()
                    ]),
                    target:'map',
                    layers: [
                        osmLayer,
                        chinaBase,
                    ],
                    view:this.mapView
                });
                this.map.addLayer(this.vectorLayer);
                this.map.getView().fit(this.bounds,this.map.getSize());
                this.mapView.setMaxZoom(this.maxZoom);
                this.mapView.setMinZoom(this.minZoom);

                //
                this.HighLightFeature();
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
                    let newFeature = new Feature({
                        geometry: new Point(coordinate),  //几何信息
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
                this.map.on('pointermove', (e)=>{
                    if (selected !== null) {

                        selected.setStyle(createLabelStyle(selected));
                        selected = null;
                        //要素被样式被修改过
                        this.map.getTargetElement().style.cursor="auto"
                    }
//---------------------------展示坐标信息 ----------------------------------//
                    if(this.ctrPress&&this.handPoint){
                        let pixel = this.map.getEventPixel(e.originalEvent);
                        let coord = this.map.getCoordinateFromPixel(pixel);
                        this.ctrPoint = coord;
                        this.overlay.setPosition(coord);
                    }
                    else {
                        this.overlay.setPosition(undefined);
                    }
                    this.map.forEachFeatureAtPixel(e.pixel, (f)=>{
                        if(f.style_!=null){
                            this.map.getTargetElement().style.cursor="pointer"
                            selected = f;
                            f.setStyle(highlightStyle);
                            return true;
                        }
                        else{
                            this.map.getTargetElement().style.cursor="auto"
                        }
                    });
                });

            },
            JumpToLocal(coord){
                //动画，变位更连贯
                // this.mapView.setCenter(coord);
                // this.mapView.setZoom(6);
                this.mapView.animate({ // 只设置需要的属性即可
                    center: coord, // 中心点
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
                    if(e.keyCode===17&&this.handPoint){
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
                    if(this.ctrPress&&this.handPoint){
                        let pixel = this.map.getEventPixel(e.originalEvent);
                        let coord = this.map.getCoordinateFromPixel(pixel);
                        this.ctrPoint = coord;
                        //得到点击坐标，进行返回
                        this.$parent.$refs['search-view'].$refs['update'].HandleCoords(coord);
                        this.handPoint = false;
                        console.log(coord);
                    }
                })
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