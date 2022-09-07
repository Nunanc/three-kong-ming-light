import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import baseVertexShader from '../shader/light/vertex.glsl'
import baseFragmentShader from '../shader/light/fragment.glsl'

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import gsap from "gsap";


// 创建一个场景
const scene = new THREE.Scene();

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true })
// 输出编码
renderer.outputEncoding = THREE.sRGBEncoding
// 色调映射
renderer.toneMapping = THREE.ACESFilmicToneMapping
// 曝光程度
renderer.toneMappingExposure = 0.2

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// 设置相机位置 xyz
camera.position.set(0, 0, 10)

// 创建化境纹理
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync('./assets/2k.hdr').then(texture => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture
  scene.environment = texture
})

scene.add(camera)

// 添加平面
// 创建着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
  // 顶点着色器
  vertexShader: baseVertexShader,
  // 片元着色器 rgba
  fragmentShader: baseFragmentShader,
  // wireframe: true,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: {
      value: 0
    }
  }
})
// 载入模型
const gltfLoader = new GLTFLoader()
let lightBody = null;
gltfLoader.load('./assets/model/light.glb', (gltf) => {
  lightBody = gltf.scene.children[0];
  lightBody.material = shaderMaterial;

  for (let i = 0; i < 150; i++) {
    let light = gltf.scene.clone(true)
    let x = (Math.random() - 0.5) * 300
    let z = (Math.random() - 0.5) * 300
    let y = Math.random() * 60
    light.position.set(x, y, z)

    // 动画
    gsap.to(light.rotation, {
      y: 2 * Math.PI,
      duration: 10 + Math.random() * 30,
      repeat: -1,
    });
    gsap.to(light.position, {
      x: "+=" + Math.random() * 5,
      y: "+=" + Math.random() * 20,
      yoyo: true,
      duration: 5 + Math.random() * 10,
      repeat: -1,
    });

    scene.add(light)
  }
})


// 辅助轴
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 将 webgl 的内容添加到 body
document.body.appendChild(renderer.domElement)

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)

// 设置阻尼
controls.enableDamping = true

const clock = new THREE.Clock();

function animate() {
  const time = clock.getElapsedTime()
  // 传入 time
  shaderMaterial.uniforms.uTime.value = time
  // 帧回调函数
  requestAnimationFrame(animate);
  // 控制器更新
  controls.update();
  // 重新渲染
  renderer.render(scene, camera);
}

// 初始化
animate()


window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio)
})