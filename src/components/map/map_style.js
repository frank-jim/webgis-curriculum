import {Fill,Stroke,Icon,Style,Text} from "ol/style";
import locate2 from "../../assets/image/locate2.png"
import res2_4m from '../../assets/image/res2_4m.png'
import highlight from '../../assets/image/locate_highlight.png'
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

export {createLabelStyle,styleVector,highlightStyle}