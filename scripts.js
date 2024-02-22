var canvas = document.querySelector('canvas');

canvas.width = 400;
canvas.height = 400;

var ctx = canvas.getContext('2d');

class PlayerPosition {
    constructor (x, z, angle) {
        this.x = x;
        this.z = z;
        this.angle = angle;
    }
    move(dx, dz, angle) {
        this.x += dx;
        this.z += dz;
        this.angle += angle;
    }
}

const player = new PlayerPosition(0,0,0);

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

const projectedVertices = JSON.parse(JSON.stringify(vertices));

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

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rotate the cube
    rotateX(player.z);
    rotateY(player.x);

    for (const face of faces) {
        const point0 = project(projectedVertices[face[0]]);
        const point1 = project(projectedVertices[face[1]]);
        const point2 = project(projectedVertices[face[2]]);
        const point3 = project(projectedVertices[face[3]]);

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
        const start = project(projectedVertices[edge[0]]);
        const end = project(projectedVertices[edge[1]]);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
    }
    ctx.lineWidth = 2;
    ctx.stroke();
}

function rotateX(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    for (let i = 0; i < vertices.length; i++) {
        const y = vertices[i].y;
        projectedVertices[i].y = cos * y - sin * vertices[i].z;
        projectedVertices[i].z = sin * y + cos * vertices[i].z;
    }
}

function rotateY(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    for (let i = 0; i < vertices.length; i++) {
        const x = vertices[i].x;
        projectedVertices[i].x = cos * x + sin * vertices[i].z;
        projectedVertices[i].z = -sin * x + cos * vertices[i].z;
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
    draw();
    requestAnimationFrame(animate);
}

animate();

const playerSpeed = 0.1;

function handleKeyPress(event) {
    switch (event.key) {
        case 'w':
            player.move(0, -playerSpeed, 0);
            break;
        case 's':
            player.move(0, playerSpeed, 0);
            break;
        case 'a':
            player.move(-playerSpeed, 0, 0);
            break;
        case 'd':
            player.move(playerSpeed, 0, 0);
            break;
        case 'ArrowLeft':
            player.move(0, 0, -playerSpeed);
            break;
        case 'ArrowRight':
            player.move(0, 0, playerSpeed);
            break;
    }
}

document.addEventListener('keydown', handleKeyPress);