const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const Tone = require('tone');
import Framework from './framework'
import MusicMaker from './audioProvider'
// r,g,b to pass to shaders
var r=0.6;
var g=0.0;
var b=0.0;

// function to manipulate stuff from gui
var GUIoptions = function()
{
	this.Red=0.6;
	this.Green=0.0;
	this.Blue=0.0;
	this.Music=false;
	this.Audio=false;
	this.Start=startFun;
	this.MusicSource=function(){
		window.location = "http://freemusicarchive.org/music/The_Kyoto_Connection/Wake_Up_1957/09_Hachiko_The_Faithtful_Dog";};
}

function startFun()
{
	if(started===false)
	{
		console.log('Hola!');
		mmaker.test(); // COMPUTE THE AUDIO SEQUENCE
		started=true;
	}
}

// for time calculations
var oldt=0.0;
var newt=0.0;
var time=0.0;

// material for geometry
// var icoshMaterial = new THREE.ShaderMaterial({
//     uniforms: {
//     //   image: { // Check the Three.JS documentation for the different allowed types and values
//     //     type: "t",
//     //     value: THREE.ImageUtils.loadTexture('./adam.jpg')
//     //   },
// 	  time: {value : 0.0},
// 	  Red: {value : 0.6},
// 	  Green: {value : 0.0},
// 	  Blue: {value : 0.0},
// 	  data: {
// 		  type : 'iv1',
// 		  value : new Array}
//     },
//     vertexShader: require('./shaders/line-visualizer-vert.glsl'),
//     fragmentShader: require('./shaders/line-visualizer-frag.glsl')
//   });

var started=false;
var vertList = [];
var material = new THREE.PointsMaterial({	size: 0.5, vertexColors: THREE.VertexColors });
var geometry = new THREE.Geometry();
var pointCloud = new THREE.Points(geometry, material);

var mmaker = new MusicMaker();

// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;
  var data= framework.data; // per frame audio data
  var aud= framework.aud; // audio object to control play/pause

  var {scene, camera, renderer, gui, stats, data, aud} = framework;

  // initialize an icosahedron and material
  //var icosh = new THREE.IcosahedronBufferGeometry(1, 5);
  //var icosh = new THREE.Mesh(icosh, icoshMaterial);

  //var material = new THREE.PointCloudMaterial({	color: 0xffffcc });

/*	// PARTICLE VISUALIZER:
	var x, y, z;
	for(var i=0;i<10240*2;i++)
	{
	  x = (Math.random() * 1000) - 500;
	  y = 0;//(Math.random() * 800) - 400;
	  z = (Math.random() * 1000) - 500;
	  var vert = new THREE.Vector3(x, y, z);
	  vertList.push(vert);
	  geometry.vertices.push(vert);
	  geometry.colors.push(new THREE.Color(0,0,0));//(Math.random(), Math.random(), Math.random()));
	}

  scene.add(pointCloud);
*/

	// 12 NOTES VISUALIZER
	var x, y, z;
	for(var i=0;i<12*3;i++)
	{
	  x = i-6*3;
	  y = 0;//(Math.random() * 800) - 400;
	  z = 0;

	    // if(i%12==0)
	 //  		z=0;
	    // else if(i%12==1 || i%12==2)
	 //  		z=1;
		// else if(i%12==3 || i%12==4)
  // 	  		z=2;
		// else if(i%12==5 || i%12==6)
  // 	  		z=3;
		// else if(i%12==7)
  // 	  		z=4;
		// else if(i%12==8 || i%12==9)
  // 	  		z=5;
		// else if(i%12==10 || i%12==11)
  // 	  		z=6;
		// z*=2;

  		if(i%12==1 || i%12==3 || i%12==6 || i%12==8 || i%12==10)
	  		z=-2;

		var vert = new THREE.Vector3(x, y, z);
		vertList.push(vert);
		geometry.vertices.push(vert);

		var col;
	  	if(i<12)
	  		col = new THREE.Color(1,0,0);//(Math.random(), Math.random(), Math.random()));
		else if(i<24)
			col = new THREE.Color(0,1,0);
		else
			col = new THREE.Color(0,0,1);

		if(z==-2)
	  		col.multiplyScalar(0.5);

		geometry.colors.push(col);
	}
	scene.add(pointCloud);


/*
var synth = new Tone.Synth({
			"oscillator" : {
				"type" : "square"
			},
			"envelope" : {
				"attack" : 0.01,
				"decay" : 0.2,
				"sustain" : 0.2,
				"release" : 0.2,
			}
		}).toMaster();
		// GUI //
		var keyboard = Interface.Keyboard();
		keyboard.keyDown = function (note) {
		    synth.triggerAttack(note);
		};
		keyboard.keyUp = function () {
		    synth.triggerRelease();
		};
*/


  // set camera position
  camera.position.set(0,10,20);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // add icosh to the scene
  //scene.add(icosh);

  // Elements for the GUI:
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });
  var update= new GUIoptions();
  // gui.add(update,'Red', 0.0, 1.0,0.05).onChange(function(newVal) {
  //   r=newVal;
  // });
  // gui.add(update,'Green', 0.0, 1.0,0.05).onChange(function(newVal) {
  //   g=newVal;
  // });
  // gui.add(update,'Blue', 0.0, 1.0,0.05).onChange(function(newVal) {
  //   b=newVal;
  // });
	gui.add(update,'Music').onChange(function(newVal) {
		if(newVal===false) aud.pause();
		else aud.play();
	});
	gui.add(update,'Audio').onChange(function(newVal) {
		mmaker.on = newVal;
		if(mmaker.on===true)
		{
		//	mmaker = new MusicMaker();
			Tone.Transport.start();
		}
		else {
			//mmaker = undefined;
			Tone.Transport.stop();
		}
	});
	//gui.add(update,'MusicSource').onclick;
	gui.add(update,'Start').onclick;
}

// called on frame updates
function onUpdate(framework) {
   // icoshMaterial.uniforms.Red.value=r;
   // icoshMaterial.uniforms.Green.value=g;
   // icoshMaterial.uniforms.Blue.value=b;

   oldt=newt;
   newt=performance.now(); // measures time since the beginning of execution
   time+=(newt-oldt);

   // icoshMaterial.uniforms.data.value=Int32Array.from(framework.data); // typed arrays casting
  // icoshMaterial.uniforms.time.value=time/4000; // control the speed of cloud movement
/* ////// ANIMATION FOR POINT CLOUD VISUALIZER : SINE AND DISPLACEMENT
   /// NEW
   for(var i=0; i<geometry.vertices.length;i++)
   {
		var dX, dY, dZ;
		//dX = Math.random() - 0.5;
		//dY = Math.random() - 0.5;
		//dZ = Math.random() - 0.5;
		var s = 1;//2*Math.sin(vertList[i].z/20+time/2000);
		dX = vertList[i].x + 0;
		dZ = vertList[i].z + 0;
		dY = vertList[i].y
			+ 10 * s * (framework.data[i%100]/2+framework.data[(i-1)%100]/4+framework.data[(i+1)%100]/4)/255.0
			+ 2 * s;
		//	+ s * Math.random()/2 - 0.25;

		//var col = Math.abs(vertList[i].x*vertList[i].z);
		if(dY>0)
			geometry.colors[i] = new THREE.Color(vertList[i].y,vertList[i].y,vertList[i].y);//(Math.random(), Math.random(), Math.random());
		//else
			//geometry.colors[i] = new THREE.Color(1,1,1);

		//var vert = new THREE.Vector3(dX,dY,dZ);
		geometry.vertices[i] = new THREE.Vector3(dX,dY,dZ);
   }
*/

	if(started===true && mmaker.on)
	{
		for(var i=0; i<geometry.vertices.length;i++)
	    {
			var s = Math.sin(time/60);

	 		var dX, dY, dZ;
	 		dX = vertList[i].x;
	 		dZ = vertList[i].z;

			if(i==(mmaker.currentNote+6*(mmaker.currentOctave-2)))
	 			dY = (vertList[i].y + 1);
			else
				dY = vertList[i].y * 0.5;

			dY = dY*s;

			if(dY>3.0)
				dY = 3.0;

			if(dY<0.001)
				dY=0;

			vertList[i] = new THREE.Vector3(dX,dY,dZ);
	 		geometry.vertices[i] = new THREE.Vector3(dX,dY,dZ);
	    }
		geometry.verticesNeedUpdate = true;
		geometry.colorsNeedUpdate = true;
	}

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
