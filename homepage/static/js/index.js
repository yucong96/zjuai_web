var divide = 200;
var length = 200000;
var height = 3000;
var sight_distance = 10000;
var star_num = 10000;
var frame = 0;

// orbit
var radius = length / 3;
var angle = 0;

var container = document.getElementById("canvas");

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2*length);
camera.position.x = radius * Math.cos(angle);
camera.position.y = height;
camera.position.z = radius * Math.sin(angle);
camera.lookAt(new THREE.Vector3(camera.position.x - sight_distance * Math.sin(angle), height, camera.position.z + sight_distance * Math.cos(angle)));

var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x23233f, 1, 300000);





sky = new THREE.Sky();
sky.scale.setScalar( length * 2 );
scene.add( sky );

// Add Sun Helper
sunSphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry( 20000, 16, 8 ),
    new THREE.MeshBasicMaterial( { color: 0xffffff } )
);
sunSphere.position.y = length * 6;
sunSphere.visible = false;
scene.add( sunSphere );

/// GUI

var effectController  = {
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    inclination: 0.5, // elevation / inclination
    azimuth: 0.9, // Facing front,
    sun: ! true
};

var distance = 400000;

function guiChanged() {

    var uniforms = sky.material.uniforms;
    uniforms.turbidity.value = effectController.turbidity;
    uniforms.rayleigh.value = effectController.rayleigh;
    uniforms.luminance.value = effectController.luminance;
    uniforms.mieCoefficient.value = effectController.mieCoefficient;
    uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

    var theta = Math.PI * ( effectController.inclination - 0.5 );
    var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

    sunSphere.position.x = distance * Math.cos( phi );
    sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

    sunSphere.visible = effectController.sun;

    uniforms.sunPosition.value.copy( sunSphere.position );
}
guiChanged();




// Below are the plane part
var uniforms = {
    time: {type: "f", value: 0.0},
    height: {type: "f", value: height/4}
};
var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    wireframe: true,
    fog: false
});
var plane = new THREE.Mesh(new THREE.PlaneGeometry(length, length, divide, divide), material);
plane.rotation.x -= Math.PI * .5;
scene.add(plane);

// Below are the star part
var geometry = new THREE.Geometry();
for (var i = 0; i < star_num; i++) {
    var vertex = new THREE.Vector3();
    vertex.x = (Math.random() - 0.5) * 1.5 * length;
    vertex.z = (Math.random() - 0.5) * 1.5 * length;
    vertex.y = (Math.random() * height * 4) + (1.5 - Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z) / (0.75 * Math.sqrt(2) * length)) * 2 * height;
    geometry.vertices.push(vertex);
}
var material = new THREE.ParticleBasicMaterial({size: 100});
var particles = new THREE.ParticleSystem(geometry, material);
scene.add(particles);

// Below are the render part
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
console.log(window.innerWidth);
console.log(window.innerHeight);
container.appendChild(renderer.domElement);

render();

function render() {
    requestAnimationFrame(render);
    angle += Math.PI / 180 / 20;
    camera.position.x = radius * Math.cos(angle);
    camera.position.y = height;
    camera.position.z = radius * Math.sin(angle);
    camera.lookAt(new THREE.Vector3(camera.position.x - sight_distance * Math.sin(angle), height, camera.position.z + sight_distance * Math.cos(angle)));
    uniforms.time.value += 0.05;
    renderer.render(scene, camera);
}