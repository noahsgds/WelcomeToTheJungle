import React, { useState, useContext, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { GameContext } from '../../context/GameContext';
import { X } from 'lucide-react';

// Constantes pour l'API Dust
const WID = 'W5BnQgy1EP';
const API_KEY = 'sk-684081e0f97f4b02fde9170cb66161f9';

// Types
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

interface DustChatbotState {
  isChatOpen: boolean;
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  isTyping: boolean;
}

const DustChatbot: React.FC = () => {
  const { currentUser } = useContext(GameContext);
  const [state, setState] = useState<DustChatbotState>({
    isChatOpen: false,
    messages: [],
    inputMessage: '',
    isLoading: false,
    isTyping: false
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const { isChatOpen, messages, inputMessage, isLoading, isTyping } = state;
  const setStateWithCallback = (update: Partial<DustChatbotState>) => {
    setState(prev => ({
      ...prev,
      ...update
    }));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Animation de typage
  const TypingAnimation = () => (
    <div className="p-4 mb-2 rounded-lg bg-gray-100 text-gray-800 mr-auto">
      <div className="flex items-center justify-end">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
        </div>
        <span className="ml-2">Kwak est en train de répondre...</span>
      </div>
    </div>
  );

  // Gestion des erreurs
  const handleError = (error: unknown) => {
    console.error('Erreur:', {
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    const errorMessage: Message = {
      id: Date.now().toString(),
      content: error instanceof Error 
        ? `Erreur: ${error.message}` 
        : "Désolé, une erreur est survenue lors de la communication avec Kwak.",
      role: 'assistant',
      timestamp: new Date().toISOString()
    };
    setStateWithCallback({
      messages: [...messages, errorMessage],
      isLoading: false,
      isTyping: false
    });
  };

  // Gestion de l'envoi de message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    setStateWithCallback({
      isLoading: true,
      isTyping: true
    });

    try {
      // Ajout du message de l'utilisateur
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputMessage,
        role: 'user',
        timestamp: new Date().toISOString()
      };
      setStateWithCallback({
        messages: [...messages, userMessage],
        inputMessage: ''
      });

      // Création d'une nouvelle conversation
      const creationResponse = await fetch(`https://dust.tt/api/v1/w/${WID}/assistant/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          name: 'Jungle Gather Chat',
          description: 'Conversation avec Kwak'
        })
      });

      if (!creationResponse.ok) {
        throw new Error('Échec de la création de la conversation');
      }

      const creationData = await creationResponse.json();
      const conversationId = creationData.conversation_id;

      // Envoi du message dans la conversation avec un contexte personnalisé
      const response = await fetch(`https://dust.tt/api/v1/w/${WID}/assistant/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          content: inputMessage,
          role: 'user',
          metadata: {
            user: {
              name: currentUser?.name,
              avatar: currentUser?.avatar,
              role: 'user'
            },
            context: {
              conversationId,
              timestamp: new Date().toISOString()
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Échec de l\'envoi du message');
      }

      // Récupération de la réponse de Kwak
      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      // Ajout de la réponse de Kwak
      setStateWithCallback({
        messages: [...messages, assistantMessage],
        isTyping: false
      });

      // Log des détails de la conversation pour le débogage
      console.log('Conversation ID:', conversationId);
      console.log('Réponse de Kwak:', data.content);

    } catch (error) {
      setStateWithCallback({
        isTyping: false
      });
      handleError(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateWithCallback({
      inputMessage: e.target.value
    });
  };

  const toggleChat = () => {
    setStateWithCallback({
      isChatOpen: !isChatOpen
    });
  };

  return (
    <div className="fixed right-4 top-4">
      <button
        onClick={toggleChat}
        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
        title="Ouvrir le chat avec Kwak"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isChatOpen && (
        <div className="fixed bottom-0 right-0 w-[350px] h-[500px] bg-white rounded-t-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Chat avec Kwak</h3>
            <button
              onClick={toggleChat}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <img
                src={currentUser?.avatar || '/assets/avatars/default.png'}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span>{currentUser?.name || 'Utilisateur'}</span>
            </div>
          </div>
          <div className="h-[350px] overflow-y-auto p-4 space-y-2" ref={scrollRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 mb-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-100 text-blue-800 ml-auto' 
                    : 'bg-gray-100 text-gray-800 mr-auto'
                }`}
              >
                {message.content}
              </div>
            ))}
            {isTyping && <TypingAnimation />}
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Envoyer un message..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
