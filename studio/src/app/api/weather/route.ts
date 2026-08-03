import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/weather?q=<lat,lng or city>
 * Proxies requests to WeatherAPI.com, keeping the API key server-side only.
 * Returns structured fallback data if the API key is not configured or request fails.
 */
function getFallbackWeatherData() {
    const nowSec = Math.floor(Date.now() / 1000);
    const hourly = [];

    for (let i = 0; i < 24; i++) {
        const hourEpoch = nowSec + i * 3600;
        const date = new Date(hourEpoch * 1000);
        const hours = date.getHours();
        const isDay = hours >= 6 && hours <= 19 ? 1 : 0;
        const tempC = isDay ? 28 + (i % 4) : 24 - (i % 3);
        const conditionText = isDay ? (i % 2 === 0 ? "Partly Cloudy" : "Sunny") : "Clear";

        hourly.push({
            time_epoch: hourEpoch,
            temp_c: tempC,
            is_day: isDay,
            condition: { text: conditionText },
        });
    }

    return {
        current: {
            last_updated_epoch: nowSec,
            temp_c: 28,
            feelslike_c: 30,
            humidity: 68,
            wind_kph: 12,
            is_day: 1,
            condition: { text: "Partly Cloudy" },
        },
        forecast: {
            forecastday: [{ hour: hourly }],
        },
        isFallback: true,
    };
}

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("q") || "New Delhi";
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
        return NextResponse.json(getFallbackWeatherData());
    }

    try {
        const res = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=2`,
            { signal: AbortSignal.timeout(8000) }
        );

        if (!res.ok) {
            console.warn(`WeatherAPI responded with status ${res.status}. Using fallback weather data.`);
            return NextResponse.json(getFallbackWeatherData());
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn("Weather fetch failed:", message, "- Using fallback weather data.");
        return NextResponse.json(getFallbackWeatherData());
    }
}
