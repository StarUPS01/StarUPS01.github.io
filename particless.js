// Initialize particles.js
tsParticles.load('particles-js', {
    particles: {
        number: {
            value: 50,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: "#ffffff"
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            }
        },
        opacity: {
            value: 0.7,
            random: false
        },
        size: {
            value: 4,
            random: true
        },
        links: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.5,
            width: 1
        },
        move: {
            enable: true,
            speed: 2.5,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        events: {
            onhover: {
                enable: true,
                mode: "grab"
            },
            onclick: {
                enable: false
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 150,
                line_linked: {
                    opacity: 1
                }
            }
        }
    },
    retina_detect: true
});


// Web-shooter effect
let lastMousePosition = { x: 0, y: 0 };
let mouseIsMoving = false;

// Get all images on the page
const images = document.querySelectorAll('img');

document.addEventListener('mousemove', (event) => {
    mouseIsMoving = true;
    lastMousePosition.x = event.clientX;
    lastMousePosition.y = event.clientY;

    setTimeout(() => {
        mouseIsMoving = false;
    }, 500); // Detect if the mouse stops moving for 500ms
});

setInterval(() => {
    if (!mouseIsMoving) {
        // Check if the mouse is over an image
        let mouseOverImage = false;
        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (lastMousePosition.x >= rect.left && lastMousePosition.x <= rect.right &&
                lastMousePosition.y >= rect.top && lastMousePosition.y <= rect.bottom) {
                mouseOverImage = true;
            }
        });

        if (!mouseOverImage) {
            // Shoot particles towards the cursor if not over an image
            const particles = tsParticles.domItem(0).particles.array;

            particles.forEach(particle => {
                const dx = lastMousePosition.x - particle.position.x;
                const dy = lastMousePosition.y - particle.position.y;
                const angle = Math.atan2(dy, dx);
                const speed = 4; // Speed of the particles moving towards the cursor

                particle.velocity.horizontal = Math.cos(angle) * speed;
                particle.velocity.vertical = Math.sin(angle) * speed;
            });
        }
    }
}, 50); // Check every 50ms
