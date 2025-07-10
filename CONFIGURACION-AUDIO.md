# Configuración de Audio Centralizada - 🐍PyVoice JSound⚡

## ¿Por qué centralizar la configuración?

### Problema anterior
La configuración de audio estaba **duplicada** en:
- **`app.js`** - Configuración principal 
- **`simple-recorder.js`** - Valores por defecto del grabador

Causaba:
- ❌ **Duplicación** - Mismos valores en múltiples lugares
- ❌ **Inconsistencias** - Valores diferentes generaban problemas
- ❌ **Mantenimiento difícil** - Cambios requerían editar múltiples archivos

### Solución: audio-config.js
Configuración centralizada única con métodos helper automáticos:

```javascript
const AudioConfig = {
    sampleRate: 48000,        // 48 kHz alta calidad
    channelCount: 1,          // Mono para análisis de voz
    bitDepth: 16,             // 16 bits estándar WAV
    echoCancellation: true,   // Cancelación de eco
    noiseSuppression: true,   // Supresión de ruido
    autoGainControl: true,    // Control automático ganancia
    
    getBitRate() { /* calcula automáticamente */ },
    getMediaConfig() { /* config getUserMedia */ },
    getDescription() { /* descripción legible */ },
    updateSampleRate() { /* ajusta al AudioContext real */ },
    logConfig() { /* logging unificado */ }
};
```

## Beneficios

### ✅ **Una sola fuente de verdad**
- Toda la configuración en un solo lugar
- Sin duplicación ni inconsistencias
- Fácil identificar configuración activa

### ✅ **Mantenimiento simplificado**
- Un solo archivo para cambios
- Actualización automática en todos los módulos
- Menos errores

### ✅ **Funcionalidad mejorada**
- Cálculo automático de bit rate
- Generación automática de configuración para APIs
- Logging unificado y consistente

### ✅ **Flexibilidad mantenida**
- `SimpleRecorder` acepta configuración personalizada
- Configuración centralizada como defaults
- Fácil extensión

## Arquitectura

### Orden de carga:
```html
<script src="js/audio-config.js"></script>    <!-- 1. Config central -->
<script src="js/simple-recorder.js"></script> <!-- 2. Grabador -->
<script src="js/speech-to-text.js"></script>  <!-- 3. STT/TTS -->
<script src="js/client.js"></script>          <!-- 4. API cliente -->
<script src="js/app.js"></script>             <!-- 5. App principal -->
```

### Flujo:
1. **`audio-config.js`** define `AudioConfig` global
2. **`simple-recorder.js`** usa `AudioConfig` como base
3. **`app.js`** instancia `SimpleRecorder()` sin parámetros
4. **AudioContext** ajusta sample rate automáticamente

## Antes vs Después

### ❌ Antes (duplicado):
**app.js:**
```javascript
const audioConfig = {
    sampleRate: 48000,
    channelCount: 1,
    // ... más configuración
};
const recorder = new SimpleRecorder(audioConfig);
```

**simple-recorder.js:**
```javascript
this.config = {
    sampleRate: config.sampleRate || 44100,  // ❌ Diferente!
    channelCount: config.channelCount || 1,
    // ... duplicación
};
```

### ✅ Después (centralizado):
**audio-config.js:**
```javascript
const AudioConfig = {
    sampleRate: 48000,
    channelCount: 1,
    // ... configuración unificada
};
```

**app.js:**
```javascript
const recorder = new SimpleRecorder(); // ✅ Usa config centralizada
```

**simple-recorder.js:**
```javascript
this.config = {
    ...AudioConfig,  // ✅ Config centralizada
    ...config        // ✅ Permite sobrescritura
};
```

## Compatibilidad

### ✅ **Totalmente compatible**
- Código existente funciona igual
- API de `SimpleRecorder` sin cambios
- Mismos métodos y propiedades

### ✅ **Configuración personalizada**
```javascript
// Sigue funcionando para casos específicos:
const customRecorder = new SimpleRecorder({
    sampleRate: 22050,
    channelCount: 2
});
```

### ✅ **Ajuste automático**
- Sample rate se ajusta al AudioContext real
- Logging detallado de ajustes
- Validación de metadata WAV mejorada

## Extensibilidad

Fácil agregar nuevas funcionalidades:
- 🔧 **Nuevos formatos de audio**
- 🔧 **Perfiles de calidad**  
- 🔧 **Configuración por dispositivo**
- 🔧 **Presets por caso de uso**

```javascript
// Ejemplo futuro:
AudioConfig.presets = {
    highQuality: { sampleRate: 48000, bitDepth: 24 },
    mobile: { sampleRate: 22050, bitDepth: 16 }
};
```

---

**🐍PyVoice JSound⚡** - Configuración centralizada para mejor mantenibilidad 🎯
