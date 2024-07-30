const questionContainer = document.querySelector(".box");
const btns = Array.from(questionContainer.querySelectorAll('button'));
const reponse = questionContainer.querySelector('p');
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', () => {
        if (btns[i].textContent === "Paris") {
            reponse.textContent = "Correct !";  
            reponse.style.backgroundColor = "green";
        } else {
            reponse.textContent = "Incorrect !, la réponse est Paris";
            reponse.style.backgroundColor = "red";
        }
        questionContainer.classList.toggle('responseBox');
        reponse.style.visibility = "visible";
    });
}

function fetchData() {
    fetch('index.php')
        .then(response => response.json())
        .then(data => {
            let tableBody = document.getElementById('todo-table-body');
            tableBody.innerHTML = ''; // Effacer les anciennes données
            data.forEach(todo => {
                let row = document.createElement('tr');
                row.innerHTML = `
                    <td>${todo.item_id}</td>
                    <td>${todo.content}</td>
                    <td><button class="btn-delete" onclick="deleteTodo(${todo.item_id})">Supprimer</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erreur:', error));
}

const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function(event) {
    // Empêcher le comportement par défaut du formulaire (rechargement de page)
    event.preventDefault();

    // Récupérer les données du formulaire
    const name = new FormData(myForm);

    fetch('get.php', {
        method: 'POST',
        body: name
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la requête');
        }
        return response.text(); 
    })
    .then(data => {
        console.log('Réponse reçue:', data);
        fetchData();
        myForm.reset();
    })
    .catch(error => {
        console.error('Erreur:', error);
    }); 
});


function deleteTodo(item_id) {
    if (confirm('Voulez-vous supprimer cette tâche ?')) {
        fetch(`delete.php?id=${item_id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la requête');
            }
            return response.text();
        })
        .then(data => {
            console.log('Réponse reçue:', data);
            fetchData(); // Mettre à jour les données après la suppression
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }
}


// Appeler fetchData lorsque la page est chargée
window.onload = fetchData;
