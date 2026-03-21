import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/weather?q=<lat,lng or city>
 * Proxies requests to WeatherAPI.com, keeping the API key server-side only.
 */
export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("q") || "New Delhi";

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "Weather API key not configured. Set WEATHER_API_KEY in environment variables." },
            { status: 500 }
        );
    }

    try {
        const res = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=2`,
            { signal: AbortSignal.timeout(8000) }
        );

        if (!res.ok) {
            const text = await res.text();
            console.error("WeatherAPI error:", res.status, text);
            return NextResponse.json(
                { error: `Weather service error (${res.status})` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: any) {
        console.error("Weather fetch failed:", err.message);
        return NextResponse.json(
            { error: "Failed to fetch weather data" },
            { status: 502 }
        );
    }
}
