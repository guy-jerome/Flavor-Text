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

let page = "menu"

function navigateToMenu(){
  page = "menu"
  $world.hide()
  $area.hide()
  $location.hide()
  $menu.show()
}
function navigateToWorld(){
  page = "world"
  $menu.hide()
  $area.hide()
  $location.hide()
  $world.show()
  getWorlds()
}
function navigateToArea(){
  page = "area"
  $menu.hide()
  $world.hide()
  $location.hide()
  $area.show()
}
function navigateToLocation(){
  page = "location"
  $menu.hide()
  $world.hide()
  $area.hide()
  $location.show()
}

navigateToMenu()

const socket = io()


$goWorldBtn.on("click",navigateToWorld) 
$goAreaBtn.on("click", navigateToArea)
$goLocationBtn.on("click", navigateToLocation)


$worldBtn.on("click", getStream)
$worldSaveBtn.on("click", saveWorld)
$worldSelectBtn.on("click", loadWorld)


socket.on('stream-chunk', (chunk) => {
  if (page === "world"){
    let currentVal = $worldFullDescription.val()
    $worldFullDescription.val(currentVal + chunk)
  }
});

async function getStream() {
  $worldSaveBtn.prop("disabled", true)
  $worldBtn.prop("disabled", true)
  $worldSelectBtn.prop("disabled", true)
  try {
    const response = await fetch('/stream', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: $worldName.val(),
        simpledes: $worldDescription.val()
      })
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching stream:', error);
  } finally {
    $worldSaveBtn.prop("disabled", false)
    $worldBtn.prop("disabled", false)
    $worldSelectBtn.prop("disabled", false)
  }
}

async function saveWorld() {
  try {
    const response = await fetch('/streamsave', {
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
    const response = await fetch('/worlds');
    const data = await response.json();

    $select.empty();

    for (let world of data) {
      const option = `<option value="${world.id}">${world.name}</option>`;
      $select.append(option);
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