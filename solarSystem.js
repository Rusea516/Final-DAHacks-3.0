// Import Three.js essentials and setup renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 150;




// Function to apply gravitational pull towards the black hole
function applyGravitationalPull(planet, blackHole, gravityStrength) {
    const distance = blackHole.position.distanceTo(planet.group.position);
    const forceMagnitude = gravityStrength / (distance * distance); // Inverse square law for gravity

    const direction = blackHole.position.clone().sub(planet.group.position).normalize();
    planet.group.position.add(direction.multiplyScalar(forceMagnitude));
}


// Load textures and define lighting for day and night modes
const daySkyTexture = new THREE.TextureLoader().load('images/sky_gradient.jpg'); // Gradient texture for daytime sky
const nightSkyTexture = new THREE.TextureLoader().load('images/stars.jpg'); // Starry sky for night mode
scene.background = nightSkyTexture; // Set initial mode to night

// Define lighting intensities for day and night
const ambientIntensityDay = 0.8;
const ambientIntensityNight = 0.3;
const directionalIntensityDay = 1.5;
const directionalIntensityNight = 0.6;

// Ambient and Directional lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensityNight); // Start with night intensity
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, directionalIntensityNight);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

// Toggle day/night mode function
function toggleDayNight() {
    const isNight = scene.background === nightSkyTexture;
    
    // Toggle sky texture
    scene.background = isNight ? daySkyTexture : nightSkyTexture;
    
    // Adjust ambient and directional light for realistic day/night feel
    ambientLight.intensity = isNight ? ambientIntensityDay : ambientIntensityNight;
    directionalLight.intensity = isNight ? directionalIntensityDay : directionalIntensityNight;

    // Change directional light color for a sunset-like effect at night
    directionalLight.color.set(isNight ? 0xFFFFFF : 0xFFA07A); // White for day, soft orange for night
}

function addAtmosphere(planet, color) {
    const atmosphereGeometry = new THREE.SphereGeometry(planet.size * 1.1, 32, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    planet.group.add(atmosphere);
}
// Sun setup with warmer red glow
const sunTexture = new THREE.TextureLoader().load('images/sun.jpg');
const sunMaterial = new THREE.MeshStandardMaterial({
    map: sunTexture,
    color: 0xFF6347,
    emissive: 0xFF4500,
    emissiveMap: sunTexture,
    emissiveIntensity: 1.5
});
const sunGeometry = new THREE.SphereGeometry(8, 64, 64);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Optional glow around the sun
const glowGeometry = new THREE.SphereGeometry(9, 64, 64);
const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xFF6347,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
});
const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
scene.add(sunGlow);

// Function to animate the sun texture
function animateSunTexture() {
    sunMaterial.map.offset.x += 0.001;
    sunMaterial.map.offset.y += 0.001;
}

// Load textures for planets
const loader = new THREE.TextureLoader();
const planetTextures = {
    Mercury: loader.load('images/mercury.jpg'),
    Venus: loader.load('images/venus.jpg'),
    Earth: loader.load('images/earth.jpg'),
    Mars: loader.load('images/mars.jpg'),
    Jupiter: loader.load('images/jupiter.jpg'),
    Saturn: loader.load('images/saturn.jpg'),
    Uranus: loader.load('images/uranus.jpg'),
    Neptune: loader.load('images/neptune.jpg'),
};

// Define planets with realistic distances, sizes, and speeds
// Define planets with realistic distances, sizes, speeds, and rotation speeds
const planets = [
    { name: "Mercury", texture: planetTextures.Mercury, distance: 20, size: 1, speed: 0.02, rotationSpeed: 0.001, info: "Smallest planet" },
    { name: "Venus", texture: planetTextures.Venus, distance: 30, size: 1.2, speed: 0.015, rotationSpeed: 0.0001, info: "Hot and volcanic" },
    { name: "Earth", texture: planetTextures.Earth, distance: 40, size: 1.3, speed: 0.01, rotationSpeed: 0.002, info: "Our home" },
    { name: "Mars", texture: planetTextures.Mars, distance: 50, size: 1.1, speed: 0.008, rotationSpeed: 0.0015, info: "The Red Planet" },
    { name: "Jupiter", texture: planetTextures.Jupiter, distance: 70, size: 2.5, speed: 0.005, rotationSpeed: 0.003, info: "Largest planet" },
    { name: "Saturn", texture: planetTextures.Saturn, distance: 90, size: 2.1, speed: 0.004, rotationSpeed: 0.0025, info: "Has rings", hasRings: true },
    { name: "Uranus", texture: planetTextures.Uranus, distance: 110, size: 1.7, speed: 0.003, rotationSpeed: 0.001, info: "Icy giant", tilt: Math.PI / 2 },
    { name: "Neptune", texture: planetTextures.Neptune, distance: 130, size: 1.7, speed: 0.002, rotationSpeed: 0.001, info: "Farthest planet" },
];

function addAsteroidBelt() {
    const asteroidBelt = new THREE.Group();
    const asteroidColor = 0x8B8B8B;

    for (let i = 0; i < 1000; i++) {
        const asteroidSize = Math.random() * 0.1 + 0.05;
        const asteroidGeometry = new THREE.SphereGeometry(asteroidSize, 16, 16);
        const asteroidMaterial = new THREE.MeshBasicMaterial({ color: asteroidColor });
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        
        // Adjust distance to be between Mars and Jupiter's orbits
        const distance = 55 + Math.random() * 10; // Between Mars (50) and Jupiter (70)
        const angle = Math.random() * Math.PI * 2;
        
        // Position the asteroid along the calculated distance and angle
        asteroid.position.set(distance * Math.cos(angle), 0, distance * Math.sin(angle));
        asteroidBelt.add(asteroid);
    }
    
    scene.add(asteroidBelt);
}
addAsteroidBelt();


const speedSlider = document.getElementById('speedSlider');
speedSlider.addEventListener('input', () => {
    const speedFactor = parseFloat(speedSlider.value);
    planets.forEach(planet => planet.speed = planet.speed * speedFactor); // Adjust each planet's speed
});

// Function to add textured rings to a planet
function addRings(planetGroup, texturePath, innerRadius, outerRadius) {
    const ringTexture = new THREE.TextureLoader().load(texturePath);
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    planetGroup.add(ring);
}

// Pause and resume functionality
let isPaused = false;
function pauseAnimation() { isPaused = true; }
function resumeAnimation() { isPaused = false; }

// Modal elements for displaying planet info
const planetModal = document.createElement("div");
planetModal.id = "planetModal";
planetModal.style.display = "none";
planetModal.style.position = "fixed";
planetModal.style.zIndex = "100";
planetModal.style.width = "80%";
planetModal.style.maxWidth = "600px";
planetModal.style.margin = "15% auto";
planetModal.style.padding = "20px";
planetModal.style.background = "#333";
planetModal.style.color = "white";
planetModal.style.textAlign = "center";
planetModal.style.borderRadius = "5px";
planetModal.innerHTML = `
    <span onclick="closeModal()" style="cursor:pointer;float:right;font-size:28px;">&times;</span>
    <h2 id="planetName"></h2>
    <p id="planetInfo"></p>
`;
document.body.appendChild(planetModal);
const planetNameElem = document.getElementById("planetName");
const planetInfoElem = document.getElementById("planetInfo");

function closeModal() { planetModal.style.display = "none"; }

// Create planets with click events and axial tilts
planets.forEach(planet => {
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const geometry = new THREE.SphereGeometry(planet.size, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: planet.texture });
    const mesh = new THREE.Mesh(geometry, material);

    // Set userData and cursor properties for hover effect
    mesh.userData = { name: planet.name, info: planet.info };
    mesh.cursor = 'pointer'; // Enable pointer cursor on hover

    planetGroup.add(mesh);
    planetGroup.position.set(planet.distance, 0, 0);
    planet.mesh = mesh;
    planet.group = planetGroup;
    planet.angle = 0;
    switch (planet.name) {
        case "Mercury":
            addAtmosphere(planet, 0xaaaaaa); // Light gray for Mercury
            break;
        case "Venus":
            addAtmosphere(planet, 0xffe4b5); // Pale yellow for Venus
            break;
        case "Earth":
            addAtmosphere(planet, 0x89CFF0); // Light blue for Earth
            break;
        case "Mars":
            addAtmosphere(planet, 0xff4500); // Reddish-orange for Mars
            break;
        case "Jupiter":
            addAtmosphere(planet, 0xffa07a); // Light coral for Jupiter
            break;
        case "Saturn":
            addAtmosphere(planet, 0xf4a460); // Sandy brown for Saturn
            break;
        case "Uranus":
            addAtmosphere(planet, 0x00ced1); // Turquoise for Uranus
            break;
        case "Neptune":
            addAtmosphere(planet, 0x4682b4); // Steel blue for Neptune
            break;
    }

    // Example for adding a moon to Earth
    if (planet.name === "Earth") {
        const moonGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        planetGroup.add(moon);

        // Initial position of the moon
        moon.position.set(planet.size + 2, 0, 0);

        // Store moon orbit angle
        planet.moonOrbitAngle = 0;
        planet.moon = moon;
    }

    // Add rings if needed
    if (planet.name === "Saturn") {
        addRings(planetGroup, 'images/saturn ring.png', planet.size * 1.2, planet.size * 1.8);
    } else if (planet.name === "Uranus") {
        addRings(planetGroup, 'images/uranus ring.png', planet.size * 1.2, planet.size * 1.5);
    }
});


// Orbit Controls for zoom and pan functionality
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 30;
controls.maxDistance = 250;

// Raycaster setup for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', event => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true); // 'true' to check descendants

    if (intersects.length > 0) {
        const selectedObject = intersects.find(intersect => intersect.object.userData && intersect.object.userData.name);
        if (selectedObject) {
            document.body.style.cursor = 'pointer'; // Show pointer on hover
        } else {
            document.body.style.cursor = 'default'; // Reset to default when not on a planet
        }
    } else {
        document.body.style.cursor = 'default';
    }
});

window.addEventListener('click', event => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const clickedObject = intersects.find(intersect => intersect.object.userData && intersect.object.userData.name);
        if (clickedObject) {
            const planetName = clickedObject.object.userData.name;

            // Show the modal corresponding to the clicked planet
            switch (planetName) {
                case "Sun":
                    showModal("sunModal");
                    break;
                case "Mercury":
                    showModal("mercuryModal");
                    break;
                case "Venus":
                    showModal("venusModal");
                    break;
                case "Earth":
                    showModal("earthModal");
                    break;
                case "Mars":
                    showModal("marsModal");
                    break;
                case "Jupiter":
                    showModal("jupiterModal");
                    break;
                case "Saturn":
                    showModal("saturnModal");
                    break;
                case "Uranus":
                    showModal("uranusModal");
                    break;
                case "Neptune":
                    showModal("neptuneModal");
                    break;
                default:
                    break;
            }
        }
    }
});


// Function to add orbit paths
function addOrbitPath(distance) {
    const orbitGeometry = new THREE.RingGeometry(distance - 0.1, distance + 0.1, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
}
planets.forEach(planet => addOrbitPath(planet.distance));

// Star field with dynamic twinkling
function addStarField() {
    const stars = [];
    for (let i = 0; i < 10000; i++) {
        const starGeometry = new THREE.SphereGeometry(0.1, 24, 24);
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
        stars.push(star);
        scene.add(star);
    }
    function animateStars() {
        requestAnimationFrame(animateStars);
        stars.forEach(star => {
            star.material.opacity = 0.5 + Math.random() * 0.5;
        });
    }
    animateStars();
}
addStarField();

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
    }
}
// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (!isPaused) {
        planets.forEach(planet => {
            // Update orbital rotation (around the sun)
            planet.angle += planet.speed;
            planet.group.position.x = planet.distance * Math.cos(planet.angle);
            planet.group.position.z = planet.distance * Math.sin(planet.angle);

            // Rotate the planet on its axis
            planet.mesh.rotation.y += planet.rotationSpeed; // Axis rotation for day-night effect

            // Rotate the moon around the Earth (if it's Earth)
            if (planet.moon) {
                planet.moonOrbitAngle += 0.02;
                planet.moon.position.x = (planet.size + 2) * Math.cos(planet.moonOrbitAngle);
                planet.moon.position.z = (planet.size + 2) * Math.sin(planet.moonOrbitAngle);
            }
        });
    }
    controls.update();
    renderer.render(scene, camera);
}
animate()
// Function to create and animate a meteor
// Function to create and animate a larger meteor with a glow effect
function createMeteor() {
    const meteorSize = 1; // Larger size for better visibility
    const meteorGeometry = new THREE.SphereGeometry(meteorSize, 16, 16); // Increased size and detail
    const meteorMaterial = new THREE.MeshBasicMaterial({ color: 0xff4500 }); // Orange-red color for meteor
    const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);

    // Set initial position for the meteor (off-screen at a random position)
    meteor.position.set(
        Math.random() * 1000 - 500,
        Math.random() * 500 - 250,
        Math.random() * 1000 - 500
    );

    scene.add(meteor);

    // Add a glow effect for each meteor
    const glowGeometry = new THREE.SphereGeometry(meteorSize * 1.5, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd700, // Golden glow color
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    const meteorGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    meteor.add(meteorGlow); // Add glow as a child of the meteor

    // Animate the meteor moving across the scene
    const targetX = meteor.position.x + Math.random() * 1000 - 500;
    const targetY = meteor.position.y + Math.random() * 500 - 250;
    const targetZ = meteor.position.z - 1000;

    // Use GSAP for smooth animation
    gsap.to(meteor.position, {
        x: targetX,
        y: targetY,
        z: targetZ,
        duration: 3 + Math.random() * 2, // Randomize duration slightly
        ease: "power2.out",
        onComplete: () => {
            scene.remove(meteor); // Remove meteor after animation
        }
    });
}


// Function to start a meteor shower
function startMeteorShower() {
    for (let i = 0; i < 50; i++) { // Generate multiple meteors
        setTimeout(createMeteor, i * 100); // Stagger creation for shower effect
    }
}

// Attach the button event listener to start the meteor shower
document.getElementById("meteorShowerButton").addEventListener("click", startMeteorShower);


// Adjust renderer on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Expose pause and resume functions for HTML buttons
window.pauseAnimation = pauseAnimation;
window.resumeAnimation = resumeAnimation;
