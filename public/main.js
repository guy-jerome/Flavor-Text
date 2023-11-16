const $world = $('#world');
const $wordName = $('#word-name');
const $worldDescription = $('#world-description');
const $worldBtn = $('#world-btn');
const $worldFullDescription = $('#world-full-description');

const socket = io()
let page = "world"

async function getStream(){
  const response = await fetch('/stream', {
    method: "POST",
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      worldName: $wordName.val(),
      worldDescription: $worldDescription.val()
    })
    
  })
  console.log(response)
}


socket.on('stream-chunk', (chunk) => {
  if (page === "world"){
    $worldFullDescription.append(chunk)
  }
});

$worldBtn.on("click", getStream)
