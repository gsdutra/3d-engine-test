var canvas = document.querySelector('canvas');

canvas.width = 400;
canvas.height = 400;

var ctx = canvas.getContext('2d');

// Cube vertices
const vertices = [
    { x: -25, y: -25, z: -25 },
    { x: 25, y: -25, z: -25 },
    { x: 25, y: 25, z: -25 },
    { x: -25, y: 25, z: -25 },
    { x: -25, y: -25, z: 25 },
    { x: 25, y: -25, z: 25 },
    { x: 25, y: 25, z: 25 },
    { x: -25, y: 25, z: 25 }
];

// Connect the vertices to form edges
const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
];

const faces = [
    [0, 4, 7, 3, 'rgba(255, 0, 0, 0.5)'],
    [1, 2, 6, 5, 'rgba(255, 0, 255, 0.5)'],
    [0, 1, 5, 4, 'rgba(255, 255, 0, 0.5)'],
    [2, 3, 7, 6, 'rgba(0, 255, 0, 0.5)'],
    [0, 1, 2, 3, 'rgba(0, 0, 255, 0.5)'],
    [4, 5, 6, 7, 'rgba(0, 255, 255, 0.5)']
];

// Initial rotation angles
let angleX = 0;
let angleY = 0;

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rotate the cube
    rotateX(angleX);
    rotateY(angleY);

    for (const face of faces) {
        const point0 = project(vertices[face[0]]);
        const point1 = project(vertices[face[1]]);
        const point2 = project(vertices[face[2]]);
        const point3 = project(vertices[face[3]]);

        ctx.beginPath();
        ctx.moveTo(point0.x, point0.y);
        ctx.lineTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.lineTo(point3.x, point3.y);
        ctx.closePath();

        ctx.fillStyle = face[4];
        ctx.fill();
    }

    ctx.beginPath();
    for (const edge of edges) {
        const start = project(vertices[edge[0]]);
        const end = project(vertices[edge[1]]);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
    }
    ctx.lineWidth = 2;
    ctx.stroke();
}

function rotateX(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    for (const vertex of vertices) {
        const y = vertex.y;
        vertex.y = cos * y - sin * vertex.z;
        vertex.z = sin * y + cos * vertex.z;
    }
}

function rotateY(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    for (const vertex of vertices) {
        const x = vertex.x;
        vertex.x = cos * x + sin * vertex.z;
        vertex.z = -sin * x + cos * vertex.z;
    }
}

function project(vertex) {
    // Simple perspective projection
    const scale = 2;
    const depth = 50;
    return {
        x: vertex.x * scale + canvas.width / 2,
        y: vertex.y * scale + canvas.height / 2 - vertex.z * scale + depth
    };
}

function animate() {
    angleX += 0.00002;
    angleY += 0.00001;
    draw();
    requestAnimationFrame(animate);
}

animate();