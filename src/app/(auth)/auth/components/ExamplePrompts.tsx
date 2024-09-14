import React from 'react';

type Prompt = {
  text: string;
  icon: string;
};

const prompts: Prompt[] = [
  { text: "Set a medicine reminder", icon: "💊" },
  { text: "Nutrition tips for seniors", icon: "🥗" },
];

interface ExamplePromptsProps {
  onPromptClick: (prompt: string) => void;
}

export function ExamplePrompts({ onPromptClick }: ExamplePromptsProps) {
  return (
    <div className="my-4">
      <h2 className="text-lg font-semibold mb-2">Example Prompts</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt.text)}
            className="flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <span className="mr-2 text-xl">{prompt.icon}</span>
            <span className="text-sm text-left">{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}