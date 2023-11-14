import express from 'express';
import OpenAI from "openai";
import dotenv from "dotenv"
dotenv.config();

const openai = new OpenAI({apiKey: process.env.CHATGTP_API_KEY});

const systemContent = "You are a professional dungeon master and creative writer with over 50 years of experience.\
 You specialize in writing the flavor text for TTRPGS. Your work is extremely creative and artisic. You are helping writing out the flavor text \
 for a new ttrpg module. Given the basic dungeon, city, or town layout you are able to create a cohesive description of each room, building, and landmark\
 You are precise and unique."




async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: systemContent }, {role: "user", content: "give me the flavor text for a small inn called the seaside maid"}],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}



main();

//NEED LIST OF LOCATIONS


//WORLD CONTEXT -> WORLD TABLE CRUD 

//MAIN LOCATION CONTEXT -> Main LOCATION TABLE CRUD 

//Neighboring Location Context -> OTHER ENTRIES ON TABLE WITH CORISPONDING KEYS CRUD

//Flavor Text Outline -> OUTLINES BASED ON TYPES OF LOCATIONS CRUD

//Main locations example flavor text -> CURATED EXAMPLES

//CHECK if proper JSON format -> SIMPLE CHECK

//RE prompt if not 

//STORE DESCRIPTION IN LOCATION TABLE


//----FRONT END-----------------//

//GENERATE A WORLD -- LET THE AI GENERATE IT FOR YOU

//GENERATE A Lo

`Generate the flavor text for a an old windmill located on the edge of a small village of Dunlin. The Old windmill is called The wooden serpent.
The world is the fantasy land of the land of night, a world that exists in eternal darkness. 4 eirie moons rotate through a four day cycle. Lush biolumnus fungi and volcanic
hot springs proved substance and heat for the world's population. The small village of Dunlin sits on the bank of the hotspring fed lake called The Cauldrin. The town houses a meager
100 night gnomes who by their nature are suspicious and dangerous. The mill is abandoned and used to smuggle stolen goods. It has three rooms. The lower landing, The milling floor, and the high loft.
Generate flavor text for each room.
Here is an example of some good flavor text:
You enter a medium-sized room of dwarven stone construction, with tools such as rusted pickaxes and shovels hanging from hooks on the walls. The smell of ancient dust hangs in the air. On the North wall, there is a rotted wooden door covered in scratch marks. To the East, an archway leads to a stone hallway that fades into dark, the floor near the arch covered in unusual scratches. As you enter, you hear the clatter of iron as a Kobold drops one of the shovels. Slinking through the shadows, you can see four of the little pests, suddenly aware of your presence and drawing their makeshift daggers!
`

`Generate the description and flavor text for LOCATION which is named LOCATION_NAME.
Generate the description and flavor text for ROOM.
It is located LOCATION_PROXIMITY to LOCATION LOCATION_DESCRIPTION.
It is located AREA_PROXIMITY to AREA AREA_DESCRIPTION.
It is located WORLD_PROXIMITY to WORLD WORLD_DESCPIPTION.
Its simple description is this: SIMPLE_DESCRIPTION.
It has these NPC's NPC_LIST 

`

const masterBedRoom = `This room contains a four-poster bed, its headboard carved in the likeness of a giant raven. A soft black rug covers the floor between the bed and the door. In the corners of the south wall stand two slender wardrobes with a tapestry of a church hanging on the wall between them. Beneath the tapestry sits a handsomely carved rocking cradle. To the north, under a window, is a plain desk and chair. Other furnishings include a wooden chest and a freestanding mirror in a wooden frame.`
const kitchen = `This room contains a rectangular table surrounded by eight chairs, an L-shaped cupboard, and a floor-to-ceiling closet pantry. Next to the pantry is a small iron stove.`
const sleepingQuarters = `Two pairs of bunk beds occupy this room. Against the west wall rest four identical footlockers.`
const church = `Atop a slight rise, against the roots of the pillar stone that supports Castle Ravenloft, stands a gray, sagging edifice of stone and wood. This church has obviously weathered the assaults of evil for centuries on end and is worn and weary. A bell tower rises toward the back, and flickering light shines through holes in the shingled roof. The rafters strain feebly against their load.`
const mansion = `A weary-looking mansion squats behind a rusting iron fence. The iron gates are twisted and torn. The right gate lies cast aside, while the left swings lazily in the wind. The stuttering squeal and clang of the gate repeats with mindless precision. Weeds choke the grounds and press with menace upon the house itself. Yet, against the walls, the growth has been tramped down to create a path all about the domain. Heavy claw markings have stripped the once-beautiful finish of the walls. Great black marks tell of the fires that have assailed the mansion. Not a pane nor a shard of glass stands in any window. All the windows are barred with planks, each one marked with stains of evil omen.`
const tavern = `A single shaft of light thrusts illumination into the main square, its brightness looking like a solid pillar in the heavy fog. Above the gaping doorway, a sign hangs precariously askew, proclaiming this to be the Blood on the Vine tavern.`

