import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Send, Upload } from "lucide-react";
import { ExamplePrompts } from './ExamplePrompts';
import { getLLMResponse } from '~/lib/llm-api';

type Message = {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    attachment?: string;
  };
  
export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePromptClick = async (prompt: string) => {
    await processMessage({
      id: Date.now().toString(),
      content: prompt,
      role: 'user',
    });
  };

  const handleSend = async () => {
    if (input.trim() === '' && !fileInputRef.current?.files?.length) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
    };

    if (fileInputRef.current?.files?.length) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        newUserMessage.attachment = e.target?.result as string;
        await processMessage(newUserMessage);
      };
      reader.readAsDataURL(file);
    } else {
      await processMessage(newUserMessage);
    }

    setInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processMessage = async (userMessage: Message) => {
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const assistantResponse = await getLLMResponse(userMessage.content, userMessage.attachment);
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantResponse,
        role: 'assistant',
      };
      setMessages(prev => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error('Error getting LLM response:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`flex items-start max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {message.attachment && <img src={message.attachment} alt="Uploaded" className="max-w-full mb-2 rounded" />}
                <p>{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <ExamplePrompts onPromptClick={handlePromptClick} isLoading={isLoading} />
      <div className="p-4 border-t">
        {/* ... (input and send button code) */}
      </div>
    </div>
  );
}