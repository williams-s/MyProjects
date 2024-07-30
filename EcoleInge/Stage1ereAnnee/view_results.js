document.addEventListener('DOMContentLoaded', () => {
    // Récupérer les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const filePath = urlParams.get('filePath');
    if (filePath) {
        const canvasImage = document.getElementById('canvas-image');
        if (canvasImage) {
            canvasImage.src = filePath;
        }
    }

    // Récupérer l'élément pour afficher les résultats
    const results_players = document.querySelector('.results-players');

    // Fonction pour obtenir les dessins
    function getDrawings() {
        fetch('getDrawings.php')
        .then(response => response.json())
        .then(data => {
            // Effacer le contenu existant de results_players avant d'ajouter de nouvelles images
            results_players.innerHTML = '';

            data.forEach(user => {
                let img = document.createElement('img');
                let borderDrawing = document.createElement('div');
                borderDrawing.classList.add('border-drawing');
                img.src = user.photo_url;
                // Utilisez une classe pour cibler les images générées dynamiquement
                img.classList.add('dynamic-image');

                let user_name = document.createElement('h1');
                user_name.textContent = user.username;

                borderDrawing.appendChild(img);
                borderDrawing.appendChild(user_name);
                results_players.appendChild(borderDrawing);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    // Appel initial à la fonction getDrawings()
    getDrawings();

    // Rafraîchissement automatique toutes les 5 secondes
    setInterval(getDrawings, 5000);

    // Ajout d'un écouteur d'événement pour supprimer toutes les images
    const deleteAllButton = document.getElementById('btn-deleteAll');
    if (deleteAllButton) {
        deleteAllButton.addEventListener('click', () => {
            fetch('delete.php', {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                results_players.innerHTML = '';
                alert('Toutes les images ont été supprimées');
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Ajout d'un écouteur d'événement pour démarrer le compteur
    
    const showBtn = document.getElementById('btn-showAnswers');
    if (showBtn) {
        showBtn.addEventListener('click', () => {
            const results_players = document.querySelector('.results-players');
            if (results_players) {
                results_players.style.display = 'block';
            }
        });
    }

});
