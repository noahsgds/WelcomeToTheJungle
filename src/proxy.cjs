const express = require('express');
const fetch = require('node-fetch').default;
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const WID = 'W5BnQgy1EP';
const API_KEY = 'sk-684081e0f97f4b02fde9170cb66161f9';
const AGENT_ID = 'tAtx4ucesL';

const PORT = 3001;

app.post('/api/dust/create', async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await fetch(`https://dust.tt/api/v1/w/${WID}/assistant/conversations`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        title: 'Conversation utilisateur',
        visibility: 'unlisted',
        message: {
          content: message,
          mentions: [{
            configurationId: AGENT_ID
          }]
        }
      })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur création conversation:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la conversation' });
  }
});

app.get('/api/dust/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const response = await fetch(`https://dust.tt/api/v1/w/${WID}/assistant/conversations/${conversationId}/events`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': `Bearer ${API_KEY}`
      }
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur récupération réponse:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la réponse' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
