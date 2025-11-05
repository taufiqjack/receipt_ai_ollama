import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { prompt, model = "llama3" } = await req.json();

        const res = await fetch("http://127.0.0.1:11434/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model,
                messages: [{ role: "user", content: prompt }],
                stream: false,
            }),
        });

        const text = await res.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            console.error("Failed to parse Ollama response:", text);
            throw new Error("Ollama returned invalid JSON");
        }

        return NextResponse.json({ reply: data.message?.content || "No reply" });
    } catch (err: any) {
        console.error("API route error:", err);
        return NextResponse.json(
            { error: err.message || "Unexpected error" },
            { status: 500 }
        );
    }
}
