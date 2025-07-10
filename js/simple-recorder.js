// simple-recorder.js - Grabador de audio WAV con metadata usando Recorder.js

class SimpleRecorder {
    constructor(config = {}) {
        this.recorder = null;
        this.audioContext = null;
        this.audioInput = null;
        this.stream = null;
        this.audioBlob = null;
        this.audioUrl = null;
        this.isRecording = false;
        
        // Usar configuración centralizada como base y permitir sobrescritura
        this.config = {
            ...AudioConfig,
            ...config  // Las configuraciones pasadas tienen prioridad
        };
        
        // Calcular velocidad de bits
        this.config.bitRate = this.config.getBitRate();
        
        this.logConfig();
    }
    
    logConfig() {
        console.log('🎤 SimpleRecorder configurado con metadata:');
        console.log(`- ${this.config.getDescription()}`);
    }
    
    async initialize() {
        try {
            // Verificar que Recorder esté disponible (desde SimpleRecorderJs local)
            if (typeof Recorder === 'undefined') {
                console.error('❌ SimpleRecorderJs no está cargado correctamente');
                return false;
            }
            
            // Obtener stream del micrófono con configuración centralizada
            this.stream = await navigator.mediaDevices.getUserMedia(this.config.getMediaConfig());
            
            return true;
            
        } catch (error) {
            console.error('❌ Error al acceder al micrófono:', error);
            return false;
        }
    }
    
    async setupAudioContext() {
        if (!this.audioContext) {
            // Crear contexto de audio
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Reanudar contexto si está suspendido
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            // Crear entrada de audio
            this.audioInput = this.audioContext.createMediaStreamSource(this.stream);
            
            // Crear recorder usando SimpleRecorderJs local
            this.recorder = new Recorder(this.audioInput, {
                numChannels: this.config.channelCount
            });
            
            //console.log('✅ AudioContext configurado con SimpleRecorderJs local');
            //console.log(`📊 Sample Rate del contexto: ${this.audioContext.sampleRate} Hz`);
            
            // Actualizar configuración con el sample rate real del AudioContext
            this.config.updateSampleRate(this.audioContext.sampleRate);
            this.config.bitRate = this.config.getBitRate();
            
            //console.log(`📊 Configuración del recorder: ${this.config.channelCount} canales`);
        }
    }
    
    async startRecording() {
        if (this.isRecording) {
            console.warn('Ya hay una grabación en progreso');
            return false;
        }
        
        try {
            // Inicializar si no está inicializado
            if (!this.stream) {
                const initialized = await this.initialize();
                if (!initialized) {
                    return false;
                }
            }
            
            // Configurar audio context
            await this.setupAudioContext();
            
            // Limpiar grabación anterior
            this.recorder.clear();
            
            // Iniciar grabación
            this.recorder.record();
            this.isRecording = true;
            
            return true;
            
        } catch (error) {
            console.error('❌ Error al iniciar grabación:', error);
            return false;
        }
    }
    
    async stopRecording() {
        if (!this.isRecording || !this.recorder) {
            console.warn('No hay grabación en progreso');
            return null;
        }
        
        return new Promise((resolve) => {
            try {
                // Detener grabación
                this.recorder.stop();
                this.isRecording = false;
                
                // Exportar como WAV usando SimpleRecorderJs
                this.recorder.exportWAV((blob) => {
                    if (!blob || blob.size === 0) {
                        console.error('❌ Error: No se pudo generar el archivo WAV');
                        resolve(null);
                        return;
                    }
                    
                    // Guardar blob y crear URL
                    this.audioBlob = blob;
                    this.audioUrl = URL.createObjectURL(blob);
                    
                    // Mostrar información del archivo con metadata
                    this.displayFileInfo(blob);
                    
                    // Analizar metadata WAV
                    this.analyzeWAVFile(blob);
                    
                    resolve(blob);
                });
                
            } catch (error) {
                console.error('❌ Error al detener grabación:', error);
                resolve(null);
            }
        });
    }
    
    displayFileInfo(blob) {
        const sizeInBytes = blob.size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
        
        // Calcular duración estimada
        const bytesPerSecond = this.config.getBitRate() / 8;
        const estimatedDuration = Math.max(0, (sizeInBytes - 44) / bytesPerSecond);
    }
    
    analyzeWAVFile(blob) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const arrayBuffer = e.target.result;
                const view = new DataView(arrayBuffer);
                
                // Leer header WAV
                const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
                const fileSize = view.getUint32(4, true);
                const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11));
                const fmt = String.fromCharCode(view.getUint8(12), view.getUint8(13), view.getUint8(14), view.getUint8(15));
                const audioFormat = view.getUint16(20, true);
                const numChannels = view.getUint16(22, true);
                const sampleRate = view.getUint32(24, true);
                const byteRate = view.getUint32(28, true);
                const blockAlign = view.getUint16(32, true);
                const bitsPerSample = view.getUint16(34, true);
                
                // Validar metadata
                const expectedByteRate = (sampleRate * numChannels * bitsPerSample) / 8;
                const expectedBlockAlign = (numChannels * bitsPerSample) / 8;
                
                const isValid = 
                    riff === 'RIFF' &&
                    wave === 'WAVE' &&
                    fmt === 'fmt ' &&
                    audioFormat === 1 &&
                    numChannels === this.config.channelCount &&
                    sampleRate === this.config.sampleRate &&
                    bitsPerSample === this.config.bitDepth &&
                    byteRate === expectedByteRate &&
                    blockAlign === expectedBlockAlign;
                
            } catch (error) {
                console.error('❌ Error al analizar archivo WAV:', error);
            }
        };
        
        reader.readAsArrayBuffer(blob);
    }
    
    getAudioInfo() {
        if (!this.audioBlob) {
            return null;
        }
        
        const sizeInBytes = this.audioBlob.size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
        
        // Calcular duración estimada
        const bytesPerSecond = this.config.getBitRate() / 8;
        const estimatedDuration = Math.max(0, (sizeInBytes - 44) / bytesPerSecond);
        
        return {
            size: {
                bytes: sizeInBytes,
                kb: sizeInKB,
                mb: sizeInMB
            },
            duration: estimatedDuration,
            format: 'WAV PCM',
            mimeType: this.audioBlob.type,
            config: { ...this.config }
        };
    }
    
    getAudioBlob() {
        return this.audioBlob;
    }
    
    getAudioUrl() {
        return this.audioUrl;
    }
    
    download(filename = null) {
        if (!this.audioBlob || !this.audioUrl) {
            console.error('❌ No hay audio para descargar');
            return false;
        }
        
        const defaultFilename = `grabacion_${this.config.sampleRate}hz_${this.config.channelCount}ch_${this.config.bitDepth}bit_${new Date().toISOString().slice(0,16).replace(/:/g, '-')}.wav`;
        
        const a = document.createElement('a');
        a.href = this.audioUrl;
        a.download = filename || defaultFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log('💾 Descarga iniciada:', a.download);
        return true;
    }
    
    cleanup() {
        try {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }
            
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
            }
            
            if (this.audioUrl) {
                URL.revokeObjectURL(this.audioUrl);
                this.audioUrl = null;
            }
            
            this.recorder = null;
            this.audioInput = null;
            this.audioBlob = null;
            this.isRecording = false;
            
            console.log('🧹 SimpleRecorder limpiado');
            
        } catch (error) {
            console.error('❌ Error al limpiar SimpleRecorder:', error);
        }
    }
}

// Exportar para usar en otros scripts
window.SimpleRecorder = SimpleRecorder;

// Cleanup al cerrar la página
window.addEventListener('beforeunload', () => {
    if (window.recorder && window.recorder.cleanup) {
        window.recorder.cleanup();
    }
});
