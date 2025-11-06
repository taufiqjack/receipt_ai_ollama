'use client';
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const sendPrompt = async () => {
    setResponse('Loading...');

    try {
      let res;
      if (image) {
        // use multipart form for image + text
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('image', image);
        formData.append('model', 'llava:3b');

        res = await fetch('/api/ollama', {
          method: 'POST',
          body: formData,
        });
      } else {
        // use JSON for text-only
        res = await fetch('/api/ollama', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
      }

      const data = await res.json();
      setResponse(data.reply || data.error || 'No reply');
    } catch (err) {
      setResponse('Error connecting to Ollama.');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">NgobrolAI (with Image Support)</h1>

      <textarea
        className="border border-gray-700 rounded w-full p-2 mb-4 max-w-xl bg-gray-800 text-white"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your question..."
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-4 text-sm text-gray-400
             file:mr-4 file:py-1 file:px-3 
             file:rounded-lg file:border-0 
             file:text-sm file:font-italic 
             file:bg-gray-600 file:text-white 
             hover:file:bg-gray-700 cursor-pointer"
      />

      <button
        onClick={sendPrompt}
        className="bg-blue-600 text-white px-10 py-2 rounded hover:bg-blue-700"
      >
        Send
      </button>

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          className="mt-4 w-64 rounded shadow"
        />
      )}

      <div className="mt-6 w-full max-w-xl bg-gray-800 p-4 rounded">
        <strong>Response:</strong>
        <p className="mt-2 whitespace-pre-wrap text-gray-100">{response}</p>
      </div>
    </main>
  );
}
