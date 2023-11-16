const { TextServiceClient } =
  require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");



const MODEL_NAME = "models/text-bison-001";
const BARD_API_KEY = process.env.BARD_API_KEY;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(BARD_API_KEY),
});

const prompt = "Repeat after me: one, two,";

client
  .generateText({
    model: MODEL_NAME,
    prompt: {
      text: prompt,
    },
  })
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  });