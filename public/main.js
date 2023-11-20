import {monstersSearch, monsterSearch} from './monsters.js';

//Menu components
const $menu = $('#menu')
const $flavorUsername = $("#flavor-username")
const $goWorldBtn = $('#go-world-btn')
const $goAreaBtn = $("#go-area-btn")
const $goLocationBtn = $("#go-location-btn")
const $logoutBtn = $("#logout-btn")
//World components
const $world = $('#world');
const $worldName = $('#world-name');
const $worldDescription = $('#world-description');
const $worldBtn = $('#world-btn');
const $worldFullDescription = $('#world-full-description');
const $worldSaveBtn = $('#world-save-btn')
const $worldSelect = $('#world-select')
const $worldSelectBtn = $("#world-select-btn")
//Area components
const $area = $('#area');
const $areaName = $('#area-name');
const $areaDescription = $('#area-description');
const $areaBtn = $('#area-btn');
const $areaFullDescription = $('#area-full-description');
const $areaSaveBtn = $('#area-save-btn')
const $areaSelect = $('#area-select')
const $areaSelectBtn = $("#area-select-btn")
const $areaWorldSelect = $("#area-world-select")
//Location components
const $location = $('#location');
const $locationName = $('#location-name');
const $locationDescription = $('#location-description');
const $locationBtn = $('#location-btn');
const $locationFullDescription = $('#location-full-description');
const $locationSaveBtn = $('#location-save-btn')
const $locationSelect = $('#location-select')
const $locationSelectBtn = $("#location-select-btn")
const $locationAreaSelect = $("#location-area-select")
const $locationMonsterInput = $('#location-monster-input')
const $locationMonsterResults = $('#location-monster-results')
const $locationMonsterSelected = $('#location-monster-selected')
//Nav components
const $nav = $("nav")
const $goMenuBtn = $('#go-menu-btn')
//Login components
const $login = $("#login")
const $loginBtn = $("#login-btn")
const $signUpBtn = $("#sign-up-btn")


let page = "menu";
let username = "";
let id = null;
//btns
const worldBtns = [$worldSelectBtn,$worldBtn,$worldSaveBtn]
const areaBtns = [$areaSelectBtn, $areaBtn, $areaSaveBtn];
const locationBtns = [$locationSelectBtn, $locationBtn, $locationSaveBtn];
//fill boxes
const worldInput = [$worldName, $worldDescription, $worldFullDescription]
const areaInput = [$areaName, $areaDescription, $areaFullDescription]
const locationInput = [$locationName, $locationDescription, $locationFullDescription]


function showLoginPopup() {
  Swal.fire({
      title: 'Login',
      html:
          '<label for="username">Username</label>' +
          '<input type="text" id="username" class="swal2-input">' +
          '<label for="password">Password</label>' +
          '<input type="password" id="password" class="swal2-input">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Login',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
          const username = Swal.getPopup().querySelector('#username').value;
          const password = Swal.getPopup().querySelector('#password').value;

          // You can perform login validation here
          if (!username || !password) {
              Swal.showValidationMessage('Username and password are required');
          }

          // Simulate a successful login (replace with your actual login logic)
          return { username, password };
      }
  }).then( async (userData) => {
      if (userData.isConfirmed) {
        const { username, password } = userData.value;
        const result = await fetch('/login', 
          {
            method:"POST",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({username:username, password:password})
          })
          const data = await result.json()
          let authenticated = false;
          data.message === "Authenticated"? authenticated = true: authenticated = false;
          if (authenticated) {
            // Show a success message
            Swal.fire({
                icon: 'success',
                title: 'Logged In',
                text: `Welcome ${username} to Flavor Text `,
            });
            navigateToMenu()
          } else {
            // Handle the case where account creation fails
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Password or Username Incorrect.',
                timer: 2000,
            }).then(()=>{
              showLoginPopup()
            });
            
          }
      }
  });
}

function showSignUpPopup() {
  Swal.fire({
      title: 'Create an Account',
      html:
          '<label for="username">Username</label>' +
          '<input type="text" id="username" class="swal2-input">' +
          '<label for="password">Password</label>' +
          '<input type="password" id="password" class="swal2-input">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Create Account',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
          const username = Swal.getPopup().querySelector('#username').value;
          const password = Swal.getPopup().querySelector('#password').value;
          // You can perform login validation here
          if (!username || !password) {
              Swal.showValidationMessage('Username and password are required');
          }

          // Simulate a successful login (replace with your actual login logic)
          return { username, password };
      }
  }).then(async (userData) => {
      if (userData.isConfirmed) {
          const { username, password } = userData.value;
          const result = await fetch('/signup', 
          {
            method:"POST",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({username:username, password:password})
          })
          const data = await result.json()
          let accountCreated = false;
          data.message === "Entry added successfully"?accountCreated = true:accountCreated=false
          if (accountCreated) {
            // Show a success message
            Swal.fire({
                icon: 'success',
                title: 'Account Created!',
                text: `Your account with username ${username} has been successfully created.\n Please Login.`,
            });
        } else {
            // Handle the case where account creation fails
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Account creation failed. Please try again.',
            });
        }
      }
  });
}

function showSavedPopup() {
  Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Saved',
      showConfirmButton: false,
      timer: 1000,
      customClass: {
          popup: 'saved-popup'
      }
  });
}

function showLogoutPopup() {
  Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Logged Out',
      showConfirmButton: false,
      timer: 1000,
      customClass: {
          popup: 'saved-popup'
      }
  });
}

function navigateToLogin(){
  page = "login"
  $login.show()
  $menu.hide()
  $world.hide()
  $area.hide()
  $location.hide()
  $nav.hide()
  loginCheck()
}
function navigateToMenu(){
  page = "menu"
  getUser()
  $flavorUsername.text(username)
  $login.hide()
  $world.hide()
  $area.hide()
  $location.hide()
  $nav.hide()
  $menu.show()
}
function navigateToWorld(){
  page = "world"
  $login.hide()
  $menu.hide()
  $area.hide()
  $location.hide()
  $world.show()
  $nav.show()
  loadSaves($worldSelect)
}
function navigateToArea(){
  page = "area"
  $login.hide()
  $menu.hide()
  $world.hide()
  $location.hide()
  $area.show()
  $nav.show()
  loadSaves($areaSelect)
  loadSaves($areaWorldSelect)
}
function navigateToLocation(){
  page = "location"
  $login.hide()
  $menu.hide()
  $world.hide()
  $area.hide()
  $location.show()
  $nav.show()
  loadSaves($locationSelect)
  loadSaves($locationAreaSelect)
}

navigateToLogin()


const socket = io()
// LOGIN BUTTONS
$loginBtn.on("click",showLoginPopup)
$signUpBtn.on("click",showSignUpPopup)
// Menu BUTTONS
$goMenuBtn.on("click", navigateToMenu)
$goWorldBtn.on("click",navigateToWorld) 
$goAreaBtn.on("click", navigateToArea)
$goLocationBtn.on("click", navigateToLocation)
$logoutBtn.on("click",logout)

// WORLD BUTTONS
$worldBtn.on("click", ()=>{
  $worldFullDescription.val("");
  getStream(worldBtns, {
    name: $worldName.val(),
    simpledes: $worldDescription.val(),
  })
})

$worldSaveBtn.on("click", ()=>{
  save({
    name: $worldName.val(),
    simpledes: $worldDescription.val(),
    fulldes: $worldFullDescription.val()
  })
})

$worldSelectBtn.on("click", worldLoadSave)

// AREA BUTTONS
$areaBtn.on("click", ()=>{
  $areaFullDescription.val("");
  getStream(areaBtns, {
    name: $areaName.val(),
    simpledes: $areaDescription.val(),
    world: $areaWorldSelect.val()
  })
})

$areaSaveBtn.on("click", ()=>{
  save({
    name: $areaName.val(),
    simpledes: $areaDescription.val(),
    fulldes: $areaFullDescription.val(),
    world: $areaWorldSelect.val()
  })
})

$areaSelectBtn.on("click", areaLoadSave)
// LOCATION BUTTONS

$locationBtn.on("click", ()=>{
  $locationFullDescription.val()
  let monsters = []
  $locationMonsterSelected.children().each((index,element)=>{
    monsters.push($(element).data('monsterDesc'))
  })
  getStream(locationBtns, {
    name: $locationName.val(),
    simpledes: $locationDescription.val(),
    area: $locationAreaSelect.val(),
    monsters: monsters
  })
})

$locationSaveBtn.on("click", ()=>{
  let monsters = []
  $locationMonsterSelected.children().each((index,element)=>{
    monsters.push($(element).data('monsterDesc'))
  })
  save({
    name: $locationName.val(),
    simpledes: $locationDescription.val(),
    fulldes: $locationFullDescription.val(),
    area: $locationAreaSelect.val(),
    monsters: monsters
  })
})

$locationSelectBtn.on("click", locationLoadSave)

$locationMonsterInput.on("input",generateMonsters)


socket.on('stream-chunk', (chunk) => {
  let currentVal;
  switch (page){
    case "world":
      currentVal = $worldFullDescription.val()
      $worldFullDescription.val(currentVal + chunk)
      break;
    case "area":
      currentVal = $areaFullDescription.val()
      $areaFullDescription.val(currentVal + chunk)
      break;
    case "location":
      currentVal = $locationFullDescription.val()
      $locationFullDescription.val(currentVal + chunk)
      break;
  }

});

async function generateMonsters(){
  const monsters = await monstersSearch($locationMonsterInput.val())
  if (monsters.length > 0){
    $locationMonsterResults.empty()
    monsters.forEach((monster)=>{
      const monsterBtn = $('<button class="result-button"></button>')
      monsterBtn.text(monster)
      monsterBtn.on("click", ()=>{
        addMonster(monsterBtn.text())
      })
      $locationMonsterResults.append(monsterBtn)
    })
    $locationMonsterResults.show()
  }else{
   $locationMonsterResults.hide()
  }
}

async function addMonster(monsterName){
  const monsterAddedBtn = $('<button class="result-button-added"></button>')
  monsterAddedBtn.text(monsterName)
  const monster = await monsterSearch(monsterName)
  monsterAddedBtn.data('monsterDesc', `name:${monster.name},desc:${monster.desc},size:${monster.size},type:${monster.type}, alignment:${monster.alignment}`)
  monsterAddedBtn.on("click", ()=>{
    monsterAddedBtn.remove()
  })
  $locationMonsterSelected.append(monsterAddedBtn)

}

async function getStream($btnArray,descriptions) {
  hideBtns($btnArray)
  try {
    const response = await fetch(`/${page}-stream`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(descriptions)
    });
    const data = await response.json();
  } catch (error) {
    console.error('Error fetching stream:', error);
  } finally {
    showBtns($btnArray)
  }
}

async function save(descriptions) {
  try {
    const response = await fetch(`/${page}-save`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(descriptions)
    });
    const data = await response.json();
    showSavedPopup()
    switch (page){
      case "world":
        loadSaves($worldSelect)
        break;
      case "area":
        loadSaves($areaSelect)
        break;
      case "location":
        loadSaves($locationSelect)
        break;
    }
  } catch (error) {
    console.error('Error saving world:', error);
  }
}


async function loadSaves(select) {
  let response;
  try {
    switch (select){
      case $areaWorldSelect:
        response = await fetch(`/worlds`);
        break;
      case $locationAreaSelect:
        response = await fetch(`/areas`);
        break;
      default:
       response = await fetch(`/${page}s`);
    }
    const data = await response.json();
    select.empty();

    for (let entry of data) {
      const option = `<option value="${entry.id}">${entry.name}</option>`;
      select.append(option);
    }
  } catch (error) {
    console.error('Error fetching worlds:', error);
    navigateToLogin()
  }
}


async function worldLoadSave() {
  try {
    const response = await fetch(`/worlds/${$worldSelect.val()}`);
    const data = await response.json();
    $worldName.val(data[0].name);
    $worldDescription.val(data[0].simpledes);
    $worldFullDescription.val(data[0].fulldes);
  } catch (error) {
    console.error('Error loading world:', error);

  }
}

function worldClear(){
  $worldName.val("");
  $worldDescription.val("");
  $worldFullDescription.val("");
}

async function areaLoadSave(){
  try{
    const response = await fetch(`/areas/${$areaSelect.val()}`);
    const data = await response.json();
    $areaName.val(data[0].name);
    $areaDescription.val(data[0].simpledes);
    $areaFullDescription.val(data[0].fulldes);
  } catch (error){
    console.error('Error loading area:', error);

  }
}

function areaClear(){
  $areaName.val("");
  $areaDescription.val("");
  $areaFullDescription.val("");
}

async function locationLoadSave(){
  try{
    const response = await fetch(`/locations/${$locationSelect.val()}`);
    const data = await response.json();
    $locationName.val(data[0].name);
    $locationDescription.val(data[0].simpledes);
    $locationFullDescription.val(data[0].fulldes);
  } catch (error){
    console.error('Error loading location:', error);

  }
}

function locationClear(){
  $locationName.val("");
  $locationDescription.val("");
  $locationFullDescription.val("");
}

async function logout(){
  try{
    const response = await fetch('/logout')
    const data = response.json()
    username = ""
    id = null
    navigateToLogin()
    showLogoutPopup()
  } catch (error){
    console.error('Error Logging Out')
  }

}

async function loginCheck(){
  try{
    const response = await fetch('/loginCheck')
    const data = await response.json()
    username = data.username
    id = data.id
    worldClear()
    areaClear()
    locationClear()
    navigateToMenu()
  } catch (error){
    console.error("User not Authenticated")
  }
}
async function getUser(){
  try{
    const response = await fetch('/loginCheck')
    const data = await response.json()
    username = data.username
    id = data.id
  } catch (error){
    console.error("Can't get user and id")
  }
}
function hideBtns($btnArray){
  $btnArray.forEach(($btn)=>{
    $btn.prop("disabled",true)
  })
}

function showBtns($btnArray){
  $btnArray.forEach(($btn)=>{
    $btn.prop("disabled",false)
  })
}

