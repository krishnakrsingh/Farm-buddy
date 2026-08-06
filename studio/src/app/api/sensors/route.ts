import { NextResponse } from "next/server";

// In-memory cache for latest serial sensor telemetry
let latestSensorData: any = null;
let lastUpdateTime = 0;

export async function GET() {
    const isOnline = Date.now() - lastUpdateTime < 3000;
    return NextResponse.json({
        data: latestSensorData,
        isHardwareOnline: isOnline && !!latestSensorData,
        lastSeen: lastUpdateTime > 0 ? new Date(lastUpdateTime).toISOString() : null,
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        latestSensorData = body;
        lastUpdateTime = Date.now();
        return NextResponse.json({ success: true, timestamp: lastUpdateTime });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    }
}
