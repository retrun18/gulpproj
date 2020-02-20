function initGlobe(){
 Cesium.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZDI3OGZjYi01Zjg4LTQ0ZmItYmIxMy0yY2U3YTk5ODIyOTQiLCJpZCI6MjI4MzYsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyJdLCJpYXQiOjE1ODIxNjU4MTd9.DFtJeoF6_hIsgohXY-zwGk0oFlau5fHQv-2d8gRDBSw"; 
	let guge=new Cesium.UrlTemplateImageryProvider({  
		//url:'http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}',
		url: 'http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G',
	 tilingScheme:new Cesium.WebMercatorTilingScheme(),            minimumLevel:1,                                               maximumLevel:20                                       });                                                                   let viewer=new Cesium.Viewer("cesiumContainer",{                      baseLayerPicker : false,                              imageryProvider : guge,                                               terrainProvider: Cesium.createWorldTerrain()          });     
	console.log("globe is ready to start!");
}
