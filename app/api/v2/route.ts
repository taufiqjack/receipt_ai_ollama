import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get('content-type') || '';

        let prompt = '';
        let imageBuffer: Buffer | null = null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            prompt = formData.get('prompt')?.toString() || '';
            const imageFile = formData.get('image') as File | null;
            if (imageFile) {
                const arrayBuffer = await imageFile.arrayBuffer();
                imageBuffer = Buffer.from(arrayBuffer);
            }
        } else {
            const body = await req.json();
            prompt = body.prompt || '';
        }

        const ollamaRes = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llava:13b',
                prompt,
                images: imageBuffer ? [imageBuffer.toString('base64')] : undefined,
                stream: false,
            }),
        });

        const data = await ollamaRes.json();
        console.log('Ollama Response:', data);

        return NextResponse.json({ reply: data.response });
    } catch (err: any) {
        console.error('Error in /api/v2:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
