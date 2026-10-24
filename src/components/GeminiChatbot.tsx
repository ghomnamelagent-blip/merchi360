import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
} from 'lucide-react';
import { MirchiLogo } from './MirchiLogo';
import { MenuItem } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface GeminiChatbotProps {
  onQuickAddItem?: (item: MenuItem) => void;
  onApplyPromo?: (code: string) => void;
  currentMenu?: MenuItem[];
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  onApplyPromo,
  currentMenu = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: "Welcome to Mirchi 360! I'm your AI Culinary Concierge. Ask me for recommendations, spice pairings, family bundle sizing, or our current deals in PKR!",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setRecognitionError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setRecognitionError('Microphone permission or speech error');
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Text to Speech playback
  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown asterisks or special characters for cleaner speech
      const cleanedText = text.replace(/[*#_~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      setRecognitionError('Speech recognition is not supported in this browser.');
      setTimeout(() => setRecognitionError(null), 3000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start failed:', e);
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const userQuery = (textToSend || input).trim();
    if (!userQuery || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          currentMenu: currentMenu.map((i) => ({
            name: i.name,
            category: i.category,
            price: i.price,
            inStock: i.inStock !== false,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const assistantText = data.reply || "I'm always ready to help you with your Mirchi 360 order!";

      const assistantMessage: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      speakText(assistantText);

      // Auto-trigger promo if mentioned
      if (
        (assistantText.includes('MIRCHI20') ||
          assistantText.includes('MIRCHI360') ||
          assistantText.includes('MERCHI20')) &&
        onApplyPromo
      ) {
        onApplyPromo('MIRCHI20');
      }
    } catch (err: any) {
      console.error('Failed to chat with Mirchi 360 assistant:', err);
      // Dynamic tailored fallback answering the query
      const q = userQuery.toLowerCase();
      let tailoredReply = "I'm your Mirchi 360 Culinary Concierge! ";
      if (q.includes('price') || q.includes('how much') || q.includes('cost')) {
        tailoredReply += "Our bestselling Classic Chicken Bucket (8 Pcs) is Rs. 1,899, Nashville Hot Fire Burger is Rs. 850, and Solo Box is Rs. 950. All prices are in PKR!";
      } else if (q.includes('spicy') || q.includes('hot') || q.includes('sauce')) {
        tailoredReply += "Our signature Nashville Hot and Ghost Pepper Heat deliver authentic fiery kick, balanced with our smoky chipotle BBQ and buttermilk honey glazes!";
      } else if (q.includes('family') || q.includes('deal') || q.includes('party')) {
        tailoredReply += "Try our Family Crunch Feast for Rs. 3,850 (feeds 4-6) or Weekend Gameday Mega Box for Rs. 4,250! Use code MIRCHI20 for 20% off!";
      } else {
        tailoredReply += `I recommend pairing our Nashville Hot Fire Burger (Rs. 850) with Seasoned Waffle Fries (Rs. 450). Remember to use coupon code MIRCHI20 for 20% off your entire order!`;
      }

      const fallbackMsg: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        text: tailoredReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speakText(fallbackMsg.text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 lg:bottom-6 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#ff5514] text-white font-bold text-xs sm:text-sm shadow-2xl shadow-[#FF6B35]/40 hover:scale-105 active:scale-95 transition-all border border-white/20 group cursor-pointer"
          aria-label="Open Mirchi 360 AI Assistant"
        >
          <div className="relative">
            <MirchiLogo size={22} className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span className="hidden sm:inline">Ask Mirchi 360 AI</span>
          <span className="sm:hidden">AI Chef</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        </button>
      )}

      {/* Slide-Up Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] h-[540px] bg-[#18181A] border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#141416] border-b border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#FF8B5A] flex items-center justify-center text-white shadow-md shadow-[#FF6B35]/25">
                <MirchiLogo size={22} className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-white">Mirchi 360 Concierge</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] text-zinc-400">Powered by Gemini AI · Live PKR Menu</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Voice playback toggle */}
              <button
                onClick={() => {
                  const next = !voiceEnabled;
                  setVoiceEnabled(next);
                  if (!next && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  voiceEnabled ? 'text-[#FF6B35] hover:bg-zinc-800' : 'text-zinc-500 hover:bg-zinc-800'
                }`}
                title={voiceEnabled ? 'Voice responses active' : 'Voice muted'}
                aria-label="Toggle voice responses"
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                }}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Voice status banner if listening */}
          {isListening && (
            <div className="bg-[#FF6B35]/20 border-b border-[#FF6B35]/40 px-3 py-1.5 flex items-center justify-between text-xs text-amber-200 shrink-0 animate-pulse">
              <span className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-[#FF6B35]" />
                Listening to your voice... Speak now!
              </span>
              <button
                onClick={() => recognitionRef.current?.stop()}
                className="text-[10px] font-bold underline cursor-pointer"
              >
                Stop
              </button>
            </div>
          )}

          {recognitionError && (
            <div className="bg-red-950/60 border-b border-red-800/40 px-3 py-1 text-[11px] text-red-300 shrink-0">
              {recognitionError}
            </div>
          )}

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-zinc-300">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-[#242428] border border-zinc-700/80 flex items-center justify-center text-[#FF6B35] shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                      isUser
                        ? 'bg-[#FF6B35] text-white rounded-tr-xs shadow-md shadow-[#FF6B35]/20'
                        : 'bg-[#222226] text-zinc-200 border border-zinc-700/70 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1 ${
                        isUser ? 'text-white/70' : 'text-zinc-500'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-zinc-400">
                <div className="w-7 h-7 rounded-full bg-[#242428] border border-zinc-700/80 flex items-center justify-center text-[#FF6B35] shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#222226] border border-zinc-700/70 rounded-2xl px-3.5 py-2 rounded-tl-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] ml-1">Chef is calculating flavors...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="px-3 py-1.5 bg-[#141416] border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {[
              'Best combo for 4 in PKR?',
              'How spicy is Nashville?',
              'Active coupons?',
              'What sides come with feast?',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setInput(chip);
                  handleSendMessage(chip);
                }}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#222226] hover:bg-[#2b2b30] border border-zinc-700/60 text-[11px] text-zinc-300 hover:text-white transition-colors shrink-0 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input & Voice Controls */}
          <div className="p-3 bg-[#18181A] border-t border-zinc-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic / Voice Conversation Button */}
              <button
                type="button"
                onClick={toggleMic}
                className={`p-2.5 rounded-full transition-all shrink-0 cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/30'
                    : 'bg-[#242428] hover:bg-[#2f2f35] text-zinc-300 hover:text-[#FF6B35] border border-zinc-700'
                }`}
                title={isListening ? 'Click to stop listening' : 'Speak via microphone'}
                aria-label="Microphone input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening...' : 'Ask about chicken, deals, or combos in PKR...'}
                className="flex-1 bg-[#222226] border border-zinc-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B35]"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-full bg-[#FF6B35] hover:bg-[#ff5a1f] disabled:opacity-40 text-white transition-all shadow-md shadow-[#FF6B35]/20 shrink-0 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
