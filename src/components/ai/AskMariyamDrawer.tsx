import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  ShoppingBag,
  Bot,
  User,
  Check,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendedProducts?: Product[];
}

export const AskMariyamDrawer: React.FC = () => {
  const {
    isAskMariyamOpen,
    setIsAskMariyamOpen,
    products,
    addToCart,
    showToast
  } = useStore();

  if (!isAskMariyamOpen) return null;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Namaste! I am Mariyam, your personal beauty advisor & formulation consultant. Whether you need a wedding-proof bridal look, barrier repair for humid weather, or shade pairing, I am here to assist.',
      recommendedProducts: [products[0], products[1]]
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': localStorage.getItem('mm_session_id') || '',
          ...(localStorage.getItem('mm_auth_token') ? { 'Authorization': `Bearer ${localStorage.getItem('mm_auth_token')}` } : {})
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4).map(m => ({ role: m.sender, parts: [{ text: m.text }] }))
        })
      });

      if (!response.ok) {
        throw new Error('AI service response error');
      }

      const data = await response.json();
      const recommended = (data.recommendedProductIds || [])
        .map((id: string) => products.find(p => p.id === id))
        .filter(Boolean) as Product[];

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here are our curated formulations suited to your request.',
        recommendedProducts: recommended.length > 0 ? recommended : undefined
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('Fallback response for Ask Mariyam:', err);
      // Helpful fallback
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: 'For your routine, I recommend focusing on formulations that honor your unique undertone and stand up to Indian climate conditions. Here are our premier recommendations tailored to your request:',
        recommendedProducts: [products[0], products[2], products[3]]
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllToCart = (prods: Product[]) => {
    prods.forEach(p => addToCart(p, p.shades ? p.shades[0] : undefined, 1));
    showToast(`Added all ${prods.length} products to your Bag!`, 'success');
  };

  const promptSuggestions = [
    'Bridal kit routine under ₹5,000',
    'Foundation for oily skin in Mumbai heat',
    'Best lipstick for warm dusky skin',
    'How to heal damaged barrier & redness'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-[#FCF9F5] h-full shadow-2xl flex flex-col border-l border-[#E8DAC2]">
        {/* Top Header */}
        <div className="bg-[#4A0E17] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FAF5EC] p-0.5">
              <div className="w-full h-full rounded-full bg-[#4A0E17] flex items-center justify-center text-[#D4AF37]">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="font-serif font-bold text-base tracking-wide flex items-center gap-1.5">
                <span>Ask Mariyam</span>
                <span className="text-[10px] bg-[#D4AF37] text-black px-1.5 py-0.2 rounded-full font-bold uppercase">
                  AI
                </span>
              </h3>
              <p className="text-[11px] text-[#EADFCB]">Luxury Beauty Concierge & Formulation Advisor</p>
            </div>
          </div>

          <button
            onClick={() => setIsAskMariyamOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-[#4A0E17] text-white rounded-tr-xs'
                    : 'bg-white border border-[#E8DAC2] text-[#201815] shadow-xs rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Attached Real Product Cards if recommended */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#F0E4D2]">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#4A0E17]">
                      <span>Recommended Formulations ({msg.recommendedProducts.length})</span>
                      {msg.recommendedProducts.length > 1 && (
                        <button
                          onClick={() => handleAddAllToCart(msg.recommendedProducts!)}
                          className="text-[#A37B30] hover:underline flex items-center gap-1 font-bold"
                        >
                          <Plus className="w-3 h-3" /> Add Routine to Bag
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {msg.recommendedProducts.map(prod => (
                        <div
                          key={prod.id}
                          className="bg-[#FCF9F5] border border-[#EADFCB] rounded-xl p-2.5 flex items-center justify-between gap-3"
                        >
                          <img
                            src={prod.primaryImage}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-lg border border-white"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-[11px]">{prod.name}</p>
                            <p className="text-[10px] text-gray-500">{prod.brand} • {prod.subcategory}</p>
                            <p className="text-[11px] font-bold text-[#4A0E17]">₹{prod.price.toLocaleString('en-IN')}</p>
                          </div>

                          <button
                            onClick={() => addToCart(prod, prod.shades ? prod.shades[0] : undefined, 1)}
                            className="p-1.5 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-lg transition-colors shadow-xs"
                            title="Add to Bag"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#EADFCB] text-[#4A0E17] flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-[#8E7E73]">
              <div className="w-7 h-7 rounded-full bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center shrink-0">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span>Mariyam is reviewing formulations & ingredients...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Query Suggestion Chips */}
        <div className="p-3 bg-[#FAF5EC] border-t border-[#E8DAC2] overflow-x-auto">
          <div className="flex gap-1.5 whitespace-nowrap">
            {promptSuggestions.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 bg-white border border-[#D9C8AF] rounded-full text-[10px] font-medium text-[#5C453E] hover:border-[#4A0E17] hover:text-[#4A0E17] transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-[#E8DAC2]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask about skin undertones, bridal routines, or products..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-[#FCF9F5] border border-[#D9C8AF] rounded-full text-xs text-[#201815] focus:outline-none focus:border-[#4A0E17] placeholder:text-[#8E7E73]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#4A0E17] hover:bg-[#621420] text-white flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
