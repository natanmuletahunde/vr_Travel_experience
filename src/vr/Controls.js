import * as THREE from 'three'

export class VRControls {
  constructor(camera, domElement) {
    this.camera = camera
    this.domElement = domElement
    
    this.isMouseDown = false
    this.mouseX = 0
    this.mouseY = 0
    this.targetRotationX = 0
    this.targetRotationY = 0
    this.windowHalfX = window.innerWidth / 2
    this.windowHalfY = window.innerHeight / 2
    
    this.sensitivity = 0.002
    this.maxVerticalRotation = Math.PI / 2.5
    this.fov = 75
    this.targetFov = 75
    this.minFov = 30
    this.maxFov = 120
    this.keys = {}
    
    this.init()
  }
  
  init() {
    this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this))
    this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this))
    this.domElement.addEventListener('touchstart', this.onTouchStart.bind(this))
    this.domElement.addEventListener('touchmove', this.onTouchMove.bind(this))
    this.domElement.addEventListener('touchend', this.onTouchEnd.bind(this))
    this.domElement.addEventListener('wheel', this.onWheel.bind(this))
    
    window.addEventListener('resize', this.onWindowResize.bind(this))
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }
  
  onMouseDown(event) {
    event.preventDefault()
    this.isMouseDown = true
    this.mouseX = event.clientX - this.windowHalfX
    this.mouseY = event.clientY - this.windowHalfY
  }
  
  onMouseMove(event) {
    event.preventDefault()
    
    if (this.isMouseDown) {
      const newMouseX = event.clientX - this.windowHalfX
      const newMouseY = event.clientY - this.windowHalfY
      
      const deltaX = newMouseX - this.mouseX
      const deltaY = newMouseY - this.mouseY
      
      this.targetRotationY += deltaX * this.sensitivity
      this.targetRotationX += deltaY * this.sensitivity
      
      this.targetRotationX = Math.max(
        -this.maxVerticalRotation,
        Math.min(this.maxVerticalRotation, this.targetRotationX)
      )
      
      this.mouseX = newMouseX
      this.mouseY = newMouseY
    }
  }
  
  onMouseUp(event) {
    event.preventDefault()
    this.isMouseDown = false
  }
  
  onTouchStart(event) {
    if (event.touches.length === 1) {
      event.preventDefault()
      this.isMouseDown = true
      this.mouseX = event.touches[0].clientX - this.windowHalfX
      this.mouseY = event.touches[0].clientY - this.windowHalfY
    }
  }
  
  onTouchMove(event) {
    if (event.touches.length === 1) {
      event.preventDefault()
      
      const newMouseX = event.touches[0].clientX - this.windowHalfX
      const newMouseY = event.touches[0].clientY - this.windowHalfY
      
      const deltaX = newMouseX - this.mouseX
      const deltaY = newMouseY - this.mouseY
      
      this.targetRotationY += deltaX * this.sensitivity
      this.targetRotationX += deltaY * this.sensitivity
      
      this.targetRotationX = Math.max(
        -this.maxVerticalRotation,
        Math.min(this.maxVerticalRotation, this.targetRotationX)
      )
      
      this.mouseX = newMouseX
      this.mouseY = newMouseY
    }
  }
  
  onTouchEnd(event) {
    event.preventDefault()
    this.isMouseDown = false
  }
  
  onWheel(event) {
    event.preventDefault()
    
    const delta = event.deltaY * -0.001
    this.targetFov = Math.max(this.minFov, Math.min(this.maxFov, this.targetFov + delta))
  }

  onKeyDown(event) {
    this.keys[event.key.toLowerCase()] = true
  }

  onKeyUp(event) {
    this.keys[event.key.toLowerCase()] = false
  }

  onWindowResize() {
    this.windowHalfX = window.innerWidth / 2
    this.windowHalfY = window.innerHeight / 2
  }
  
  update() {
    this.camera.rotation.y += (this.targetRotationY - this.camera.rotation.y) * 0.05
    this.camera.rotation.x += (this.targetRotationX - this.camera.rotation.x) * 0.05
    
    // Keyboard controls
    if (this.keys['arrowleft']) {
      this.targetRotationY -= 0.02
    }
    if (this.keys['arrowright']) {
      this.targetRotationY += 0.02
    }
    if (this.keys['arrowup']) {
      this.targetRotationX -= 0.02
    }
    if (this.keys['arrowdown']) {
      this.targetRotationX += 0.02
    }
    
    // Smooth FOV transitions
    if (Math.abs(this.camera.fov - this.targetFov) > 0.1) {
      this.camera.fov += (this.targetFov - this.camera.fov) * 0.1
      this.camera.updateProjectionMatrix()
    }
  }
  
  dispose() {
    this.domElement.removeEventListener('mousedown', this.onMouseDown)
    this.domElement.removeEventListener('mousemove', this.onMouseMove)
    this.domElement.removeEventListener('mouseup', this.onMouseUp)
    this.domElement.removeEventListener('touchstart', this.onTouchStart)
    this.domElement.removeEventListener('touchmove', this.onTouchMove)
    this.domElement.removeEventListener('touchend', this.onTouchEnd)
    this.domElement.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }
}