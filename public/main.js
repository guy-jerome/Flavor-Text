const $world = $('#world');
const $worldName = $('#world-name');
const $worldDescription = $('#world-description');
const $worldBtn = $('#world-btn');
const $worldFullDescription = $('#world-full-description');
const $saveBtn = $('#save-btn')
const $select = $('#select')
const $selectWorldBtn = $("#select-world-btn")

const socket = io()
let page = "world"

async function getStream(){
  $saveBtn.prop("disabled",true)
  $worldBtn.prop("disabled",true)
  const response = await fetch('/stream', {
    method: "POST",
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      name: $worldName.val(),
      simpledes: $worldDescription.val()
    })
  })
  const data = response.json()
  console.log(data)
  $saveBtn.prop("disabled",false)
  $worldBtn.prop("disabled",false)
}

async function saveWorld(){
  const response = await fetch('/streamsave', {
    method: "POST",
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      name: $worldName.val(),
      simpledes: $worldDescription.val(),
      fulldes: $worldFullDescription.val()
    })
  })
  const data = await response.json();
  getWorlds()
}

async function getWorlds(){
  const response = await fetch('/worlds')
  const data = await response.json();
  for (let world of data){
    const option = `<option value="${world.id}">${world.name}</option>`
    $select.append(option)
  }
}

socket.on('stream-chunk', (chunk) => {
  if (page === "world"){
    let currentVal = $worldFullDescription.val()
    $worldFullDescription.val(currentVal + chunk)
  }
});

$worldBtn.on("click", getStream)

$saveBtn.on("click", ()=>{
  saveWorld()
})

async function loadWorld(){
  $worldName.val("")
  $worldDescription.val("")
  $worldFullDescription.val("")
  const response = await fetch(`/worlds/${$select.val()}`)
  const data = await response.json();
  console.log(data)
  $worldName.val(data[0].name)
  $worldDescription.val(data[0].simpledes)
  $worldFullDescription.val(data[0].fulldes)
}

$selectWorldBtn.on("click", ()=>{
 loadWorld()
})

getWorlds()