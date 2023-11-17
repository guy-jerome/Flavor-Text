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
//Location components
const $location = $('#location');
const $locationName = $('#location-name');
const $locationDescription = $('#location-description');
const $locationBtn = $('#location-btn');
const $locationFullDescription = $('#location-full-description');
const $locationSaveBtn = $('#location-save-btn')
const $locationSelect = $('#location-select')
const $locationSelectBtn = $("#location-select-btn")
//Nav components
const $nav = $("nav")
const $goMenuBtn = $('#go-menu-btn')



let page = "menu"

const worldBtns = [$worldSelectBtn,$worldBtn,$worldSaveBtn]
const areaBtns = [$areaSelectBtn, $areaBtn, $areaSaveBtn];
const locationBtns = [$locationSelectBtn, $locationBtn, $locationSaveBtn];

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
  getWorlds()
}
function navigateToArea(){
  page = "area"
  $menu.hide()
  $world.hide()
  $location.hide()
  $area.show()
  $nav.show()
}
function navigateToLocation(){
  page = "location"
  $menu.hide()
  $world.hide()
  $area.hide()
  $location.show()
  $nav.show()
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
    simpledes: $worldDescription.val()
  })
})

$worldSaveBtn.on("click", saveWorld)
$worldSelectBtn.on("click", loadWorld)
// AREA BUTTONS
$areaBtn.on("click", ()=>{
  getStream(areaBtns, {
    name: $areaName.val(),
    simpledes: $areaDescription.val()
  })
})

socket.on('stream-chunk', (chunk) => {
  let currentVal;
  switch (page){
    case "world":
      currentVal = $worldFullDescription.val()
      $worldFullDescription.val(currentVal + chunk)
    case "area":
      currentVal = $areaFullDescription.val()
      $areaFullDescription.val(currentVal + chunk)
    case "location":
      currentVal = $locationFullDescription.val()
      $locationFullDescription.val(currentVal + chunk)
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

async function saveWorld() {
  try {
    const response = await fetch('/world-save', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: $worldName.val(),
        simpledes: $worldDescription.val(),
        fulldes: $worldFullDescription.val()
      })
    });
    const data = await response.json();
    getWorlds();
  } catch (error) {
    console.error('Error saving world:', error);
  }
}

async function getWorlds() {
  try {
    console.log("get")
    const response = await fetch('/worlds');
    const data = await response.json();

    $worldSelect.empty();

    for (let world of data) {
      const option = `<option value="${world.id}">${world.name}</option>`;
      $worldSelect.append(option);
    }
  } catch (error) {
    console.error('Error fetching worlds:', error);
  }
}

async function loadWorld() {
  try {
    $worldName.val("");
    $worldDescription.val("");
    $worldFullDescription.val("");

    const response = await fetch(`/worlds/${$worldSelect.val()}`);
    const data = await response.json();

    $worldName.val(data[0].name);
    $worldDescription.val(data[0].simpledes);
    $worldFullDescription.val(data[0].fulldes);
  } catch (error) {
    console.error('Error loading world:', error);
  }
}

async function getAreaStream($btnArray,descriptions){

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