const myCanvas = document.getElementById('canvas');
const ctx = myCanvas.getContext('2d');

myCanvas.width = window.innerWidth *3/4;
myCanvas.height = window.innerHeight *7/8;

let posX = 0
let posY = 0;
let drawing = false;


myCanvas.addEventListener('mousedown', (e) => {
    init(e);
    drawing = true;
});
myCanvas.addEventListener('mouseup', () => {
    drawing = false;
});
myCanvas.addEventListener('mousemove', (e) => {
    draw(e)
});

function init(e) {
    posX = e.offsetX;
    posY = e.offsetY;
}

function draw(e) {
    if (drawing) {
        ctx.beginPath();
        ctx.moveTo(posX, posY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.closePath();
        posX = e.offsetX;
        posY = e.offsetY; 
    }
}


const clearBtn = document.getElementById('btn-clear');
const blueBtn = document.getElementById('btn-blue');
const greenBtn = document.getElementById('btn-green');
const redBtn = document.getElementById('btn-red');
const blackBtn = document.getElementById('btn-black');
const orangeBtn = document.getElementById('btn-orange');
const purpleBtn = document.getElementById('btn-purple');
const yellowBtn = document.getElementById('btn-yellow');
const eraseBtn = document.getElementById('btn-erase');
const colorInput = document.getElementById('color-picker');
const brushSize = document.getElementById('brush-size');
eraseBtn.addEventListener('click', () => {
    ctx.strokeStyle = 'white';
    colorInput.value = '#FFFFFF';    
})
blackBtn.addEventListener('click', () => {
    ctx.strokeStyle = 'black';
    colorInput.value = '#000000';
})
greenBtn.addEventListener('click', () => {
    ctx.strokeStyle = 'green';
    colorInput.value = '#00FF00';
})
redBtn.addEventListener('click', () => {
    ctx.strokeStyle = 'red';
    colorInput.value = '#FF0000';
})
orangeBtn.addEventListener('click', () => {
    ctx.strokeStyle = 'orange';
    colorInput.value = '#FFA500';
})
purpleBtn.addEventListener('click', () => {
    ctx.strokeStyle = 'purple';
    colorInput.value = '#800080';
})
yellowBtn.addEventListener('click', () => {
    ctx.strokeStyle = 'yellow';
    colorInput.value = '#FFFF00';
})
blueBtn.addEventListener('click', () => {
    ctx.strokeStyle = 'blue';
    colorInput.value = '#0000FF';
})
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

})
colorInput.addEventListener('change', (e) => {
    ctx.strokeStyle = e.target.value;
})
brushSize.addEventListener('change', (e) => {
    ctx.lineWidth = e.target.value;
})

const sendBtn = document.getElementById('btn-send');
sendBtn.addEventListener('click', () => {
    const dataURL = myCanvas.toDataURL('image/png');
    const name = document.getElementById('text-input').value;
    fetch('save_canvas.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            image: dataURL,
            name: name 
        })
    })
    .then(response => {
        return response.text(); // Lire la réponse en tant que texte pour déboguer
    })
    .then(data => {
        try {
            const json = JSON.parse(data);
            if (json.filePath) {
                // Rediriger vers la page d'affichage de l'image
                console.log("Envoi reussi");
                ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
                //window.location.href = `view_image.html?filePath=${json.filePath}`;
            } else {
                console.error('Erreur:', json.error);
            }
        } catch (e) {
            console.error('Réponse du serveur non valide:', data); // Afficher la réponse du serveur
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
});
