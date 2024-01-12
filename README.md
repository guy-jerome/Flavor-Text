# Flavor-Text


### A TTRPG Flavor Text Generator with ChatGPT Integration

This full-stack Express application helps you generate immersive flavor text for your tabletop role-playing games. It leverages the power of ChatGPT to create descriptions of worlds, areas, and locations, while also allowing you to retrieve official monster information from the D&D API.


### Key Features

* ChatGPT-powered text generation:
  * Describe a world, area, or location, and get tailored flavor text in seconds.
  * Prompts are adjusted automatically based on saved world and area information.
* Text storage:
  * Generated text is saved in a PostgreSQL database for easy reference and future use.
* D&D monster lookup:
  * Fetch official monster details from the D&D API to enrich your game sessions.
* User authentication:
  * Secure user registration and login using bcrypt and JWT.

### Prerequisites

* Node.js 14.x or later
* PostgreSQL
* API keys for:
  * ChatGPT (OpenAI)
  * Bard (optional)
* JWT_SECRET


## Installation

  1. Clone this repository:
    git clone https://github.com/guy-jerome/Flavor-Text.git
  2. Install dependencies:
    cd Flavor-Text
    npm install
  3. Create a .env file and add variables:
    * DB_KEY=your_postgres_connection_string
    * CHATGPT_API_KEY=your_openai_api_key
    * JWT_SECRET=your_secret_key_for_tokens
    * Set up your PostgreSQL database.


## Running the Application

* Development mode:

npm run dev
* Production mode:

npm start

The application will typically run on port 3000. Access it in your browser at http://localhost:3000.


## Usage

1. Register or log in.
2. Generate flavor text:
  Choose whether to generate text for a world, area, or location.
  Provide a brief description.
  The generated text will be displayed and saved in the database.
3. Look up monster info to add to an area(optional):
  Search for a monster by name.
  Details from the D&D API will be displayed and injecting into the prompt.

## Contributing

We welcome contributions! Fork the repository and submit pull requests.


## License

This project is licensed under the Apache License - see the LICENSE file for details.

I hope this formatting is clearer and easier to read. Please let me know if you have any other questions. 
