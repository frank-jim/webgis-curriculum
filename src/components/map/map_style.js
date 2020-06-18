import {Fill,Stroke,Icon,Style,Text,Circle as CircleStyle} from "ol/style";
import locate2 from "../../assets/image/locate2.png"
import res2_4m from '../../assets/image/res2_4m.png'
import highlight from '../../assets/image/locate_highlight.png'
import startPoint from '../../assets/image/startPoint.png'
import endPoint from  "../../assets/image/endPoint.png"
import routeMarker from  "../../assets/image/routeMarker.png"
import car  from "../../assets/image/car.png"

//------------------------     Openlayers  style部分  --------------------------------------------------------------//


//矢量样式
let fill = new Fill({
    color: 'rgba(255,141,155,0.6)'
});

let stroke = new Stroke({
    color: '#3399CC',
    width: 1.25
});

let iconStyle =new Icon(({
    scale:0.05,
    src: res2_4m
}));
let locateStyle = new Icon({
    anchor:[0.5,1],// 用图标的哪一点放到定位点上
    // anchorOrigin:"top-right",// 锚点的起算位置
    // anchorXUnits:"fraction",//锚点的x，y单位， fraction表示百分比
    scale:0.15,
    src:locate2
})
const styleVector = new Style({
    stroke: stroke,
    fill: fill,
    // image:new ol.style.Circle({
    //     radius: 2,
    //     fill:new ol.style.Fill({
    //         color: 'rgb(255,0,0)'
    //         })
    //     }),
    image:locateStyle
});

const routeStyle = new Style({
    stroke:new Stroke({
        color:"#209cec",
        width:3
    })
})

let highlightStyle = new Style({
    fill: new Fill({
        color: 'rgba(255,255,255,0.7)'
    }),
    stroke: new Stroke({
        color: '#3399CC',
        width: 3
    }),
    image:new Icon({
        anchor:[0.5,1],// 用图标的哪一点放到定位点上
        // anchorOrigin:"top-right",// 锚点的起算位置
        // anchorXUnits:"fraction",//锚点的x，y单位， fraction表示百分比
        scale:0.15,
        src:highlight
    })
});
function createLabelStyle(feature){
    return new Style({
        image: locateStyle,
        text: new Text({
            textAlign: 'middle',            //位置
            textBaseline: 'hanging',         //基准线
            font: 'normal 14px 微软雅黑',    //文字样式
            offsetY:4,
            text: feature.get('name'),      //文本内容
            fill: new Fill({       //文本填充样式（即文字颜色)
                color: '#000'
            })
        })
    });
}

const baseMapStyle = new Style({
    fill:new Fill({
        color:"#ffbe76"
    }),
    stroke:new Stroke({
        color:"#f0932b",
        width:2
    })
})

const StartFeatureStyle = new Style({
    fill: new Fill({
        color: 'rgba(255,255,255,0.7)'
    }),
    stroke: new Stroke({
        color: '#3399CC',
        width: 3
    }),
    image:new Icon({
        anchor:[0.5,1],// 用图标的哪一点放到定位点上
        // anchorOrigin:"top-right",// 锚点的起算位置
        // anchorXUnits:"fraction",//锚点的x，y单位， fraction表示百分比
        scale:0.3,
        src:startPoint
    })
})

const EndFeatureStyle = new Style({
    fill: new Fill({
        color: 'rgba(255,255,255,0.7)'
    }),
    stroke: new Stroke({
        color: '#3399CC',
        width: 3
    }),
    image:new Icon({
        anchor:[0.5,1],// 用图标的哪一点放到定位点上
        // anchorOrigin:"top-right",// 锚点的起算位置
        // anchorXUnits:"fraction",//锚点的x，y单位， fraction表示百分比
        scale:0.3,
        src:endPoint
    })
})

function getProWeStyle(feature,res) {

    //setStyle 以及style 初始化的时候都可以使用 函数式渲染
    let weight = feature.get("weight");
    let color = weight > 15 ? '#bd0026' :
        weight > 10 ? '#f03b20' :
            weight > 6 ? '#fd8d3c' :
                weight > 3 ? '#fecc5c' : '#ffffb2';
        return [ new Style({
            stroke:new Stroke({
                color:"#000000"
            }),
            fill:new Fill({
                color:color
            })
        })]
}

function getVirusWeStyle(feature,res) {
    //密度从11.4 ~ 1.1 ~ 0.2 ~0.02
    //setStyle 以及style 初始化的时候都可以使用 函数式渲染
    let population = feature.get("population");
    let confirm = feature.get("confirm")
    let weight = confirm/population
    let color = weight > 2 ? '#fa1c05' :
        weight > 1 ? '#fb2b15' :
            weight > 0.2 ? '#fb3a26' :
                weight > 0.1 ? '#fc5847' :
                    weight > 0.08 ? '#fd8679' :
                weight > 0.06 ? '#fda49b' : '#fed1cd';
    return [ new Style({
        stroke:new Stroke({
            color:"#000000"
        }),
        fill:new Fill({
            color:color
        })
    })]
}

const  routeMarkerStyle = new Style({
    image:new Icon({
        anchor:[0.5,0.5],// 用图标的哪一点放到定位点上
        // anchorOrigin:"top-right",// 锚点的起算位置
        // anchorXUnits:"fraction",//锚点的x，y单位， fraction表示百分比
        scale:0.15,
        src:car
    })
    // image: new CircleStyle({
    //     radius: 7,
    //     fill: new Fill({color: 'black'}),
    //     stroke: new Stroke({
    //         color: 'white', width: 2
    //     })
    // })
})

export {createLabelStyle,routeMarkerStyle,styleVector,highlightStyle,routeStyle,StartFeatureStyle,EndFeatureStyle,getProWeStyle,baseMapStyle,getVirusWeStyle}