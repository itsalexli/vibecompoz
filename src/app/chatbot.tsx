// chatbot.tsx
"use client";

import React, { useState } from "react";
import OpenAI from "openai";

// DeepSeek API initialization (unchanged)
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-21f6ba853df84334b8cbda1d1d2cc3f8",
  dangerouslyAllowBrowser: true,
});

interface ChatbotProps {
  // CHANGED: declare onAnswer prop
  onAnswer: (ans: string) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onAnswer }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleClick = async () => {
    if (!inputValue.trim()) return;

    try {
      const completion = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content:
              "give the abcjs string for this prompt. Only give the answer: " +
              inputValue,
          },
        ],
      });

      const ans = completion.choices[0].message.content || "No response.";
      setResponse(ans);

      // CHANGED: push new answer up to parent
      onAnswer(ans);
    } catch (err) {
      console.error("API Error:", err);
      setResponse("There was an error fetching the response.");
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <input
        className="w-full text-white p-2 border rounded"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Ask me anything…"
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleClick}
      >
        Submit
      </button>
      {response && (
        <div className="mt-4 p-2 border rounded bg-gray-50">{response}</div>
      )}
    </div>
  );
};

export default Chatbot;
