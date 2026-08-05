export class AudioRecorder {
    public audioContext: AudioContext;
    public scriptProcessor: ScriptProcessorNode | null = null;
    public source: MediaStreamAudioSourceNode | null = null;
    public sampleRate = 16000;
    public onData: (buffer: Int16Array) => void;
    public stream: MediaStream | null = null;

    constructor(onData: (buffer: Int16Array) => void) {
        this.onData = onData;
        const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioContext = new AudioCtx({ sampleRate: this.sampleRate });
    }

    async start(stream: MediaStream) {
        this.stream = stream;
        if (this.audioContext.state === "suspended") {
            await this.audioContext.resume();
        }

        // Create source
        this.source = this.audioContext.createMediaStreamSource(stream);
        this.scriptProcessor = this.audioContext.createScriptProcessor(2048, 1, 1);

        this.source.connect(this.scriptProcessor);
        this.scriptProcessor.connect(this.audioContext.destination);

        this.scriptProcessor.onaudioprocess = (e) => {
            const inputBuffer = e.inputBuffer.getChannelData(0); // Float32
            const actualSampleRate = this.audioContext.sampleRate;

            let resampled: Float32Array;
            if (actualSampleRate === this.sampleRate) {
                resampled = inputBuffer;
            } else {
                // Downsample or upsample to 16000Hz using linear interpolation
                const ratio = actualSampleRate / this.sampleRate;
                const newLength = Math.round(inputBuffer.length / ratio);
                resampled = new Float32Array(newLength);
                for (let i = 0; i < newLength; i++) {
                    const srcIndex = i * ratio;
                    const idx1 = Math.floor(srcIndex);
                    const idx2 = Math.min(idx1 + 1, inputBuffer.length - 1);
                    const weight = srcIndex - idx1;
                    resampled[i] = inputBuffer[idx1] * (1 - weight) + inputBuffer[idx2] * weight;
                }
            }

            // Convert Float32 to Int16
            const int16Buffer = new Int16Array(resampled.length);
            for (let i = 0; i < resampled.length; i++) {
                const s = Math.max(-1, Math.min(1, resampled[i]));
                int16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            this.onData(int16Buffer);
        };
    }

    stop() {
        if (this.scriptProcessor) {
            this.scriptProcessor.disconnect();
            this.scriptProcessor.onaudioprocess = null;
            this.scriptProcessor = null;
        }
        if (this.source) {
            this.source.disconnect();
            this.source = null;
        }
        if (this.audioContext && this.audioContext.state !== "closed") {
            this.audioContext.close().catch(() => {});
        }
    }
}
