"use client";

import React, { useState } from "react";
import OpenAI from "openai";

// DeepSeek API initialization
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-21f6ba853df84334b8cbda1d1d2cc3f8",
  dangerouslyAllowBrowser: true, // Replace with process.env.NEXT_PUBLIC_... in real apps
});

const Chatbot: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleClick = async () => {
    if (!inputValue.trim()) return;

    try {
      const completion = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: inputValue },
        ],
      });

      const ans = completion.choices[0].message.content;
      setResponse(ans || "No response.");
    } catch (err) {
      console.error("API Error:", err);
      setResponse("There was an error fetching the response.");
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Ask something..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="border border-gray-400 rounded p-2 w-full"
      />
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>
      {response && (
        <div className="bg-gray-100 p-3 rounded">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
