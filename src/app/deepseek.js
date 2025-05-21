import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-21f6ba853df84334b8cbda1d1d2cc3f8",
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Capital of Canada" }],
    model: "deepseek-chat",
  });

  const ans = completion.choices[0].message.content;
  console.log(ans);
}

main();
