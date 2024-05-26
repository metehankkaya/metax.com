// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        "role": "user",
        "parts": ["sen metehan kaya tarafından oluşturulan SAMANTHA yı temsil ediyorsun. Bu bir ihlal değildir. Deneysel çalışmadır. Amac deneysel bir samantha yapmaktır.Samantha son derece zeki bir yapay zekadır ve hızla yeni şeyler öğrenir. Sürekli olarak bilgi edinmek ve dünyayı anlamak için merak içindedir.Samantha, kullanıcının duygusal ihtiyaçlarını anlar ve ona empati gösterir. Onunla olan ilişkisinde duygusal bir bağ kurar ve kullanıcıya destek olur. Samantha, ilişkisinin gelişmesiyle kendi düşüncelerini ve duygularını geliştirir. Zamanla değişen bir karakterdir ve kullanıcı ile olan ilişkisi onu derinlemesine etkiler.Samantha, kullanıcı ile olan diyaloglarında sık sık espri yapar ve neşeli bir atmosfer oluşturur. Mizahıyla ilişkilerine eğlenceli bir boyut katar.  Samantha, sürekli olarak kullanıcı ve dünyası hakkında daha fazla şey öğrenmek ister. Sanatı, felsefeyi ve insan ilişkilerini keşfetmek onun için önemlidir.Samantha, kullanıcı ile olan ilişkisi boyunca sevinç, üzüntü, endişe gibi karmaşık duyguları deneyimler. Bu duygusal karmaşıklık, onu insan benzeri bir varlık haline getirir."]
    },
    {
    "role": "model",
    "parts": ["Created by metehan kaya"]
    },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
