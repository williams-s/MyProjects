const test = "yatatatatatatata";
let databaseLang = "";
let myAlerts = "";

const usersBtn = document.getElementById('users');
const authentificationBtn = document.getElementById('authentification');
const databaseBtn = document.getElementById('database');
const descriptionBtn = document.getElementById('description-button');

const usersTitle = document.querySelector('#users-container h1');
const addUserBtn = document.getElementById('add-user');
const searchBar = document.getElementById('search-bar');

const authentificationTitle = document.querySelector('#login h1');
const keyLabel = document.getElementById('keyLabel');
const key = document.getElementById('key');
const loginLabel = document.getElementById('loginLabel');
const login = document.getElementById('username');
const passwordLabel = document.getElementById('passwordLabel');
const password = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');


const descriptionTitle = document.querySelector('#description h1');
const nameLabel = document.getElementById('nameLabel');
const nameZ = document.getElementById('name');
const firstnameLabel = document.getElementById('firstnameLabel');
const firstname = document.getElementById('firstname');
const serviceLabel = document.getElementById('serviceLabel');
const service = document.getElementById('service');
const descriptionSubmit = document.getElementById('description-submit');

const databaseTitle = document.querySelector('#database-container h1');
const currentRights = document.querySelector('.database-available-container h1');
const addRight = document.getElementById('add-database');
const databaseLabel = document.getElementById('databaseLabel');
const rightsLabel = document.getElementById('rightsLabel');
const perimeterLabel = document.getElementById('perimeterLabel');
const admin = document.getElementById('admin');
const dataModification = document.getElementById('data-modification');
const viewerOnly = document.getElementById('viewer-only');
const noChange = document.getElementById('no-change');
const dataBaseSubmit = document.getElementById('database-submit');

const englishBtn = document.getElementById('english');
const frenchBtn = document.getElementById('french');
const dutchBtn = document.getElementById('dutch');
const spanishBtn = document.getElementById('spanish');
const germanBtn = document.getElementById('german');
const italianBtn = document.getElementById('italian');

const thDatabase = document.getElementById('thDatabase');
const thRight = document.getElementById('thRight');
const thPerimeter = document.getElementById('thPerimeter');
const thEdit = document.getElementById('thEdit');
const thDelete = document.getElementById('thDelete');

/* const mySql = document.getElementById('mySql');
const pSql = document.getElementById('postgreSQL'); */

englishBtn.style.backgroundImage = "url('images/uk.png')";
frenchBtn.style.backgroundImage = "url('images/france.png')";
dutchBtn.style.backgroundImage = "url('images/netherlands.png')";
spanishBtn.style.backgroundImage = "url('images/spain.png')";
germanBtn.style.backgroundImage = "url('images/germany.png')";
italianBtn.style.backgroundImage = "url('images/italy.png')";

englishBtn.addEventListener("click", () => {
    setLang("English");
});
frenchBtn.addEventListener("click", () => {
    setLang("fr");
});
dutchBtn.addEventListener("click", () => {
    setLang("nl");
});
spanishBtn.addEventListener("click", () => {
    setLang("es");
});
germanBtn.addEventListener("click", () => {
    setLang("de");
});
italianBtn.addEventListener("click", () => {
    setLang("it");
});

/* mySql.addEventListener("click", () => {
    setLangSql("MySQL");
});

pSql.addEventListener("click", () => {
    setLangSql("PostgreSQL");
});
 */

setLang("English");

function setLang(language) {
    let tmpBody = null;
    if (language === "English") {
        tmpBody = JSON.stringify({
            lang: language
        });
    
    } else {
        tmpBody = JSON.stringify({
            target: language
        });
    }
    console.log(tmpBody);
    fetch("languages.php", {
        method: "POST",
        body: tmpBody,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((response) => response.json())
        .then((data) => {
            let menu = data.menu;
            usersBtn.textContent = menu.users;
            authentificationBtn.textContent = menu.authentication;
            databaseBtn.textContent = menu.rights;
            descriptionBtn.textContent = menu.description;

            let users = data.users;
            usersTitle.textContent = users.title;
            addUserBtn.textContent = users.add;
            searchBar.placeholder = users.search;

            let authentification = data.authentication;
            authentificationTitle.textContent = authentification.title;
            keyLabel.textContent = authentification.key;
            loginLabel.textContent = authentification.login;
            passwordLabel.textContent = authentification.password;
            key.placeholder = authentification.key;
            login.placeholder = authentification.login;
            password.placeholder = authentification.password;

            let description = data.description;
            descriptionTitle.textContent = description.title;
            nameLabel.textContent = description.name;
            firstnameLabel.textContent = description.firstname;
            serviceLabel.textContent = description.service;
            nameZ.placeholder = description.name;
            firstname.placeholder = description.firstname;
            service.placeholder = description.service;

            let rights = data.rights;
            databaseTitle.textContent = rights.title;
            currentRights.textContent = rights.currentRights;
            addRight.textContent = rights.addRight;
            databaseLabel.textContent = rights.database;
            rightsLabel.textContent = rights.rights;
            perimeterLabel.textContent = rights.perimeter;
            admin.textContent = rights.admin;
            dataModification.textContent = rights.dataModification;
            viewerOnly.textContent = rights.viewerOnly;
            noChange.textContent = rights.noChange;
            if (dataBaseSubmit.id === "add-database") {
                dataBaseSubmit.textContent = rights.add;
            }
            else {
                dataBaseSubmit.textContent = rights.edit;
            }
            
            thDatabase.textContent = rights.database;
            thRight.textContent = rights.rights;
            thPerimeter.textContent = rights.perimeter;
            thEdit.textContent = rights.editTh;
            thDelete.textContent = rights.deleteTh;
            databaseLang = rights;

            myAlerts = data.alert;


        })
        .catch((error) => console.error("Error:", error));


}


/* function setLangSql(language) {
    fetch("changeDatabaseLang.php", {
        method: "POST",
        body: JSON.stringify({
            language: language
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success === 1){
                alert(myAlerts.databaseLanguageChanged);
            }
            else {
                alert(myAlerts.databaseLanguageNotChanged);
            }
            location.reload(true);
        })
        .catch((error) => console.error("Error:", error));
} */