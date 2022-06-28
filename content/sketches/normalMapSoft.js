/*
	Andor Saga
	July 19 2021
	Normal Mapping demo using p5.js
	
	[ ] Add specular
	[ ] Add attenuation
*/

let imgNormal;
let imgHeight;
let W, H;
let gameStarted = false;
let lightPos, lightCol;

function preload(){
	imgNormal = loadImage("normal.png", _img => {
		_img.loadPixels();
		W = _img.width;
		H = _img.height;
	});
	
	// technically we don't use this for diffuse lighting.
	imgHeight = H;
}

function setup() {
	createCanvas(W, H);
	button = createButton("Start Normap Map Test");
    button.position(10, 10);
    button.mousePressed(() => gameStarted = !gameStarted );
	lightPos = createVector(W/2, H/2, 100);
	lightCol = createVector(255, 255, 255);
}

function draw() {	
    if (gameStarted){
	loadPixels();
	lightPos.set(constrain(mouseX,0,W),constrain(mouseY,0,H), 100);
	
	let p = createVector();
	let n = createVector();
	for(let x = 0; x < W; x++){
		for(let y = 0; y < H; y++){
			
			// vector from pixel to light
			p.set(x-lightPos.x, y-lightPos.y , lightPos.z);
			let m = p.mag();
			p.x = p.x/m;
			p.y = p.y/m;
			p.z = p.z/m;
			
			getNormal(x, y, n);
			n.normalize();
			
			let intensity = p.dot(n);
			
			pixels[getIdx(x, y) + 0] = Math.floor(intensity * lightCol.x * (1-m/W));
			pixels[getIdx(x, y) + 1] = Math.floor(intensity * lightCol.y * (1-m/W));
			pixels[getIdx(x, y) + 2] = Math.floor(intensity * lightCol.z * (1-m/W));
			pixels[getIdx(x, y) + 3] = 255;
		}
	}
	
	updatePixels();}
}

function getIdx(x,y){
	return (y * W + x) * 4;
}

function getNormal(x, y, n){
	let idx = getIdx(x,y);
	
	let r = imgNormal.pixels[idx + 0];
	let g = imgNormal.pixels[idx + 1];
	let b = imgNormal.pixels[idx + 2];
	
	r = map(r, 0, 255, -1, 1);
	g = map(g, 0, 255, -1, 1);
	b = map(b, 0, 255,  0, 1);
	
	n.set(r, g, b);
}

function keyPressed(){
	if(key == 's'){
		save();
	}
}