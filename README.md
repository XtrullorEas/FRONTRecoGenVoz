# 🎤 Predictor de Género por Voz

Una aplicación web avanzada que utiliza inteligencia artificial para predecir el género basado en archivos de audio WAV. La aplicación integra reconocimiento de voz en tiempo real, text-to-speech automático y avatares GIF interactivos.

## 📋 Características Principales

- **🎙️ Grabación + Reconocimiento Unificado**: Graba audio y reconoce voz simultáneamente
- **🎯 Predicción IA**: Utiliza modelos de machine learning para predecir el género
- **🔊 Text-to-Speech Automático**: Reproduce automáticamente el texto con voz adecuada al género
- **🎭 Avatares GIF Dinámicos**: Muestra avatares animados durante la reproducción TTS
- **📊 Resultados detallados**: Muestra probabilidades y nivel de confianza
- **🎵 Reproducción**: Permite reproducir el audio antes del análisis
- **💾 Descarga**: Descarga archivos WAV grabados con metadata completa
- **📱 Diseño Responsivo**: Interfaz adaptable para diferentes dispositivos

## ✨ Características Avanzadas

### 🗣️ Reconocimiento de Voz (Speech-to-Text)
- **API Web Speech Recognition**: Convierte voz a texto en tiempo real
- **Transcripción automática**: El texto se captura mientras grabas
- **Procesamiento interno**: La transcripción no se muestra en la UI principal

### 🔊 Text-to-Speech Inteligente
- **Reproducción automática**: Se activa automáticamente después de la predicción
- **Selección de voz por género**: 
  - **Masculino**: Voz "Raul" (español) como primera opción
  - **Femenino**: Voz "Sabina" (español) como primera opción
- **Voces de respaldo**: Sistema de fallback a voces en español e inglés
- **Controles ocultos**: Funcionalidad completamente automática

### 🎭 Sistema de Avatares GIF
- **Avatares por género**:
  - **Masculino**: `assets/hombregif.gif`
  - **Femenino**: `assets/mujergif.gif`
- **Responsive design**: Los GIFs se escalan manteniendo proporción
- **Visualización durante TTS**: Aparecen solo durante la reproducción
- **Personalización**: API para configurar GIFs personalizados

## 🚀 Flujo de Trabajo

1. **🎙️ Iniciar Grabación**: 
   - Haz clic en "Iniciar Grabación"
   - Se activan automáticamente tanto la grabación como el reconocimiento de voz
   - El texto hablado se transcribe en segundo plano

2. **⏹️ Detener Grabación**:
   - Haz clic en "Detener Grabación"
   - Se completa la grabación y transcripción

3. **🔍 Predicción Automática**:
   - El sistema envía el audio al modelo IA
   - Se obtiene la predicción de género con probabilidades

4. **🎭 Reproducción Automática**:
   - **Text-to-Speech**: Se reproduce automáticamente la transcripción
   - **Avatar GIF**: Aparece el avatar correspondiente al género predicho
   - **Voz Inteligente**: Se selecciona automáticamente la voz apropiada

5. **📊 Visualización de Resultados**:
   - Probabilidades de masculino/femenino
   - Nivel de confianza de la predicción
   - Opciones de descarga y reproducción manual

## 🏗️ Arquitectura del Sistema

### Organización de Archivos
El proyecto está organizado de manera modular para facilitar el mantenimiento y desarrollo:

#### 📁 **Directorio `/js/`**
- **`app.js`**: Lógica principal, coordinación entre componentes y funciones globales
- **`client.js`**: Cliente HTTP para comunicación con la API backend de predicción
- **`simple-recorder.js`**: Wrapper de alto nivel que abstrae la funcionalidad de grabación
- **`speech-to-text.js`**: Manejo de reconocimiento de voz, TTS y avatares GIF

#### 📁 **Directorio `/assets/`**
- **`hombregif.gif`**: Avatar masculino para reproducción TTS
- **`mujergif.gif`**: Avatar femenino para reproducción TTS

#### 🎨 **Directorio `/css/`**
- **`styles.css`**: Estilos principales + modal responsivo para GIFs

#### 🧪 **Directorio `/test/`**
- **`test-recorder.html`**: Página dedicada para probar funcionalidades de grabación
- **`test-api.html`**: Herramientas para verificar conectividad y respuestas de la API

#### ⚙️ **Directorio `/SimpleRecorderJs/`**
- **`recorder.js`**: Librería core compilada que maneja Web Audio API y generación de WAV

### Flujo de Datos Actualizado
```
Usuario → index.html → js/app.js → js/simple-recorder.js → SimpleRecorderJs/recorder.js
                   ↓                           ↓
                js/client.js → API Backend → js/speech-to-text.js
                                          ↓
                              Resultados + TTS + Avatar GIF
```

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

### APIs y Tecnologías
- **Web Speech API**: Para reconocimiento de voz (Speech-to-Text)
- **SpeechSynthesis API**: Para síntesis de voz (Text-to-Speech)
- **MediaRecorder API**: Para grabación de audio
- **Fetch API**: Para comunicación con el backend
- **Canvas API**: Para análisis de archivos WAV

### Configuración de Voces TTS
El sistema prioriza voces en español con fallback inteligente:

```javascript
// Orden de prioridad para voz masculina
1. "Microsoft Raul - Spanish (Spain)"
2. Cualquier voz española masculina
3. Voz inglesa masculina de respaldo

// Orden de prioridad para voz femenina
1. "Microsoft Sabina - Spanish (Spain)"
2. Cualquier voz española femenina
3. Voz inglesa femenina de respaldo
```

### Sistema Responsivo de GIFs
- **Detección automática de dimensiones**: Los GIFs se cargan y escalan dinámicamente
- **Preservación de aspect ratio**: Mantiene proporciones originales
- **Adaptación a viewport**: Se ajusta al 90% del ancho/alto de pantalla
- **Modal centrado**: Posicionamiento absoluto con flexbox para centrado perfecto

## 🚀 Instalación y Configuración

### Requisitos Previos
- Servidor web (Apache/Nginx) o servidor local
- Navegador moderno con soporte para Web Audio API y Web Speech API
- Micrófono (para grabación y reconocimiento de voz)
- Conexión a internet (para voces TTS de Microsoft)

### Instalación
1. Clona o descarga el repositorio
2. Coloca los archivos en tu servidor web
3. Asegúrate de que las imágenes GIF estén en `/assets/`
4. Configura la API backend (ver sección API)
5. Abre `index.html` en tu navegador

### Estructura del Proyecto Actualizada
```
FrontRecoGenVoz/
├── index.html              # Página principal unificada
├── README.md               # Documentación completa del proyecto
├── js/                     # Scripts JavaScript
│   ├── app.js              # Lógica principal + funciones globales
│   ├── client.js           # Cliente para comunicación con API
│   ├── simple-recorder.js  # Wrapper de alto nivel para grabación
│   └── speech-to-text.js   # STT, TTS y gestión de avatares
├── css/                    # Hojas de estilo
│   └── styles.css          # Estilos principales + modal GIF responsivo
├── assets/                 # Recursos multimedia
│   ├── hombregif.gif       # Avatar masculino (personalizable)
│   └── mujergif.gif        # Avatar femenino (personalizable)
├── test/                   # Páginas de prueba y testing
│   ├── test-recorder.html  # Pruebas de funcionalidad de grabación
│   └── test-api.html       # Pruebas de conectividad con API
└── SimpleRecorderJs/       # Librería core de grabación
    └── recorder.js         # Implementación base del grabador WAV
```

## 🎯 Uso de la Aplicación

### Flujo Principal: Grabación + Reconocimiento
1. **🎙️ Iniciar**: Haz clic en "Iniciar Grabación"
   - Se activa la grabación de audio
   - Se inicia el reconocimiento de voz automáticamente
   - Habla claramente hacia el micrófono

2. **⏹️ Detener**: Haz clic en "Detener Grabación"
   - Se completa la grabación del audio
   - Se finaliza la transcripción del texto hablado

3. **🤖 Análisis Automático**: 
   - El sistema envía automáticamente el audio para predicción
   - Se obtienen las probabilidades de género

4. **🎭 Reproducción Inteligente**:
   - **TTS Automático**: Se reproduce la transcripción con voz adecuada
   - **Avatar Dinámico**: Aparece el GIF correspondiente al género
   - **Escalado Responsivo**: El avatar se ajusta a tu pantalla

### Funciones Adicionales
- **🎵 Reproducir Audio**: Escucha la grabación original
- **💾 Descargar WAV**: Descarga el archivo con metadata completa
- **📊 Ver Probabilidades**: Detalles de confianza de la predicción

## 🎨 Personalización de Avatares

### Configuración de GIFs Personalizados
Puedes personalizar los avatares GIF usando la función global:

```javascript
// Desde la consola del navegador o script personalizado
setAvatarGifs(
    'ruta/a/mi/avatar/masculino.gif',
    'ruta/a/mi/avatar/femenino.gif'
);
```

### Recomendaciones para GIFs
- **Formato**: GIF animado
- **Tamaño**: Recomendado entre 200x200 y 800x600 píxeles
- **Duración**: 2-5 segundos de bucle
- **Peso**: Menos de 5MB para carga rápida
- **Contenido**: Avatares representativos y apropiados

## 🔌 Configuración de la API

### API Endpoint
La aplicación se conecta a una API backend para realizar las predicciones. Configure la URL en `js/client.js`:

```javascript
class GenderAPI {
    constructor() {
        this.baseURL = 'http://localhost:5000/api'; // Cambiar según tu backend
    }
}
```

### Formato de Respuesta Esperado
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

## ⚙️ Configuración Avanzada

### Personalización de Voces TTS
Para configurar voces personalizadas, modifica `js/speech-to-text.js`:

```javascript
// Configura voces preferidas por género
const voiceConfig = {
    male: {
        preferred: ["Microsoft Raul - Spanish (Spain)", "Google español"],
        fallback: "male"
    },
    female: {
        preferred: ["Microsoft Sabina - Spanish (Spain)", "Google español"],
        fallback: "female"
    }
};
```

### Configuración de Reconocimiento de Voz
Ajusta parámetros del Speech-to-Text:

```javascript
// En js/speech-to-text.js
recognition.lang = 'es-ES';              // Idioma principal
recognition.interimResults = false;       // Resultados intermedios
recognition.maxAlternatives = 1;          // Número de alternativas
recognition.continuous = false;           // Reconocimiento continuo
```

### Configuración de GIFs Responsivos
Los GIFs se escalan automáticamente, pero puedes ajustar los límites:

```css
/* En css/styles.css */
.gif-modal img {
    max-width: 90vw;    /* Máximo 90% del ancho de pantalla */
    max-height: 90vh;   /* Máximo 90% del alto de pantalla */
    object-fit: contain; /* Mantiene proporción */
}
```
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
Edita las configuraciones en `js/app.js`:

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

### Funciones Globales Disponibles
La aplicación expone funciones globales para personalización:

```javascript
// Configurar avatares GIF personalizados
setAvatarGifs(
    'assets/mi_avatar_masculino.gif',
    'assets/mi_avatar_femenino.gif'
);

// Acceder al gestor de voz globalmente
window.speechManager.speak('Texto personalizado', 'male');
```

### Personalizar Interfaz
- **Estilos**: Modifica `css/styles.css` para cambiar la apariencia
- **Colores**: Ajusta la paleta de colores en las variables CSS
- **GIFs**: Reemplaza los archivos en `/assets/` por avatares personalizados
- **Voces**: Configura voces TTS específicas en `speech-to-text.js`

### Agregar Funcionalidades
- **Más idiomas**: Extender soporte STT/TTS a otros idiomas
- **Análisis avanzado**: Agregar métricas adicionales de audio
- **Histórico**: Guardar predicciones y transcripciones anteriores
- **Visualización**: Agregar gráficos de forma de onda en tiempo real

## 🧪 Pruebas y Debugging

### Página de Pruebas de Grabación
Abre `test/test-recorder.html` para:
- Probar la funcionalidad de grabación independiente
- Verificar la calidad del audio
- Comprobar la metadata de los archivos WAV
- Validar la configuración de audio

### Pruebas de API
Usa `test/test-api.html` para:
- Verificar la conectividad con la API
- Probar endpoints individualmente
- Validar formatos de respuesta
- Probar funcionalidades STT y TTS por separado

### Debugging de Componentes
Para debugging individual de módulos:

```javascript
// En consola del navegador

// Probar reconocimiento de voz
window.speechManager.startListening();

// Probar TTS
window.speechManager.speak('Hola mundo', 'male');

// Verificar voces disponibles
speechSynthesis.getVoices().forEach(voice => 
    console.log(voice.name, voice.lang)
);

// Probar cambio de avatares
setAvatarGifs('nueva_imagen_male.gif', 'nueva_imagen_female.gif');
```

## 📱 Compatibilidad y Requisitos

### Navegadores Soportados
- ✅ **Chrome 66+** - Soporte completo STT/TTS
- ✅ **Firefox 60+** - Soporte STT limitado, TTS completo
- ✅ **Safari 12+** - Soporte STT/TTS con voces del sistema
- ✅ **Edge 79+** - Soporte completo con voces Microsoft
- ❌ **IE** - No soportado

### APIs Requeridas
- **Web Audio API** - Grabación y procesamiento de audio
- **MediaDevices API** - Acceso al micrófono
- **Web Speech API** - Reconocimiento de voz (STT)
- **SpeechSynthesis API** - Síntesis de voz (TTS)
- **Fetch API** - Comunicación con el backend
- **File API** - Manejo de archivos de audio
- **Canvas API** - Análisis de archivos WAV

### Características de Accesibilidad
- **Responsive Design** - Adaptable a dispositivos móviles
- **Keyboard Navigation** - Navegación con teclado
- **Screen Reader Support** - Etiquetas aria apropiadas
- **High Contrast** - Visible en modo de alto contraste

## 🔒 Seguridad y Privacidad

### Protección de Datos
- **Procesamiento Local**: El audio se procesa localmente hasta el envío
- **No Persistencia**: Los archivos no se almacenan permanentemente
- **Transcripciones Temporales**: El texto reconocido se mantiene solo en sesión
- **HTTPS Requerido**: Para producción, usar conexiones seguras

### Recomendaciones de Implementación
- **Límites de Archivo**: Implementar límites de tamaño (max 10MB)
- **Validación**: Verificar tipos de archivo en servidor y cliente
- **Rate Limiting**: Implementar límites de requests por IP
- **CORS Configurado**: Configurar adecuadamente los orígenes permitidos
- **Sanitización**: Limpiar transcripciones antes de TTS

## 🐛 Solución de Problemas Comunes

### Problemas de Reconocimiento de Voz
**Problema**: No funciona el reconocimiento de voz
**Solución**:
```javascript
// Verificar soporte del navegador
if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.error('Tu navegador no soporta reconocimiento de voz');
}

// Verificar permisos de micrófono
navigator.permissions.query({name: 'microphone'}).then(result => {
    console.log('Permiso de micrófono:', result.state);
});
```

### Problemas de TTS
**Problema**: No se reproduce la voz o no encuentra voces en español
**Solución**:
```javascript
// Listar voces disponibles
speechSynthesis.getVoices().forEach(voice => {
    console.log(`${voice.name} (${voice.lang}) - ${voice.gender || 'N/A'}`);
});

// Forzar carga de voces (especialmente en Chrome)
speechSynthesis.addEventListener('voiceschanged', () => {
    console.log('Voces cargadas:', speechSynthesis.getVoices().length);
});
```

### Problemas de GIFs
**Problema**: Los GIFs no se muestran o no se escalan correctamente
**Solución**:
- Verificar que los archivos estén en `/assets/`
- Comprobar las rutas relativas en `speech-to-text.js`
- Verificar que los GIFs no excedan 5MB
- Usar formato GIF válido (no WEBP o APNG)

### Problemas de Grabación
**Problema**: No se puede acceder al micrófono
**Solución**:
- Verificar que la página se sirva desde HTTPS (requerido para micrófono)
- Comprobar permisos del navegador
- Verificar que no haya otros procesos usando el micrófono

### Problemas Comunes

**Error: "No se puede acceder al micrófono"**
- Verifica que el navegador tenga permisos de micrófono
- Asegúrate de estar usando HTTPS (requerido para getUserMedia)
- Comprueba que el micrófono esté conectado y funcionando

**Error: "API no disponible"**
- Verifica que el servidor backend esté ejecutándose
- Comprueba la URL de la API en `js/client.js`
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

## 🚀 Características Próximas

### Roadmap de Desarrollo
- **🌍 Multiidioma**: Soporte para más idiomas en STT/TTS
- **🎨 Temas Personalizables**: Sistema de temas para la interfaz
- **📊 Análisis Avanzado**: Métricas adicionales de calidad de voz
- **🔄 Batch Processing**: Procesamiento de múltiples archivos
- **📱 PWA**: Convertir en Progressive Web App
- **🎪 Más Avatares**: Galería de avatares animados
- **📈 Estadísticas**: Dashboard con métricas de uso

## 🤝 Contribuir

### Cómo Contribuir
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

### Áreas de Mejora
- **Optimización de Performance**: Mejorar tiempos de carga y respuesta
- **Accesibilidad**: Mejorar soporte para lectores de pantalla
- **Testing**: Agregar tests unitarios y de integración
- **Documentación**: Mejorar comentarios en el código
- **Internacionalización**: Traducir interfaz a más idiomas

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **SimpleRecorderJs**: Por la librería de grabación de audio
- **Web Speech API**: Por las capacidades de STT/TTS del navegador
- **Comunidad Open Source**: Por las herramientas y recursos utilizados
- **Universidad Tecnológica de Panamá**: Por el contexto académico del proyecto

## 📞 Soporte

### Contacto y Ayuda
- **Issues**: Reporta bugs o solicita features en GitHub Issues
- **Documentación**: Consulta este README para información detallada
- **Community**: Únete a las discusiones en GitHub Discussions

### Estado del Proyecto
- **Versión**: 1.0.0 (con STT/TTS integrado)
- **Estado**: Estable y en desarrollo activo
- **Última Actualización**: Julio 2025

---

**🎤 ¡Gracias por usar el Predictor de Género por Voz!** 

*Una aplicación que combina inteligencia artificial, reconocimiento de voz y síntesis de habla para crear una experiencia completa e interactiva.*
