// audio-config.js - Configuración centralizada de audio para 🐍PyVoice JSound⚡

/**
 * Configuración de audio unificada para toda la aplicación
 * Estos valores se usan para:
 * - Metadata de archivos WAV
 * - Configuración del MediaRecorder
 * - Validación de audio
 * - Cálculos de bit rate
 */
const AudioConfig = {
    // Configuración principal de calidad
    sampleRate: 48000,        // 48 kHz para alta calidad (se ajustará automáticamente al AudioContext)
    channelCount: 1,          // Mono para análisis de voz
    bitDepth: 16,             // 16 bits estándar para WAV
    
    // Configuración de procesamiento de audio
    echoCancellation: true,   // Cancelación de eco
    noiseSuppression: true,   // Supresión de ruido
    autoGainControl: true,    // Control automático de ganancia
    
    // Configuración de grabación
    mimeType: 'audio/wav',    // Tipo MIME preferido
    
    /**
     * Calcula el bit rate basado en la configuración actual
     * @returns {number} Bit rate en bits por segundo
     */
    getBitRate() {
        return this.sampleRate * this.channelCount * this.bitDepth;
    },
    
    /**
     * Obtiene la configuración para MediaRecorder
     * @returns {object} Configuración para getUserMedia
     */
    getMediaConfig() {
        return {
            audio: {
                sampleRate: this.sampleRate,
                channelCount: this.channelCount,
                echoCancellation: this.echoCancellation,
                noiseSuppression: this.noiseSuppression,
                autoGainControl: this.autoGainControl
            }
        };
    },
    
    /**
     * Obtiene información detallada de la configuración
     * @returns {string} Descripción textual de la configuración
     */
    getDescription() {
        return `${this.sampleRate} Hz, ${this.channelCount === 1 ? 'Mono' : 'Estéreo'}, ${this.bitDepth} bits, ${(this.getBitRate() / 1000).toFixed(1)} kbps`;
    },
    
    /**
     * Actualiza el sample rate basado en el AudioContext real
     * @param {number} actualSampleRate - Sample rate del AudioContext
     */
    updateSampleRate(actualSampleRate) {
        if (actualSampleRate && actualSampleRate !== this.sampleRate) {
            console.log(`🔄 Ajustando sample rate de ${this.sampleRate} Hz a ${actualSampleRate} Hz (AudioContext real)`);
            this.sampleRate = actualSampleRate;
        }
    },
    
    /**
     * Registra la configuración actual en la consola
     */
    logConfig() {
        console.log('🎵 Configuración de Audio - 🐍PyVoice JSound⚡');
        console.log(`- Sample Rate: ${this.sampleRate} Hz`);
        console.log(`- Canales: ${this.channelCount} (${this.channelCount === 1 ? 'Mono' : 'Estéreo'})`);
        console.log(`- Bit Depth: ${this.bitDepth} bits`);
        console.log(`- Bit Rate: ${this.getBitRate()} bps (${(this.getBitRate() / 1000).toFixed(1)} kbps)`);
        console.log(`- Cancelación de eco: ${this.echoCancellation ? 'Activada' : 'Desactivada'}`);
        console.log(`- Supresión de ruido: ${this.noiseSuppression ? 'Activada' : 'Desactivada'}`);
        console.log(`- Control automático de ganancia: ${this.autoGainControl ? 'Activado' : 'Desactivado'}`);
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioConfig;
}

// Hacer disponible globalmente para el navegador
if (typeof window !== 'undefined') {
    window.AudioConfig = AudioConfig;
}
