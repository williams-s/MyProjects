document.addEventListener("DOMContentLoaded", function () {
    const databasesSelect = document.getElementById("database-select");    

    function getDatabases() {
        fetch("OtherRequests.php")
            .then((response) => response.json())
            .then((data) => {
                data.forEach((database) => {
                    console.log(database);
                    const option = document.createElement("option");
                    option.value = database;
                    option.textContent = database;
                    databasesSelect.appendChild(option);
                });
            })
            .catch((error) => console.error("Error:", error));  
    }

    getDatabases();
});