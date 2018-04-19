var sock = new WebSocket("ws://localhost:5001");

var PATH="";
sock.onmessage = function(event){
	PATH=event.data;
	createDots();
	drawDots();
}

mapboxgl.accessToken = 'pk.eyJ1IjoibGluZ2h1YW0iLCJhIjoiY2o1dWYzYzlqMDQ4OTJxbzRiZWl5OHdtcyJ9._Ae66CF7CGUIoJlVdrXjqA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-71.6202,-33.0462],
    zoom: 13
});

var drawAreaPol;
var drawArea=null;
var saveArea=null;

function selectarea(){
	drawArea = new MapboxDraw({
	    displayControlsDefault: false,
	    controls: {
	        polygon: true,
	        trash: true
	    }
	});

	if (drawZones!=null) map.removeControl(drawZones);
	drawZones=null;
	if (drawPoint!=null) map.removeControl(drawPoint);
	drawPoint=null;
	if (drawZonesr!=null) map.removeControl(drawZonesr);
	drawZonesr=null;
	map.addControl(drawArea);
	document.getElementById("area").disabled=true;
	document.getElementById("zones").disabled=false;
	document.getElementById("point").disabled=false;
	document.getElementById("zonesr").disabled=false;
	drawAreaPol=document.getElementsByClassName('mapbox-gl-draw_polygon')[0];
}

function savearea(){
	map.removeControl(drawArea);
	drawArea=null;
	document.getElementById("area").disabled=false;
}

var drawZones=null;
var saveZones=null;

function selectzones(){
	drawZones = new MapboxDraw({
		displayControlsDefault: false,
		controls:{
			polygon: true,
			trash: true
		}
	});
	if (drawArea!=null) map.removeControl(drawArea);
	drawArea=null;
	if (drawPoint!=null) map.removeControl(drawPoint);
	drawPoint=null;
	if (drawZonesr!=null) map.removeControl(drawZonesr);
	drawZonesr=null;
	map.addControl(drawZones);
	document.getElementById("zones").disabled=true;
	document.getElementById("area").disabled=false;
	document.getElementById("point").disabled=false;
	document.getElementById("zonesr").disabled=false;
}

function savezones(){
	map.removeControl(drawZones);
	drawZones=null;
	document.getElementById("zones").disabled=false;
}

var drawPointP;
var drawPoint=null;
var savePoint=null;

function selectpoint(){
	drawPoint = new MapboxDraw({
		displayControlsDefault: false,
		controls: {
			point: true,
			trash: true
		}
	});

	if (drawArea!=null) map.removeControl(drawArea);
	drawArea=null;
	if (drawZones!=null) map.removeControl(drawZones);
	drawZones=null;
	if (drawZonesr!=null) map.removeControl(drawZonesr);
	drawZonesr=null;
	map.addControl(drawPoint);
	document.getElementById("point").disabled=true;
	document.getElementById("area").disabled=false;
	document.getElementById("zones").disbled=false;
	document.getElementById("zonesr").disabled=false;
	drawPointP=document.getElementsByClassName('mapbox-gl-draw_point')[0];
}

function savepoint(){
	map.removeControl(drawPoint);
	drawPoint=null;
	document.getElementById("point").disabled=false;
}

var drawZonesr=null;
var saveZonesr=null;

function selectzonesr(){
	drawZonesr = new MapboxDraw({
		displayControlsDefault: false,
		controls:{
			polygon: true,
			trash: true
		}
	});
	if (drawArea!=null) map.removeControl(drawArea);
	drawArea=null;
	if (drawPoint!=null) map.removeControl(drawPoint);
	drawPoint=null;
	if (drawZones!=null) map.removeControl(drawZones);
	drawZones=null;
	map.addControl(drawZonesr);
	document.getElementById("zonesr").disabled=true;
	document.getElementById("zones").disabled=false;
	document.getElementById("area").disabled=false;
	document.getElementById("point").disabled=false;
}

function savezones(){
	map.removeControl(drawZonesr);
	drawZonesr=null;
	document.getElementById("zonesr").disabled=false;
}

map.on('draw.create', updateArea);
map.on('draw.delete', updateArea);
function updateArea(e){
	if (drawArea!=null){
		if(drawArea.getAll().features.length>0){
			drawAreaPol.style.display='none'
			document.getElementById("savearea").disabled=false;
			$('#areacode').val(JSON.stringify(drawArea.getAll().features));
			$('#areacode').trigger('autoresize');
		}
		else{
			drawAreaPol.style.display='block';
			document.getElementById("savearea").disabled=true;
			$('#areacode').val("");
			$('#areacode').trigger('autoresize');
		}
	}
	else if (drawZones!=null){
		if (drawZones.getAll().features.length>0){
			document.getElementById("savezones").disabled=false;
			$('#zonescode').val(JSON.stringify(drawZones.getAll().features));
			$('#zonescode').trigger('autoresize');
		}
		else{
			$('#zonescode').val("");
			$('#zonescode').trigger('autoresize');
		}	
	}
	else if (drawPoint!=null){
		if (drawPoint.getAll().features.length>0){
			drawPointP.style.display='none';
			document.getElementById("savepoint").disabled=false;
			$('#pointcode').val(JSON.stringify(drawPoint.getAll().features));
			$('#pointcode').trigger('autoresize');
		}
		else{
			drawPointP.style.display='block';
			document.getElementById("savepoint").disabled=true;
			$('#pointcode').val("");
			$('#pointcode').trigger('autoresize')
		}
	}
	else if (drawZonesr!=null){
		if (drawZonesr.getAll().features.length>0){
			document.getElementById("savezonesr").disabled=false;
			$('#zonesrcode').val(JSON.stringify(drawZonesr.getAll().features));
			$('#zonesrcode').trigger('autoresize')
		}
		else{
			$('#zonesrcode').val("");
			$('#zonesrcode').trigger('autoresize')
		}
	}
}


var geoJson = {
  type: 'FeatureCollection',
  features: []
};



var dot =  function(){
	return {
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: [0,0]
		}
	};
};

var dots=[];
var stepsCont=4;
var interval;

function createDots(){
	var file =PATH+"/step_3.txt";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onload = function ()
    {
        var response = rawFile.responseText.split("\n").map(function(item){
        	var array=item.split(" ");
        	if (array.length!=1){
        		var newDot = new dot();
        		newDot.geometry.coordinates=[parseFloat(array[2]), parseFloat(array[1])];
        		dots.push(newDot);
        	}
        	array=null;
        });	        
    }
    rawFile.send(null);
    response=null;
}

function drawDots(){
	geoJson.features=dots;
	map.addLayer({
		"id": "points",
	    "type": "circle",
	    "source": {
	        "type": "geojson",
	        "data": geoJson
	    },
	    "paint": {
	        "circle-radius": 2
	    }
	});
}

function readSteps(){
	var file = PATH+"/step_"+stepsCont+".txt";
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onload = function(){
        var response=rawFile.responseText.split("\n").map(function(item){
        	var array=item.split(" ");
        	if(array.length!=1) {
        		dots[parseInt(array[0])].geometry.coordinates=[parseFloat(array[2]),parseFloat(array[1])];
        	}
        	array=null;
        });
	}
	rawFile.send(null);
	response=null;
}

function loop(){
	readSteps();
	geoJson.features=dots;
	map.getSource('points').setData(geoJson);
	if (stepsCont==4999){
		clearInterval(interval);
		dots=null;
		geoJson.features=null;
	}
}

function generar(){
	if (dots.length==0){
		sock.send(JSON.stringify());
	}
}

function play(){
	if (dots.length!=0){
		interval=setInterval(function(){
			loop();
			stepsCont=stepsCont+1;
		},10);
	}
}

function pause(){
	clearInterval(interval);
}

function send(){
	//var data = draw.getAll();
	//console.log(data);
	generar();
}


