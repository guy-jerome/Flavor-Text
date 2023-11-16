const $world = $('#world');
const $worldName = $('#world-name');
const $worldDescription = $('#world-description');
const $worldBtn = $('#world-btn');
const $worldFullDescription = $('#world-full-description');
const $saveBtn = $('#save-btn')

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
  console.log(data)
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