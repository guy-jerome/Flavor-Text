export async function monstersSearch(query){
    const response = await fetch(`https://api.open5e.com/v1/monsters/?search=${query}&limit=10`)
    const data = await response.json()
    return data.results.map((monster)=>{
        return monster.name
    })
}
export async function monsterSearch(query){
    const response = await fetch(`https://api.open5e.com/v1/monsters/?name=${query}&limit=1`)
    const data = await response.json()
    return data.results[0]
}
