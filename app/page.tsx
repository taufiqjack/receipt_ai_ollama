'use client';
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const sendPrompt = async () => {
    setResponse('Loading...');
    const res = await fetch('/api/ollama', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResponse(data.reply || data.error);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">NgobrolAI</h1>
      <textarea
        className="border rounded w-full p-2 mb-4 max-w-xl"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask me anything..."
      />
      <button
        onClick={sendPrompt}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send
      </button>

      <div className="mt-6 w-full max-w-xl bg-black-100 p-4 rounded">
        <strong>Response:</strong>
        <p className="mt-2 text-white-pre-wrap">{response}</p>
      </div>
    </main>
  );
}
