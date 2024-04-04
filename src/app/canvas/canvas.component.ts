import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';



@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})

export class CanvasComponent implements AfterViewInit {

  @ViewChild('bgCanvas') private canvasRef!: ElementRef;

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    this.moveCamera();
  }

  private camera!: THREE.Camera
  private scene!: THREE.Scene
  private renderer!: THREE.WebGLRenderer
  private torus!: THREE.Mesh
  private pointLight!: THREE.PointLight
  private ambientLight!: THREE.AmbientLight
  private lightHelper!: THREE.PointLightHelper
  private gridHelper!: THREE.GridHelper
  private controls!: OrbitControls
  private moon!: THREE.Mesh
  private dev!: THREE.Mesh

  constructor() {
    this.animate = this.animate.bind(this);
    this.moveCamera = this.moveCamera.bind(this)

  }

  ngAfterViewInit(): void {
    this.initThree();
    this.animate();

  }

  private initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth/window.innerHeight,
      0.1,
      1000)
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement})
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera.position.setZ(30)

    // Load the texture and set the scene background within the load callback.
    new THREE.TextureLoader().load('assets/space.jpg', texture => {
      const spaceTexture = texture;
      this.scene.background = spaceTexture;
    });


    this.renderer.render(this.scene, this.camera)


    const geometry =  new THREE.TorusGeometry(20,3,16,100)
    const material = new THREE.MeshStandardMaterial( {
      color: 0xFF5347,
      // wireframe: true
    })
    this.torus = new THREE.Mesh(geometry, material)
    this.scene.add(this.torus)

    this.pointLight = new THREE.PointLight(0xffffff, 1,100)
    this.pointLight.position.set(20,20,20)
    this.scene.add(this.pointLight)
    console.log("Point Light Position:", this.pointLight.position);


    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);
    //
    // this.lightHelper = new THREE.PointLightHelper(this.pointLight)
    // this.gridHelper = new THREE.GridHelper(200,50)
    // this.scene.add(this.lightHelper, this.gridHelper)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    Array(200).fill(null).forEach(() =>  this.addStar())


    // Dev

    const devTexture = new THREE.TextureLoader().load('assets/dev.jpg')

    this.dev = new THREE.Mesh(
      new THREE.BoxGeometry(3,3,3),
      new THREE.MeshBasicMaterial( {map: devTexture})
    )
    this.scene.add(this.dev)

    // Moon

    const moonTexture = new THREE.TextureLoader().load('assets/moon.jpg')
    const normalTexture =  new THREE.TextureLoader().load('assets/normal.jpg')

    this.moon = new THREE.Mesh(
      new THREE.SphereGeometry(3,32,32),
      new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalTexture
      })

    )
    this.scene.add(this.moon)

    this.moon.position.z = 30
    this.moon.position.setX(-10)

    // document.body.onscroll = () => this.moveCamera();


  }
  private addStar(){
    const geometry = new THREE.SphereGeometry(0.25, 24, 24)
    const material = new THREE.MeshStandardMaterial({color: 0xffffff})
    const star = new THREE.Mesh(geometry, material)

    const [x,y,z] = Array(3).fill(null).map(() => THREE.MathUtils.randFloatSpread(100))
    star.position.set(x,y,z)
    this.scene.add(star)

  }

  private moveCamera() {
    const t =  document.body.getBoundingClientRect().top;
    this.moon.rotation.x += 0.05
    this.moon.rotation.y += 0.075
    this.moon.rotation.z += 0.05

    this.dev.rotation.y += 0.01
    this.dev.rotation.z += 0.01

    this.camera.position.x = t * -0.01
    this.camera.position.y = t * -0.0002
    this.camera.position.z = t * -0.0002


  }



  private animate() {
    requestAnimationFrame(this.animate)

    this.torus.rotation.x +=0.01
    this.torus.rotation.y +=0.005
    this.torus.rotation.z +=0.01

    this.controls.update()

    this.renderer.render(this.scene, this.camera)

  }
}
