import dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import PreventDragClick from "../laycaster/preventDragClick";
// ----- 주제: 힘

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자를 부드럽게

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  camera.position.y = 2;
  scene.add(camera);
  // Light
  // ambientLight: 은은하게 전체적으로 비춘다
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // dat GUI
  // const gui = new dat.GUI();
  // gui.add(light.position, "x", -10, 10, 0.1).name("light-x");
  // gui.add(light.position, "y", -10, 10, 0.1).name("light-y");
  // gui.add(light.position, "z", -10, 10, 0.1).name("light-z");

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // Controller
  const controls = new OrbitControls(camera, renderer.domElement);

  // Cannon(물리 엔진)
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -9.81, 0);

  // Contact Material
  const defaultMaterial = new CANNON.Material("default");
  // 기본값 설정
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.5, // 마찰
      restitution: 0.3, // 반발
    }
  );
  cannonWorld.defaultContactMaterial = defaultContactMaterial;

  const floorShape = new CANNON.Plane(); // 모양
  const floorBody = new CANNON.Body({
    // 물리엔진이 적용되는 실체
    mass: 0, // 바닥 역할을 해줘야해서 중력의 영향을 받으면 안되기에 0으로 설정
    position: new CANNON.Vec3(0, 0, 0),
    shape: floorShape,
    material: defaultMaterial,
  });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
  cannonWorld.addBody(floorBody);

  // CANNON에서의 박스는 중심에서부터 거리를 말한다.
  // 기존 sphereMesh의 길이가 1,1,1 이므로 중심에서 거리는 0.5가 된다.
  const sphereShape = new CANNON.Sphere(0.5);
  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 10, 0),
    shape: sphereShape,
    material: defaultMaterial,
  });
  cannonWorld.addBody(sphereBody);

  //Mesh
  const floorMesh = new THREE.Mesh( // 바닥생성
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: "slategray" })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  const sphereGeometry = new THREE.SphereGeometry(0.5);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: "green",
  });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.y = 0.5;
  sphereMesh.castShadow = true;
  scene.add(sphereMesh);

  // 그리기
  const clock = new THREE.Clock();
  function draw() {
    const delta = clock.getDelta();
    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120; // 컴퓨터에 따라 주사율이 달라서 보정값으로 바꿔줌
    cannonWorld.step(cannonStepTime, delta, 3); // 갱신하는 시간 단위
    // cannonworld안 컴포넌트의 포지션을 그대로 복사해서 기존의 메쉬에 적용
    sphereMesh.position.copy(sphereBody.position); // 위치
    sphereMesh.quaternion.copy(sphereBody.quaternion); // 회전
    // 속도 감소
    sphereBody.velocity.x *= 0.98;
    sphereBody.velocity.y *= 0.98;
    sphereBody.velocity.z *= 0.98;
    sphereBody.angularVelocity.x *= 0.98;
    sphereBody.angularVelocity.y *= 0.98;
    sphereBody.angularVelocity.z *= 0.98;
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", setSize);
  canvas.addEventListener("click", () => {
    if (preventDragClick.mouseMoved) return;
    sphereBody.velocity.x = 0;
    sphereBody.velocity.y = 0;
    sphereBody.velocity.z = 0;
    sphereBody.angularVelocity.x = 0;
    sphereBody.angularVelocity.y = 0;
    sphereBody.angularVelocity.z = 0;
    sphereBody.applyForce(new CANNON.Vec3(50, 300, 0), sphereBody.position);
  });
  const preventDragClick = new PreventDragClick(canvas);
  draw();
}
