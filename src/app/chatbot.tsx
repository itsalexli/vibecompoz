"use client";

import React, { useState, useRef } from "react";
import OpenAI from "openai";

// DeepSeek API initialization
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "your-api-key-here",
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

    // Check if API key is available
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      setResponse(
        "Error: API key is not configured. Please check your environment variables."
      );
      return;
    }

    try {
      const prompt = `
You are an expert in ABC notation (abcjs).  
 
Original abcjs (If needed, you can refer to this. If not needed, ignore it):
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
5. Don't show extra string quotes
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
    <div className="w-144 mx-auto h-40 p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl space-y-4 mt-0 ml-0 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white tracking-tight">
        🎼 ABC Agent
      </h2>

      <div className="flex items-center gap-3">
        <input
          className="flex-1 bg-slate-800/80 text-white px-4 py-3 rounded-xl border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 font-medium"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your prompt…"
        />
        <button
          className="bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 active:scale-95 text-white px-6 py-3 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          onClick={handleClick}
        >
          Compose
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
