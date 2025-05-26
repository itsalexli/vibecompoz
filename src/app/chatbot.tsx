"use client";

import React, { useState, useRef } from "react";
import OpenAI from "openai";

// DeepSeek API initialization
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-21f6ba853df84334b8cbda1d1d2cc3f8",
  dangerouslyAllowBrowser: true,
});

interface ChatbotProps {
  onAnswer: (ans: string) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onAnswer }) => {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState("");
  const prevResponse = useRef("");

  const handleClick = async () => {
    if (!inputValue.trim()) return;

    try {
      const prompt = `
You are an expert in ABC notation (abcjs).  
 
Original abcjs string (If needed, you can refer to this. If not needed, ignore it):
\`\`\`
${prevResponse.current}
\`\`\`
 
User request:
“${inputValue}”
 
Please:
1. Generate ONLY the updated abcjs code—no explanations or extra text.  
2. Add or update the title line (T:) to match the piece name.  
3. Wrap at most 8 bars per line.  
4. Ensure the syntax is valid for abcjs rendering.
`;
      const completion = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const ans = completion.choices[0].message.content || "No response.";
      setResponse(ans);
      prevResponse.current = ans;
      onAnswer(ans);
      console.log("Response:", ans);
      setInputValue("");
    } catch (err) {
      console.error("API Error:", err);
      setResponse("There was an error fetching the response.");
    }
  };

  return (
    <div className="w-144 mx-auto h-40 p-6 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-lg space-y-4 mt-0 ml-0">
      <h2 className="text-lg font-semibold text-white">🎼 ABC Agent</h2>

      <div className="flex items-center gap-2">
        <input
          className="flex-1 bg-neutral-800 text-white px-4 py-2 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your prompt…"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-0 rounded-lg transition"
          onClick={handleClick}
        >
          Compose
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
