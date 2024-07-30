document.addEventListener("DOMContentLoaded", function () {
  const users = document.getElementById("users");
  const authentification = document.getElementById("authentification");
  const descriptionBtn = document.getElementById("description-button");
  const database = document.getElementById("database");
  const usersContainerOl = document.getElementById("users-container-ol");
  const usersContainer = document.getElementById("users-container");
  const login = document.getElementById("login");
  const description = document.getElementById("description");
  const loginBtn = document.getElementById("login-btn");
  const descriptionSubmit = document.getElementById("description-submit");
  const databaseContainer = document.getElementById("database-container");
  //const showDatabasesBtn = document.getElementById("show-databases-btn");
  const elements = [usersContainer, login, description, databaseContainer];
  const usernameSelected = document.querySelectorAll("[id=usernameSelected]");
  const keyText = document.getElementById("key");
  const btnAddDatabase = document.getElementById("add-database");
  btnAddDatabase.classList.add("btnAddDatabase");
  let newUserBool = false;
  //console.log(usernameSelected);
  const dataBase_Submit = document.getElementById("database-submit");

  const nameValue = document.getElementById("name");
  const firstNameValue = document.getElementById("firstname");
  const serviceValue = document.getElementById("service");
  const usernameValue = document.getElementById("username");
  const passwordValue = document.getElementById("password");

  let usVal = null;
  let passVal = null;
  let firstVal = null;
  let nameVal = null;
  let serviceVal = null;

  const databasesAvailablez = document.getElementById(
    "database-available-container"
  );

  let userSelectedId = null;
  let userSelectedName = null;
  let createNewDatabaseRights = true;
  let onlyGoodOptions = [];

  authentification.addEventListener("click", function () {
    swapContainer(login, authentification);
    databasesAvailablez.style.display = "none";
  });

  users.addEventListener("click", function () {
    getUsers();
    swapContainer(usersContainer, users);
    userSelectedId = null;
    userSelectedName = null;
    createNewDatabaseRights = true;
    onlyGoodOptions = [];
    databasesAvailablez.style.display = "none";
  });

  descriptionBtn.addEventListener("click", function () {
    swapContainer(description, descriptionBtn);
    databasesAvailablez.style.display = "none";
  });

  database.addEventListener("click", function () {
    swapContainer(databaseContainer, database);
    if (userSelectedName !== null) {
      databasesAvailablez.style.display = "block";
    }
  });

  function getUsers() {
    usersContainerOl.innerHTML = "";
    fetch("getInfos.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.success.forEach((user) => {
          let listItem = document.createElement("li");
          let button = document.createElement("button");
          let deletebtn = document.createElement("button");
          deletebtn.style.backgroundImage = "url('images/delete.png')";
          deletebtn.id = "delete-user";
          let keyId = user.unique_id;

          button.textContent = user.nom;

          button.classList.add("action-button");
          button.setAttribute("data-id", user.id);
          button.addEventListener("click", () => {
            putBtnNextText();
            resetFields();
            userSelectedId = button.getAttribute("data-id");
            userSelectedName = button.textContent;
            keyText.value = keyId;
            nameValue.value = user.name;
            nameVal = nameValue.value;
            console.log(nameValue.value);
            firstNameValue.value = user.firstname;
            firstVal = firstNameValue.value;
            console.log(firstNameValue.value);
            serviceValue.value = user.service;
            serviceVal = serviceValue.value;
            console.log(serviceValue.value);
            usernameValue.value = user.nom;
            usVal = usernameValue.value;
            console.log(usernameValue);
            passwordValue.value = user.password;
            passVal = passwordValue.value;
            console.log(passwordValue);
            console.log(keyText.value);
            //console.log(userSelectedId);
            usernameSelected.forEach((username) => {
              username.textContent = "Username : " + userSelectedName;
            });
            swapContainer(login, authentification);
            getDatabasesRights();
            databasesAvailablez.style.display = "none";
          });

          deletebtn.addEventListener("click", () => {
            let met = "DELETE";
            let tmp = JSON.stringify({
              id: user.id,
            });
            fetch("authentification.php", {
              method: met,
              headers: {
                "Content-Type": "application/json",
              },
              body: tmp,
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                console.log(data.success);
                if (!data.success) {
                  alert(myAlerts.userNotDeleted);
                } else {
                  alert(myAlerts.userDeleted);
                  location.reload(true);
                }
              })
              .catch((error) => console.error("Error:", error));
          });
          listItem.appendChild(button);
          listItem.appendChild(deletebtn);
          usersContainerOl.appendChild(listItem);
          usersContainer.appendChild(usersContainerOl);
          let loginName = document.getElementById("username");
          loginName.value = userSelectedName;
        });
      })
      .catch((error) => console.error("Error:", error));
    /* let btnName = document.querySelectorAll(".action-button");
      for(let i = 0; i < btnName.length; i++){
        console.log(btnName[i]);
        btnName[i].addEventListener("click", function(){
          userSelectedId = btnName[i].getAttribute("data-id");
          console.log(userSelectedId);
          usersContainer.style.display = "none";
          login.style.display = "block";
        })
      } */
  }

  loginBtn.addEventListener("click", function () {
    let newusernameValue = document.getElementById("username").value;
    let newpasswordValue = document.getElementById("password").value;
    console.log(usVal);
    console.log(passVal);
    if (userSelectedName !== null) {
      if (newusernameValue !== usVal || newpasswordValue !== passVal) {
        let met = "PUT";
        let msg = myAlerts.loginChanged;
        let tmp = JSON.stringify({
          nom: newusernameValue,
          password: newpasswordValue,
          id: userSelectedId,
        });

        console.log(tmp);
        fetch("authentification.php", {
          method: met,
          headers: {
            "Content-Type": "application/json",
          },
          body: tmp,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            console.log(data.success);
            if (!data.success) {
              alert(myAlerts.authenticationFailed);
            } else {
              alert(msg);
              swapContainer(description, descriptionBtn);
            }
          })
          .catch((error) => console.error("Error:", error));
      }
    }
      swapContainer(description, descriptionBtn);
  });

  descriptionSubmit.addEventListener("click", function () {
    let newNameValue = document.getElementById("name").value;
    let newFirstNameValue = document.getElementById("firstname").value;
    let newServiceValue = document.getElementById("service").value;
    if (userSelectedName !== null) {
      if (
        newNameValue !== nameVal ||
        newFirstNameValue !== firstVal ||
        newServiceValue !== serviceVal
      ) {
        let met = "PUT";
        let msg = myAlerts.descriptionChanged;
        let tmp = JSON.stringify({
          name: newNameValue,
          firstname: newFirstNameValue,
          service: newServiceValue,
          id: userSelectedId,
        });
        fetch("authentification.php", {
          method: met,
          headers: {
            "Content-Type": "application/json",
          },
          body: tmp,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            console.log(data.success);
            if (!data.success) {
              alert(myAlerts.descriptionFailed);
            } else {
              alert(msg);
              swapContainer(databaseContainer, database);
              databasesAvailablez.style.display = "block";
            }
          })
          .catch((error) => console.error("Error:", error));
      }
    }
      swapContainer(databaseContainer, database);
      databasesAvailablez.style.display = "block";
  });

  getUsers();
  resetColorBtnMenu(users);

  function resetColorBtnMenu(btnSelect) {
    let menu = document.querySelectorAll(".menu button");
    //console.log(menu);
    menu.forEach((button) => {
      button.style.background = "";
    });
    btnSelect.style.background = "rgb(184, 255, 188)";
  }

  function swapContainer(container, btn) {
    if (userSelectedName == null && newUserBool == false) {
      console.log(newUserBool);
      alert(myAlerts.noUserSelected);
    } else {
      for (let i = 0; i < elements.length; i++) {
        if (elements[i] === container) {
          //console.log(elements[i] + " == " + login);
          elements[i].style.display = "block";
          resetColorBtnMenu(btn);
        } else {
          elements[i].style.display = "none";
        }
      }
    }
  }

  const searchBar = document.getElementById("search-bar");

  searchBar.addEventListener("input", () => {
    const searchTerm = searchBar.value.toLowerCase();
    const listItems = document.querySelectorAll(
      "#users-container-ol li button"
    );
    listItems.forEach((listItem) => {
      const text = listItem.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        listItem.parentElement.classList.remove("hidden");
      } else {
        listItem.parentElement.classList.add("hidden");
      }
    });
  });

  const addUserBtn = document.getElementById("add-user");
  const submitDataBtn = document.getElementById("database-submit");

  addUserBtn.addEventListener("click", () => {
    putBtnNextText();
    resetFields();
    newUserBool = true;
    console.log("test");
    console.log(addUserBtn);
    swapContainer(login, authentification);
  });

  submitDataBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("firstname").value;
    const name = document.getElementById("name").value;
    const service = document.getElementById("service").value;
    const databseSelect = document.getElementById("database-select").value;
    const userRights = document.getElementById("user-rights").value;
    const userPerimeter = document.getElementById("user-perimeter").value;
    const select = document.querySelectorAll(".form-control");
    for (let i = 0; i < select.length; i++) {
      if (select[i].selectedIndex == 0) {
        alert(myAlerts.emptyField);
        return;
      }
    }
    newUserBool = false;

    if (userSelectedName == null && userSelectedId == null) {
      console.log("POST");
      console.log(username, password, firstName, name, service);
      fetch("authentification.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: username,
          password: password,
          firstname: firstName,
          name: name,
          service: service,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("ici");
          console.log(data);
          if (data.success != -1) {
            console.log(data.success);
            userSelectedId = data.success;
            fetch("databaseRights.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id_user: userSelectedId,
                database_name: databseSelect,
                rights: userRights,
                perimeter: userPerimeter,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("ici");
                console.log(data);
                if (data.success != -1) {
                  console.log(data.success);
                  alert(myAlerts.rightAdded);
                } else {
                  alert(myAlerts.rightNotAdded);
                }
              })
              .catch((error) => console.error("Error:", error));
          } else {
            alert(myAlerts.userNotAdded);
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      console.log("PUT");
      fetch("authentification.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: username,
          password: password,
          firstname: firstName,
          name: name,
          service: service,
          id: userSelectedId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("hey " + data.success);
          if (data.success) {
            let methodValue = "PUT";
            if (createNewDatabaseRights) {
              methodValue = "POST";
            }
            fetch("databaseRights.php", {
              method: methodValue,
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id_user: userSelectedId,
                database_name: databseSelect,
                rights: userRights,
                perimeter: userPerimeter,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("ici");
                console.log(data);
                console.log(createNewDatabaseRights);
                if (data.success) {
                  alert(myAlerts.rightAdded);
                } else {
                  alert(myAlerts.rightNotAdded);
                }
              });
          } else {
            alert(myAlerts.userNotAdded);
          }
          console.log(data.success);
          console.log(data);
        })
        .catch((error) => console.error("Error:", error));
    }

    setTimeout(() => {
      //location.reload(true);
      getDatabasesRights();
      databasesAvailablez.style.display = "block";
    }, 1000);
  });


  const relations = document.querySelector("#database-available-table-body");
  function getDatabasesRights() {
    onlyGoodOptions = [];
    console.log("relations : " + relations);
    fetch("getInfos.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "database_rights",
        id_user: userSelectedId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        relations.innerHTML = "";
        console.log(data.success);
        btnAddDatabase.classList.add("btnAddDatabase");
        data.success.forEach((info) => {
          const tr = document.createElement("tr");
          const tdDatabase = document.createElement("td");
          const tdRights = document.createElement("td");
          const tdPerimeter = document.createElement("td");
          const tdSelect = document.createElement("td");
          const tdDelete = document.createElement("td");
          const btn = document.createElement("button");
          const deletebtn = document.createElement("button");
          let infodata = info.database_name;
          tdDatabase.textContent = infodata;
          onlyGoodOptions.push(infodata);
          console.log("onlyGoodOptions : " + onlyGoodOptions);
          let rightsdata = info.rights;
          tdRights.textContent = rightsdata;
          let perimeterdata = info.perimeter;
          tdPerimeter.textContent = perimeterdata;
          let datas = [infodata, rightsdata, perimeterdata];
          //btn.textContent = infodata + " - " + rightsdata + " - " + perimeterdata;
          btn.style.backgroundImage = "url('images/edit.png')";
          deletebtn.style.backgroundImage = "url('images/delete.png')";
          deletebtn.addEventListener("click", () => {
            fetch("databaseRights.php", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id_user: userSelectedId,
                database_name: infodata,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  alert(myAlerts.rightDeleted);
                  getDatabasesRights();
                } else {
                  alert(myAlerts.rightNotDeleted);
                }
                setTimeout(() => {

                }, 1000);
                console.log("uifhiuehuiz");
                swapContainer(databaseContainer, database);
              })
              .catch((error) => console.error("Error:", error));
          });
          btn.id = "select-database-available";
          deletebtn.id = "select-database-available";
          tdSelect.appendChild(btn);
          tdDelete.appendChild(deletebtn);
          tr.appendChild(tdDatabase);
          tr.appendChild(tdRights);
          tr.appendChild(tdPerimeter);
          btn.addEventListener("click", () => {
            dataBase_Submit.textContent = databaseLang.edit;
            dataBase_Submit.id = "edit-database";
            const select = document.querySelectorAll(".form-control");
            for (let i = 0; i < select.length; i++) {
              select[i].value = datas[i];
            }
            const options = select[0].querySelectorAll("option");
            options.forEach((option) => {
              console.log(option.value + " == " + select[0].value);
              if (option.value !== select[0].value) {
                option.disabled = true;
              } else {
                option.disabled = false;
              }
            });
            createNewDatabaseRights = false;
          });
          //li.appendChild(btn);
          //relations.appendChild(li);
          tr.appendChild(tdSelect);
          tr.appendChild(tdDelete);
          relations.appendChild(tr);
          //databasesAvailable.appendChild(li);
        });
        putOptionsUnavailable(onlyGoodOptions);
      })
      .catch((error) => console.error("Error:", error));
    console.log("here");
    //putOptionsUnavailable(onlyGoodOptions);

    /* const li = document.createElement("li");
    const btn = document.createElement("button");
    let infodata = "blank";
    let rightsdata = "admin";
    let perimeterdata = "no-change";
    let datas = [infodata, rightsdata, perimeterdata];
    btn.textContent = infodata + " - " + rightsdata + " - " + perimeterdata;   
    btn.id = "select-database-available";
    btn.addEventListener("click", () => {
      dataBase_Submit.textContent = "Modifier cette relation"
      const select = document.querySelectorAll(".form-control");
      for (let i = 0; i < select.length; i++) {
        select[i].value = datas[i];
      }
      const options = select[1].querySelectorAll('option');
      options.forEach((option) => {
        console.log(option.value + " == " + select[1].value);
        if (option.value !== select[1].value) {
          option.disabled = true;
        }
        else{
          option.disabled = false;
        }
      })
  
    })
    li.appendChild(btn);
    databasesAvailable.appendChild(li);
    databasesAvailable.style.display = "none"; */
  }

  function putOptionsUnavailable(tab) {
    console.log("tab = " + tab);
    let options = document.querySelectorAll("option");
    for (let i = 0; i < tab.length; i++) {
      console.log("tab[i] = " + tab[i]);
      options.forEach((option) => {
        if (option.value === tab[i]) {
          option.disabled = true;
        }
      });
    }
  }

  function resetOptions() {
    const select = document.querySelectorAll(".form-control");
    for (let i = 0; i < select.length; i++) {
      let options = select[i].querySelectorAll("option");
      options.forEach((option) => {
        option.disabled = false;
      });
    }
    putOptionsUnavailable(onlyGoodOptions);
  }

  btnAddDatabase.addEventListener("click", () => {
    resetDatabaseRights();
  });

  function resetDatabaseRights() {
    const select = document.querySelectorAll(".form-control");
    createNewDatabaseRights = true;
    dataBase_Submit.textContent = databaseLang.add;
    dataBase_Submit.id = "add-database";
    for (let i = 0; i < select.length; i++) {
      select[i].selectedIndex = 0;
      resetOptions();
    }
  }

  function resetFields() {
    usernameValue.value = "";
    passwordValue.value = "";
    nameValue.value = "";
    firstNameValue.value = "";
    serviceValue.value = "";
    usernameSelected.value = "";
    keyText.value = "";
    onlyGoodOptions = [];
    resetDatabaseRights();
    relations.innerHTML = "";
  }

  setInterval(putBtnNextText, 2000);
});

function putBtnNextText() {
  //console.log("euhuhuhu " + myAlerts.next);
  loginBtn.value = myAlerts.next;
  descriptionSubmit.value = myAlerts.next;
}
