import { NextRequest, NextResponse } from "next/server";

const DEFAULT_OLLAMA = process.env.OLLAMA_URL || "http://127.0.0.1:11434";

// GET /api/ollama?url=http://...  → list models
export async function GET(req: NextRequest) {
    const customUrl = req.nextUrl.searchParams.get("url");
    const ollamaBase = customUrl || DEFAULT_OLLAMA;

    try {
        const res = await fetch(`${ollamaBase}/api/tags`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`Ollama responded with ${res.status}`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            { error: `Cannot connect to Ollama at ${ollamaBase}`, detail: err.message },
            { status: 502 }
        );
    }
}

// POST /api/ollama  → chat   body: { ollamaUrl?, model, messages, stream }
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { ollamaUrl, ...chatBody } = body;
        const ollamaBase = ollamaUrl || DEFAULT_OLLAMA;

        const res = await fetch(`${ollamaBase}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(chatBody),
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                { error: `Ollama error: ${res.status}`, detail: text },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            { error: "Cannot connect to Ollama. Is it running?", detail: err.message },
            { status: 502 }
        );
    }
}
