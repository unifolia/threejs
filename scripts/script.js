let three = {}

let player = { 
    height: 1.8, 
    speed: 0.4, 
    turnSpeed: 0.1, 
}

let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000)
let textureLoader = new THREE.TextureLoader()
let isKeyDown = false

let initialX = null
let initialY = null

three.createBackground = () => {
    // Create floor
    floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20, 10, 10),
        new THREE.MeshPhongMaterial({ 
            color: 0xc4bcd0, 
            wireframe: false})
    )
    floor.position.set(0, 0, 2)
    floor.rotation.x -= Math.PI / 2

    // Create ambient light
    ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    
    // Create direct light
    light = new THREE.PointLight(0xffffff, 1, 25)
    let { position, shadow } = light
    position.set(-3, 6, -3)
    shadow.camera.near = 0.1
    shadow.camera.far = 25

    // Set background
    scene.background = new THREE.Color(0xebfaea)
}

three.createJames = () => {
    let texture = textureLoader.load("./assets/jamesHeadshot.jpg")

    james = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
        })
    )
    james.position.set(-3, 5, 7)
}

three.createProjects = () => {
    let pacTexture = textureLoader.load("./assets/pac-rem.png")
    let cashTexture = textureLoader.load("./assets/cashComrade.png")
    let marsTexture = textureLoader.load("./assets/marsometer.png")
    let pathsTexture = textureLoader.load("./assets/pathsAndPodcasts.png")
    let couchTexture = textureLoader.load("./assets/jamesCouch.png")
    let skillsTexture = textureLoader.load("./assets/skills.png")

    // 
    pacRem = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: pacTexture,
        })
    )
    pacRem.position.set(4, 5, 7)

    // 
    cashComrade = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: cashTexture,
        })
    )
    cashComrade.position.set(7, 5, 2)

    // 
    marsometer = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: marsTexture,
        })
    )
    marsometer.position.set(-8, 5, 2)

    // 
    paths = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: pathsTexture,
        })
    )
    paths.position.set(10, 3, 7)

    // 
    jamesCouch = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: couchTexture,
        })
    )
    jamesCouch.position.set(0, 2, -8)

    skills = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 10),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: skillsTexture,
        })
    )
    skills.position.set(0, 12, 17)
}

three.createShapes = () => {
    three.createJames()
    three.createProjects()
}

three.createCanvas = () => {
    camera.position.set(0, player.height, -5)
    camera.lookAt(new THREE.Vector3(0, player.height, 0))

    const canvas = document.querySelector('#canvas')
    renderer = new THREE.WebGLRenderer({ canvas })

    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.BasicShadowMap

    document.body.appendChild(renderer.domElement)
}

three.resizeScreen = () => {
    let resizeRendererToDisplaySize = renderer => {
        let canvas = renderer.domElement
        let width = canvas.clientWidth
        let height = canvas.clientHeight
        let needResize = canvas.width !== width || canvas.height !== height

        if (needResize) {
            renderer.setSize(width, height, false)
        }
        return needResize
    }

    if (resizeRendererToDisplaySize(renderer)) {
        let canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
    }
}

three.animate = () => {
    requestAnimationFrame(three.animate)

    james.rotation.x += 0.001
    james.rotation.y += 0.001
    pacRem.rotation.x -= 0.001
    pacRem.rotation.y -= 0.001
    marsometer.rotation.y -= 0.001
    cashComrade.rotation.z += 0.002
    paths.rotation.z -= 0.002
    paths.rotation.y += 0.002
    skills.rotation.y += 0.002

    three.resizeScreen()
    renderer.render(scene, camera)
}

three.keyDown = () => {
    document.addEventListener("keydown", event => {
        isKeyDown = true

        let { position, rotation } = camera
        let { speed, turnSpeed } = player

        if (isKeyDown) {
            if (event.keyCode == 87) {
                // "W" - move forward
                position.x -= Math.sin(rotation.y) * speed
                position.z -= -Math.cos(rotation.y) * speed
            } else if (event.keyCode == 65) {
                // "A" - move left
                position.x += Math.sin(rotation.y + Math.PI / 2) * speed
                position.z += -Math.cos(rotation.y + Math.PI / 2) * speed
            } else if (event.keyCode == 83) {
                // "S" - move backward
                position.x += Math.sin(rotation.y) * speed
                position.z += -Math.cos(rotation.y) * speed
            } else if (event.keyCode == 68) {
                // "D" - move right
                position.x += Math.sin(rotation.y - Math.PI / 2) * speed
                position.z += -Math.cos(rotation.y - Math.PI / 2) * speed
            } else if (event.keyCode == 37) {
                // "<" - turn left
                rotation.y -= turnSpeed
            } else if (event.keyCode == 39) {
                // ">" - turn right
                rotation.y += turnSpeed
            }
        }
    })
}

three.keyUp = () => {
    isKeyDown = false
}

three.swipe = () => {
    document.addEventListener("touchstart", startTouch, false)
    document.addEventListener("touchmove", moveTouch, false)

    function startTouch(event) {
        initialX = event.touches[0].clientX
        initialY = event.touches[0].clientY
    }

    function moveTouch(event) {
        if (initialX !== null || initialY !== null) {
            let currentX = event.touches[0].clientX
            let currentY = event.touches[0].clientY

            let diffX = initialX - currentX
            let diffY = initialY - currentY

            let { position, rotation } = camera
            let { speed, turnSpeed } = player

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    rotation.y += (turnSpeed * 4)
                } else {
                    rotation.y -= (turnSpeed * 4)
                }
            } else {
                if (diffY > 0) {
                    position.x -= Math.sin(rotation.y) * speed * 4
                    position.z -= -Math.cos(rotation.y) * speed * 4
                } else {
                    position.x += Math.sin(rotation.y) * speed * 4
                    position.z += -Math.cos(rotation.y) * speed * 4
                }
            }
            initialX = null
            initialY = null
        }
    }
}


let init = () => {
    three.createCanvas()
    three.createBackground()
    three.createShapes()

    scene.add(james, pacRem, marsometer, cashComrade, paths, jamesCouch, skills, floor, ambientLight, light)

    three.animate()
    three.keyDown()
    three.swipe()
}

window.onload = init