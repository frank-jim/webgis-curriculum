<template>
    <div id="map">
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
                maxZoom:15,
                minZoom:4,
                vectorSource:null,
                vectorLayer:null
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

                let selected = null;
                this.map.on('pointermove', (e)=>{
                    if (selected !== null) {

                        selected.setStyle(createLabelStyle(selected));
                        selected = null;
                        //要素被样式被修改过
                        this.map.getTargetElement().style.cursor="auto"
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
                //动画，变位更联系
                // this.mapView.setCenter(coord);
                // this.mapView.setZoom(6);
                this.mapView.animate({ // 只设置需要的属性即可
                    center: coord, // 中心点
                    zoom: 6, // 缩放级别
                    rotation: undefined, // 缩放完成view视图旋转弧度
                    duration: 1000 // 缩放持续时间，默认不需要设置
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
</style>