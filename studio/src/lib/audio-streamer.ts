export class AudioStreamer {
    public audioContext: AudioContext | null = null;
    public gainNode: GainNode | null = null;
    public audioQueue: Float32Array[] = [];
    public startTime = 0;
    public isMuted = false;

    constructor() {
        // Don't create AudioContext here — browsers require user interaction first
    }

    setMuted(muted: boolean) {
        this.isMuted = muted;
        if (this.gainNode) {
            this.gainNode.gain.value = muted ? 0 : 1;
        }
    }

    private ensureContext(): AudioContext {
        if (!this.audioContext || this.audioContext.state === "closed") {
            const AudioCtx =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            this.audioContext = new AudioCtx({
                sampleRate: 24000, // Gemini Live output is 24kHz
            });
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = this.isMuted ? 0 : 1;
            this.gainNode.connect(this.audioContext.destination);
        }
        return this.audioContext;
    }

    addPCM16(chunk: Int16Array) {
        const float32 = new Float32Array(chunk.length);
        for (let i = 0; i < chunk.length; i++) {
            float32[i] = chunk[i] / 32768;
        }
        this.audioQueue.push(float32);
        this.scheduleQueue();
    }

    private async scheduleQueue() {
        const ctx = this.ensureContext();
        if (ctx.state === "suspended") {
            await ctx.resume();
        }

        if (this.startTime < ctx.currentTime) {
            this.startTime = ctx.currentTime;
        }

        while (this.audioQueue.length > 0) {
            const buffer = this.audioQueue.shift();
            if (!buffer) break;

            const audioBuffer = ctx.createBuffer(1, buffer.length, 24000);
            audioBuffer.getChannelData(0).set(buffer);

            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.gainNode!);
            source.start(this.startTime);
            this.startTime += audioBuffer.duration;
        }
    }

    async resume() {
        const ctx = this.ensureContext();
        if (ctx.state === "suspended") {
            await ctx.resume();
        }
    }

    stop() {
        this.audioQueue = [];
        this.startTime = 0;
        if (this.audioContext && this.audioContext.state !== "closed") {
            this.audioContext.close().catch(() => {});
        }
        this.audioContext = null;
        this.gainNode = null;
    }
}
