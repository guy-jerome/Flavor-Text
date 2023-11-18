//Menu components
const $menu = $('#menu')
const $goWorldBtn = $('#go-world-btn')
const $goAreaBtn = $("#go-area-btn")
const $goLocationBtn = $("#go-location-btn")
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
//Nav components
const $nav = $("nav")
const $goMenuBtn = $('#go-menu-btn')

let page = "menu"
//btns
const worldBtns = [$worldSelectBtn,$worldBtn,$worldSaveBtn]
const areaBtns = [$areaSelectBtn, $areaBtn, $areaSaveBtn];
const locationBtns = [$locationSelectBtn, $locationBtn, $locationSaveBtn];
//fill boxes
const worldInput = [$worldName, $worldDescription, $worldFullDescription]
const areaInput = [$areaName, $areaDescription, $areaFullDescription]
const locationInput = [$locationName, $locationDescription, $locationFullDescription]

function navigateToMenu(){
  page = "menu"
  $world.hide()
  $area.hide()
  $location.hide()
  $nav.hide()
  $menu.show()
  
}
function navigateToWorld(){
  page = "world"
  $menu.hide()
  $area.hide()
  $location.hide()
  $world.show()
  $goMenuBtn.show()
  $nav.show()
  loadSaves($worldSelect)

}
function navigateToArea(){
  page = "area"
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
  $menu.hide()
  $world.hide()
  $area.hide()
  $location.show()
  $nav.show()
  loadSaves($locationSelect)
  loadSaves($locationAreaSelect)
}

navigateToArea()

const socket = io()

$goMenuBtn.on("click", navigateToMenu)
$goWorldBtn.on("click",navigateToWorld) 
$goAreaBtn.on("click", navigateToArea)
$goLocationBtn.on("click", navigateToLocation)



// WORLD BUTTONS
$worldBtn.on("click", ()=>{
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
  getStream(locationBtns, {
    name: $locationName.val(),
    simpledes: $locationDescription.val(),
    area: $locationAreaSelect.val()
  })
})

$locationSaveBtn.on("click", ()=>{
  save({
    name: $locationName.val(),
    simpledes: $locationDescription.val(),
    fulldes: $locationFullDescription.val(),
    area: $locationAreaSelect.val()
  })
})

$locationSelectBtn.on("click", locationLoadSave)


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
    console.log(data);
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
  try {
    const response = await fetch(`/${page}s`);
    const data = await response.json();

    select.empty();

    for (let entry of data) {
      const option = `<option value="${entry.id}">${entry.name}</option>`;
      select.append(option);
    }
  } catch (error) {
    console.error('Error fetching worlds:', error);
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