# 🎤 Predictor de Género por Voz

Una aplicación web que utiliza inteligencia artificial para predecir el género basado en archivos de audio WAV. La aplicación permite subir archivos o grabar directamente desde el micrófono.

## 📋 Características

- **📁 Subida de archivos**: Soporta archivos WAV para análisis
- **🎙️ Grabación en vivo**: Graba audio directamente desde el micrófono
- **🎯 Predicción IA**: Utiliza modelos de machine learning para predecir el género
- **📊 Resultados detallados**: Muestra probabilidades y nivel de confianza
- **🎵 Reproducción**: Permite reproducir el audio antes del análisis
- **💾 Descarga**: Descarga archivos WAV grabados con metadata completa

## 🔧 Especificaciones Técnicas

### Configuración de Audio
- **Sample Rate**: 48.000 Hz (48 kHz)
- **Canales**: 1 (Mono)
- **Bit Depth**: 16 bits
- **Bit Rate**: 768 kbps
- **Formato**: WAV con metadata completa

### Características de Grabación
- **Echo Cancellation**: Activado
- **Noise Suppression**: Activado
- **Auto Gain Control**: Activado
- **Grabación local**: Utiliza SimpleRecorderJs (sin dependencias externas)

## 🚀 Instalación y Configuración

### Requisitos Previos
- Servidor web (Apache/Nginx) o servidor local
- Navegador moderno con soporte para Web Audio API
- Micrófono (para grabación)

### Instalación
1. Clona o descarga el repositorio
2. Coloca los archivos en tu servidor web
3. Configura la API backend (ver sección API)
4. Abre `index.html` en tu navegador

### Estructura del Proyecto
```
FrontRecoGenVoz/
├── index.html              # Página principal
├── test-recorder.html      # Página de pruebas de grabación
├── app.js                  # Lógica principal de la aplicación
├── client.js               # Cliente para comunicación con API
├── simple-recorder.js      # Grabador de audio personalizado
├── styles.css              # Estilos de la aplicación
├── test-api.html          # Pruebas de API
├── SimpleRecorderJs/       # Librería local de grabación
│   ├── js/
│   │   ├── recorder.js     # Implementación del grabador
│   │   └── app.js          # Ejemplo de uso
│   ├── index.html          # Demo de SimpleRecorderJs
│   └── style.css           # Estilos del demo
└── README.md              # Este archivo
```

## 🎯 Uso de la Aplicación

### Método 1: Subir Archivo WAV
1. Arrastra un archivo WAV al área de subida o haz clic para seleccionar
2. El archivo se reproducirá automáticamente para verificación
3. Haz clic en "🎯 Predecir Género" para analizar
4. Los resultados aparecerán con probabilidades detalladas

### Método 2: Grabar desde Micrófono
1. Haz clic en "🔴 Iniciar Grabación"
2. Permite el acceso al micrófono cuando se solicite
3. Habla claramente hacia el micrófono
4. Haz clic en "⏹️ Detener Grabación" cuando termines
5. Reproduce el audio para verificar la calidad
6. Haz clic en "🎯 Predecir Género" para analizar

### Interpretación de Resultados
- **Género Predicho**: Masculino/Femenino
- **Nivel de Confianza**: Porcentaje de certeza
- **Probabilidades**: Desglose detallado para cada género

## 🔌 Configuración de la API

### API Endpoint
La aplicación se conecta a una API backend para realizar las predicciones. Configure la URL en `client.js`:

```javascript
class GenderAPI {
    constructor() {
        this.baseURL = 'http://localhost:5000/api'; // Cambiar según tu configuración
    }
}
```

### Endpoints Esperados
- `GET /status` - Verificar estado de la API
- `POST /predict` - Enviar archivo WAV para predicción

### Formato de Respuesta
```json
{
    "prediction": "male" | "female",
    "confidence": 0.85,
    "probabilities": {
        "male": 0.85,
        "female": 0.15
    }
}
```

## 🛠️ Desarrollo y Personalización

### Modificar Configuración de Audio
Edita las configuraciones en `app.js` y `test-recorder.html`:

```javascript
const audioConfig = {
    sampleRate: 48000,        // Frecuencia de muestreo
    channelCount: 1,          // Número de canales
    bitDepth: 16,             // Profundidad de bits
    echoCancellation: true,   // Cancelación de eco
    noiseSuppression: true,   // Supresión de ruido
    autoGainControl: true     // Control automático de ganancia
};
```

### Personalizar Interfaz
- **Estilos**: Modifica `styles.css` para cambiar la apariencia
- **Colores**: Ajusta la paleta de colores en las variables CSS
- **Iconos**: Cambia los emojis por iconos personalizados

### Agregar Funcionalidades
- **Más formatos**: Extender soporte a MP3, FLAC, etc.
- **Análisis avanzado**: Agregar métricas adicionales
- **Histórico**: Guardar predicciones anteriores
- **Visualización**: Agregar gráficos de forma de onda

## 🧪 Pruebas

### Página de Pruebas
Abre `test-recorder.html` para:
- Probar la funcionalidad de grabación
- Verificar la calidad del audio
- Comprobar la metadata de los archivos WAV
- Validar la configuración de audio

### Pruebas de API
Usa `test-api.html` para:
- Verificar la conectividad con la API
- Probar endpoints individualmente
- Validar formatos de respuesta

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 66+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+

### Características Requeridas
- Web Audio API
- MediaDevices API
- Fetch API
- File API
- Drag and Drop API

## 🔒 Seguridad

### Consideraciones de Privacidad
- El audio se procesa localmente hasta el envío
- Los archivos no se almacenan permanentemente
- La comunicación con la API debe usar HTTPS en producción

### Recomendaciones
- Implementar límites de tamaño de archivo
- Validar tipos de archivo en el servidor
- Usar CSRF protection en la API
- Implementar rate limiting

## 🐛 Solución de Problemas

### Problemas Comunes

**Error: "No se puede acceder al micrófono"**
- Verifica que el navegador tenga permisos de micrófono
- Asegúrate de estar usando HTTPS (requerido para getUserMedia)
- Comprueba que el micrófono esté conectado y funcionando

**Error: "API no disponible"**
- Verifica que el servidor backend esté ejecutándose
- Comprueba la URL de la API en `client.js`
- Revisa la consola del navegador para errores de CORS

**Audio de baja calidad**
- Verifica la configuración del micrófono
- Asegúrate de que el sample rate sea compatible
- Comprueba que no haya interferencias de audio

**Archivo WAV no válido**
- Verifica que el archivo sea realmente WAV
- Comprueba que la metadata esté presente
- Asegúrate de que el archivo no esté corrupto

## 📊 Métricas y Rendimiento

### Tamaños de Archivo Esperados
- **5 segundos**: ~480 KB
- **10 segundos**: ~960 KB
- **30 segundos**: ~2.8 MB
- **1 minuto**: ~5.6 MB

### Tiempo de Procesamiento
- **Grabación**: Tiempo real
- **Conversión a WAV**: <1 segundo
- **Predicción**: Depende de la API (típicamente 1-3 segundos)

## 🤝 Contribuciones

### Cómo Contribuir
1. Fork el proyecto
2. Crea una rama para tu característica
3. Realiza tus cambios
4. Ejecuta las pruebas
5. Envía un pull request

### Estándares de Código
- Usa comentarios descriptivos
- Sigue las convenciones de naming
- Mantén las funciones pequeñas y enfocadas
- Documenta las APIs públicas

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Créditos

- **SimpleRecorderJs**: Librería de grabación personalizada
- **Web Audio API**: Para procesamiento de audio
- **Recorder.js**: Inspiración para la implementación

## 📞 Soporte

Para reportar bugs o solicitar características:
1. Abre un issue en el repositorio
2. Describe el problema detalladamente
3. Incluye información del navegador y sistema
4. Proporciona pasos para reproducir el problema

---

**Desarrollado con ❤️ para análisis de audio y machine learning**
