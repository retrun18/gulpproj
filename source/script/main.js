let center = ol.proj.transform([110.06667, 14.66667], 'EPSG:4326', 'EPSG:3857');
function initmap(){   view = new ol.View({
        center: center,
        zoom: 4,
        minZoom: 3,
        maxZoom: 20,
	projection:new ol.proj.Projection({code:"3857",units:"m"})
    });
googleLayer = new ol.layer.Tile({
        source: new ol.source.TileImage({
            url: 'http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G',
		projection:"epsg:3857"
        }) //加载谷歌影像地图
    });
// //创建地图
var map = new ol.Map({
    logo: false, //不显示openlayers的logo
    //添加图层
    layers: [googleLayer],
	renderer:"webgl",
	target: 'mapcontent',
    //添加视图
    view: view
})
	map.on('click', showInfo);

let info = document.getElementById('info');
function showInfo(event) {
  let features = map.getFeaturesAtPixel(event.pixel);
  if (features.length == 0) {
    info.innerText = '';
    info.style.opacity = 0;
    return;
  }
  var mes = features[0].getProperties();
  info.innerText =mes.name+ "\n累计确诊:"+mes.confirmedCount+
"\n当前确诊:"+mes.currentConfirmedCount+"\n治愈人数:"+mes.curedCount+
"\n死亡人数:"+mes.deadCount+(mes.suspectedCount==0?"":"\n疑似病例:"+mes.suspectedCount);
  info.style.opacity = .7;
}

let areasurl='./script/100000_full.json';
let yqurl2="https://tianqiapi.com/api?version=epidemic&appid=22747463&appsecret=6uKNYwJa"
	fetch(areasurl,/*{method:'get',mode:'cors',headers:{'Content-Type':"application/x-www-form-urlencoded"}}*/).then(res=>{
		return res.json();
	})
		.then(function(json) {
		//console.log(json)
        getyiqing().then((yqjson) => {
            console.log(yqjson)
	    alert("全国累计确诊:"+yqjson.data.diagnosed
	    +";\n疑似病例:"+yqjson.data.suspect+";\n死亡人数:"
	    +yqjson.data.death+";\n治愈人数:"+yqjson.data.cured
	    +";\n重症病例:"+yqjson.data.serious+";");
            //console.log(json)
            let meslist = yqjson.data.area;
            for (let key in json.features) {
                let pro = json.features[key];
                item = meslist.find((mes) => {
                    return parseInt(mes.locationId) === parseInt(pro.properties.adcode);
                }) || {};
                pro.properties.confirmedCount = item.confirmedCount || 0;
                pro.properties.curedCount = item.curedCount || 0;
                pro.properties.deadCount = item.deadCount || 0;
            	pro.properties.currentConfirmedCount=item.currentConfirmedCount ||0;
		pro.properties.suspectedCount=item.suspectedCount||0;
	    }
            let vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(json, {
                    featureProjection: 'EPSG:3857'
                })
            }); 
            let style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 100, 100, 0.6)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#319FD3',
                    width: 1
                }),
                text: new ol.style.Text({
                    font: '12px Calibri,sans-serif',
                    fill: new ol.style.Fill({
                        color: '#000'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            let vectorLayer = new ol.layer.Vector({
                source: vectorSource,
		    maxZoom:9,
                style: function(feature) {
                    style.getText().setText(feature.get('name'));
                    let fillcolor = 'rgba(255,255,255,0.6)';
                    let level = 0;
                    let confirmed = parseInt(feature.get('confirmedCount'));
                    if (confirmed > 9)
                        level++;
                    if (confirmed > 99)
                        level++;
                    if (confirmed > 499)
                        level++;
                    if (confirmed > 999)
                        level++;
                    if (confirmed > 5999)
                        level++;
                    style.getFill().setColor('rgba(255,' + (255 - level * 50) + ',0,0.6)');
                    return style;
                }
            });
            map.addLayer(vectorLayer);
        });
 
    })

let yqurl="https://tianqiapi.com/api?version=epidemic&appid=22747463&appsecret=6uKNYwJa"
let yqurl1="https://interface.sina.cn/news/wap/fymap2020_data.d.json"
function getyiqing(){
	return fetch(yqurl,{mode:"cors"}).then(function(res){
return res.json();
}).catch(err=>console.log(err));
}
}




