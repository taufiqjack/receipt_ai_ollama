'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState(''); // for typing effect
  const [image, setImage] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  const sendPrompt = async () => {
    setIsLoading(true);
    setResponse('');
    setDisplayedResponse('');
    setIsTyping(false);

    try {
      let res;
      if (image) {
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('image', image);
        formData.append('model', 'llava:3b');

        res = await fetch('/api/v2', {
          method: 'POST',
          body: formData,
        });
      } else {
        res = await fetch('/api/v2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
      }

      const data = await res.json();
      const reply = data.reply || data.error || 'No reply';

      setResponse(reply);
      setIsTyping(true); // start typing effect
    } catch (err) {
      setResponse('Error connecting to Ollama.');
    }
    finally {
      setIsLoading(false);
    }

  };

  // Typing animation effect
  useEffect(() => {
    if (!isTyping || !response) return;

    let index = 0;
    setDisplayedResponse('');
    const interval = setInterval(() => {
      setDisplayedResponse((prev) => prev + response.charAt(index));
      index++;
      if (index >= response.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20); // speed (ms per character)

    return () => clearInterval(interval);
  }, [isTyping, response]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">NgobrolAI</h1>

      <textarea
        className="border border-gray-700 rounded w-full p-2 mb-4 max-w-xl bg-gray-800 text-white"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="tulis pertanyaan disini"
      />
      <label className="mb-4 inline-block">
        <span className="sr-only">Unggah Gambar</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="hidden"
          id="unggah-gambar"
        />
        <label
          htmlFor="unggah-gambar"
          className="cursor-pointer bg-gray-600 text-white text-sm italic py-2 px-4 rounded-lg hover:bg-gray-700 transition"
        >
          Unggah Gambar
        </label>
      </label>

      <button
        onClick={sendPrompt}
        className="bg-blue-600 text-white px-10 py-2 rounded hover:bg-blue-700"
      >
        Kirim
      </button>

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          className="mt-4 w-64 rounded shadow"
        />
      )}

      {(isLoading || response || displayedResponse) && (
        <div className="mt-6 w-full max-w-xl bg-gray-800 p-4 rounded">
          <strong>Respon :</strong>
          <p className="mt-2 whitespace-pre-wrap text-gray-100 flex items-center">
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="flex space-x-1 ml-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                </span>
              </span>
            ) : (
              <>
                {displayedResponse || (isTyping ? '' : response) || ''}
                {isTyping && !isLoading && <span className="animate-pulse">▍</span>}
              </>
            )}
          </p>
        </div>
      )}

    </main>
  );
}


