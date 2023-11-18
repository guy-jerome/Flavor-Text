async function monstersSearch(query){
    const response = await fetch(`https://api.open5e.com/v1/monsters/?search=${query}&limit=10`)
    const data = await response.json()
    data.results.forEach((monster)=>{
        console.log(monster.name)
    })
}
async function monsterSearch(query){
    const response = await fetch(`https://api.open5e.com/v1/monsters/?name=${query}&limit=10`)
    const data = await response.json()
    console.log(data.results[0].name)
}

export default monsterSearch