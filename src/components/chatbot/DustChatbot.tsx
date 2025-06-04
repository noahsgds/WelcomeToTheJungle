import React, { useState, useContext } from 'react';
import { MessageCircle } from 'lucide-react';
import { GameContext } from '../../context/GameContext';
import { X } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

const DustChatbot: React.FC = () => {
  const { currentUser } = useContext(GameContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const WID = 'W5BnQgy1EP';
  const API_KEY = 'sk-684081e0f97f4b02fde9170cb66161f9';
  const AGENT_ID = 'tAtx4ucesL';
  const DUST_API_URL = `https://dust.tt/api/v1/w/${WID}/assistant/conversations/${AGENT_ID}`;

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      // Créer la conversation via le proxy
      const response = await fetch('http://localhost:3001/api/dust/create', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          message: inputMessage
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      // Récupérer la réponse via le proxy
      const initialData = await response.json();
      console.log('Réponse initiale:', JSON.stringify(initialData, null, 2));
      const conversationId = initialData.id;
      if (!conversationId) {
        throw new Error('Impossible d\'obtenir l\'ID de la conversation');
      }

      // Attendre quelques secondes pour que l'agent réponde
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Récupérer la réponse de l'agent via le proxy
      const response2 = await fetch(`http://localhost:3001/api/dust/${conversationId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json'
        }
      });

      if (!response2.ok) {
        throw new Error(`Erreur ${response2.status}: ${response2.statusText}`);
      }

      const fullResponse = await response2.json();
      console.log('Réponse complète:', JSON.stringify(fullResponse, null, 2));

      // Extraire le contenu de la réponse
      const assistantMessage = fullResponse?.messages?.[0]?.content?.rawContents?.[0]?.content ||
                              fullResponse?.messages?.[0]?.content ||
                              fullResponse?.messages?.[0]?.rawContents?.[0]?.content ||
                              'Je ne peux pas répondre à cette question.';

      console.log('Contenu extrait:', assistantMessage);

      // Créer le message assistant
      const assistantMessageObj: Message = {
        id: Date.now().toString(),
        content: assistantMessage,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessageObj]);
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: error instanceof Error 
          ? `Erreur: ${error.message}` 
          : "Désolé, une erreur est survenue lors de la communication avec l'API Dust.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed right-4 top-4">
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
        title="Ouvrir le chat avec l'assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isChatOpen && (
        <div className="fixed bottom-0 right-0 w-[350px] h-[500px] bg-white rounded-t-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <img
                src={currentUser?.avatar || '/assets/avatars/default.png'}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold">Assistant Dust</span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrivez un message..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                disabled={isLoading || !inputMessage.trim()}
              >
                {isLoading ? '...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DustChatbot;
