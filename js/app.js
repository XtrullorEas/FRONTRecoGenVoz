// Inicializar la aplicación
const api = new GenderAPI();

// Inicializar grabador con configuración centralizada
const recorder = new SimpleRecorder();

// Inicializar manager de speech-to-text
let speechManager = null;

// Hacer recorder disponible globalmente
window.recorder = recorder;

// Variables globales para manejar el estado de grabación
let isRecording = false;
let currentRecordedFile = null;

// Elementos del DOM
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const statusDetails = document.getElementById('statusDetails');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const audioPlayer = document.getElementById('audioPlayer');
const audioElement = document.getElementById('audioElement');
const playBtn = document.getElementById('playBtn');
const downloadBtn = document.getElementById('downloadBtn');
const predictBtn = document.getElementById('predictBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const messages = document.getElementById('messages');

// Variables para almacenar archivos
let currentFile = null;
// Hacer currentFile global para que simple-recorder pueda acceder
window.currentFile = null;

// Verificar conexión al cargar
document.addEventListener('DOMContentLoaded', function() {
    checkAPIConnection();
    setupEventListeners();
    
    // Inicializar speech manager
    speechManager = new SpeechToTextManager();
    
    // Hacer speechManager disponible globalmente
    window.speechManager = speechManager;
    
    // Mostrar configuración de audio usando la configuración centralizada
    //console.log('🎤 Aplicación iniciada con configuración de audio:');
    //AudioConfig.logConfig();
});

async function checkAPIConnection() {
    statusText.textContent = 'Verificando conexión...';
    statusDetails.textContent = 'Conectando con la API...';
    
    try {
        const status = await api.checkHealth();
        const isLocalAPI = api.apiUrl.includes('127.0.0.1') || api.apiUrl.includes('localhost');
        const apiType = isLocalAPI ? 'Local' : 'Render';
        
        console.log('Conexión exitosa:', status);
        statusDot.classList.add('connected');
        statusText.textContent = `Conexión exitosa (${apiType})`;
        statusDetails.textContent = `API ${apiType} funcionando correctamente - ${api.apiUrl} - ${JSON.stringify(status)}`;
        showMessage(`✅ Conectado a la API ${apiType} exitosamente`, 'success');
        
        // Actualizar información de API en el encabezado
        const apiInfo = document.getElementById('apiInfo');
        apiInfo.textContent = `API ${apiType}: ${api.apiUrl}`;
    } catch (error) {
        console.error('Error de conexión:', error);
        statusDot.classList.remove('connected');
        statusText.textContent = 'Sin conexión';
        statusDetails.textContent = `Error: ${error.message}`;
        showMessage(`❌ Error de conexión: ${error.message}`, 'error');
        
        // Actualizar información de API en el encabezado
        const apiInfo = document.getElementById('apiInfo');
        apiInfo.textContent = `API no disponible: ${api.apiUrl}`;
    }
}

function setupEventListeners() {
    // Configurar upload de archivos
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
    
    // Configurar reproductores de audio para archivos subidos
    playBtn.addEventListener('click', () => playAudio(audioElement));
    downloadBtn.addEventListener('click', () => downloadFile(currentFile));
    predictBtn.addEventListener('click', () => predictFile(currentFile));
    
    // Configurar eventos de grabación usando SimpleRecorder.js
    setupRecordingEvents();
}

function setupRecordingEvents() {
    const startRecordBtn = document.getElementById('startRecordBtn');
    const stopRecordBtn = document.getElementById('stopRecordBtn');
    const playRecordedBtn = document.getElementById('playRecordedBtn');
    const downloadRecordedBtn = document.getElementById('downloadRecordedBtn');
    const predictRecordedBtn = document.getElementById('predictRecordedBtn');
    
    // Eventos de grabación
    startRecordBtn.addEventListener('click', async () => {
        if (!isRecording) {
            await startRecording();
        }
    });
    
    stopRecordBtn.addEventListener('click', async () => {
        if (isRecording) {
            await stopRecording();
        }
    });
    
    playRecordedBtn.addEventListener('click', () => {
        const recordedAudioElement = document.getElementById('recordedAudioElement');
        const recordedAudioPlayer = document.getElementById('recordedAudioPlayer');
        
        // Mostrar el reproductor solo cuando se hace clic en reproducir
        if (recordedAudioPlayer) {
            recordedAudioPlayer.style.display = 'block';
        }
        
        playAudio(recordedAudioElement);
    });
    
    downloadRecordedBtn.addEventListener('click', () => {
        if (currentRecordedFile) {
            downloadFile(currentRecordedFile);
        }
    });
    
    predictRecordedBtn.addEventListener('click', () => {
        if (currentRecordedFile) {
            predictFile(currentRecordedFile);
        }
    });
}

async function startRecording() {
    try {
        console.log('🎤 Iniciando grabación con SimpleRecorder.js...');
        
        // Mostrar estado de grabación
        updateRecordingUI(true);
        
        // Iniciar reconocimiento de voz
        if (speechManager) {
            speechManager.startRecognition();
        }
        
        // Usar SimpleRecorder.js para iniciar la grabación
        const started = await recorder.startRecording();
        
        if (started) {
            isRecording = true;
            console.log('✅ Grabación iniciada exitosamente');
            showMessage('🎤 Grabación y reconocimiento iniciados - Habla claramente hacia el micrófono', 'success');
        } else {
            updateRecordingUI(false);
            if (speechManager) {
                speechManager.stopRecognition();
            }
            showMessage('❌ Error al iniciar la grabación', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error al iniciar grabación:', error);
        updateRecordingUI(false);
        if (speechManager) {
            speechManager.stopRecognition();
        }
        showMessage(`❌ Error al iniciar grabación: ${error.message}`, 'error');
    }
}

async function stopRecording() {
    try {
        console.log('⏹️ Deteniendo grabación...');
        
        // Detener reconocimiento de voz
        if (speechManager) {
            speechManager.stopRecognition();
        }
        
        // Detener grabación usando SimpleRecorder.js
        const audioBlob = await recorder.stopRecording();
        
        if (audioBlob) {
            // Crear archivo a partir del blob
            const timestamp = new Date().toISOString().slice(0,16).replace(/:/g, '-');
            currentRecordedFile = new File([audioBlob], `grabacion_${timestamp}.wav`, {
                type: 'audio/wav',
                lastModified: Date.now()
            });
            
            // Configurar reproductor de audio grabado
            const recordedAudioElement = document.getElementById('recordedAudioElement');
            const recordedAudioPlayer = document.getElementById('recordedAudioPlayer');
            
            setupAudioPlayer(currentRecordedFile, recordedAudioElement, recordedAudioPlayer);
            
            // Mostrar información del archivo
            showRecordedFileInfo(currentRecordedFile);
            
            // Actualizar UI
            updateRecordingUI(false);
            enableRecordedAudioButtons(true);
            
            isRecording = false;
            
            console.log('✅ Grabación completada exitosamente');
            const transcript = speechManager ? speechManager.getTranscript() : '';
            const transcriptInfo = transcript ? ` - Texto reconocido: "${transcript.substring(0, 50)}${transcript.length > 50 ? '...' : ''}"` : '';
            showMessage(`✅ Grabación completada - Archivo WAV generado con metadata${transcriptInfo}`, 'success');
            
        } else {
            throw new Error('No se pudo generar el archivo de audio');
        }
        
    } catch (error) {
        console.error('❌ Error al detener grabación:', error);
        updateRecordingUI(false);
        if (speechManager) {
            speechManager.stopRecognition();
        }
        isRecording = false;
        showMessage(`❌ Error al detener grabación: ${error.message}`, 'error');
    }
}

function updateRecordingUI(recording) {
    const startRecordBtn = document.getElementById('startRecordBtn');
    const stopRecordBtn = document.getElementById('stopRecordBtn');
    const recordingStatus = document.getElementById('recordingStatus');
    
    if (recording) {
        startRecordBtn.disabled = true;
        startRecordBtn.classList.add('recording');
        stopRecordBtn.disabled = false;
        recordingStatus.style.display = 'block';
        
        // Limpiar transcripción anterior al iniciar nueva grabación
        if (speechManager) {
            speechManager.clearTranscript();
        }
        
        // Deshabilitar botones de audio grabado
        enableRecordedAudioButtons(false);
    } else {
        startRecordBtn.disabled = false;
        startRecordBtn.classList.remove('recording');
        stopRecordBtn.disabled = true;
        recordingStatus.style.display = 'none';
    }
}

function enableRecordedAudioButtons(enable) {
    const playRecordedBtn = document.getElementById('playRecordedBtn');
    const downloadRecordedBtn = document.getElementById('downloadRecordedBtn');
    const predictRecordedBtn = document.getElementById('predictRecordedBtn');
    
    playRecordedBtn.disabled = !enable;
    downloadRecordedBtn.disabled = !enable;
    predictRecordedBtn.disabled = !enable;
}

function showRecordedFileInfo(file) {
    const audioInfo = recorder.getAudioInfo();
    
    if (audioInfo) {
        console.log('📊 Información del archivo grabado:');
        console.log(`- Nombre: ${file.name}`);
        console.log(`- Tamaño: ${audioInfo.size.kb} KB (${audioInfo.size.mb} MB)`);
        console.log(`- Duración: ${audioInfo.duration.toFixed(2)} segundos`);
        console.log(`- Formato: ${audioInfo.format}`);
        console.log(`- Sample Rate: ${audioInfo.config.sampleRate} Hz`);
        console.log(`- Canales: ${audioInfo.config.channelCount}`);
        console.log(`- Bit Depth: ${audioInfo.config.bitDepth} bits`);
        console.log(`- Bit Rate: ${(audioInfo.config.bitRate / 1000).toFixed(1)} kbps`);
        
        // Mostrar información en la consola del navegador
        showMessage(`📊 Archivo grabado: ${audioInfo.size.kb} KB, ${audioInfo.duration.toFixed(2)}s, ${audioInfo.format}`, 'success');
    }
}

async function handleFile(file) {
    // Validar que sea un archivo WAV
    if (!file.name.toLowerCase().endsWith('.wav') && !file.type.includes('wav')) {
        showMessage('❌ Error: Solo se admiten archivos WAV', 'error');
        return;
    }
    
    // Guardar archivo y mostrar información
    currentFile = file;
    window.currentFile = file;
    showFileInfo(file);
    setupAudioPlayer(file, audioElement, audioPlayer);
    hideResults();
}

// Función para recibir audio desde simple-recorder (compatibilidad)
function handleRecordedAudio() {
    return currentRecordedFile;
}

// Hacer funciones globales para compatibilidad
window.handleRecordedAudio = handleRecordedAudio;
window.currentRecordedFile = currentRecordedFile;

function setupAudioPlayer(file, audioElement, playerContainer) {
    // Crear URL para el archivo de audio
    const audioUrl = URL.createObjectURL(file);
    audioElement.src = audioUrl;
    
    // No mostrar automáticamente el reproductor para audio grabado
    // Solo configurar el elemento sin mostrarlo
    if (playerContainer.id === 'recordedAudioPlayer') {
        playerContainer.style.display = 'none'; // Mantener oculto
    } else {
        // Para otros reproductores (archivos subidos), mostrar normalmente
        playerContainer.style.display = 'block';
    }
}

function playAudio(audioElement) {
    if (audioElement.paused) {
        audioElement.play();
        
        // Si es el audio grabado, agregar evento para ocultar cuando termine
        if (audioElement.id === 'recordedAudioElement') {
            const recordedAudioPlayer = document.getElementById('recordedAudioPlayer');
            
            // Evento para ocultar cuando termine la reproducción
            const handleEnded = () => {
                if (recordedAudioPlayer) {
                    recordedAudioPlayer.style.display = 'none';
                }
                audioElement.removeEventListener('ended', handleEnded);
            };
            
            audioElement.addEventListener('ended', handleEnded);
        }
    } else {
        audioElement.pause();
        
        // Si es el audio grabado y se pausa, ocultarlo también
        if (audioElement.id === 'recordedAudioElement') {
            const recordedAudioPlayer = document.getElementById('recordedAudioPlayer');
            if (recordedAudioPlayer) {
                recordedAudioPlayer.style.display = 'none';
            }
        }
    }
}

async function predictFile(file) {
    if (!file) {
        showMessage('❌ Error: No hay archivo para predecir', 'error');
        return;
    }
    
    showLoading(true);
    hideResults();
    
    try {
        const result = await api.predictFromFile(file);
        showResults(result);
        showMessage('🎯 Predicción completada exitosamente', 'success');
    } catch (error) {
        showMessage(`❌ Error en la predicción: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

// Hacer función de predicción global
window.predictFile = predictFile;

// Función global para configurar GIFs personalizados
window.setAvatarGifs = function(maleGifUrl, femaleGifUrl) {
    if (window.speechManager) {
        window.speechManager.setCustomGifs(maleGifUrl, femaleGifUrl);
        console.log('✅ GIFs de avatar configurados correctamente');
    } else {
        console.warn('⚠️ speechManager no está disponible todavía');
    }
};

function showFileInfo(file) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    fileInfo.innerHTML = `
        <strong>Archivo seleccionado:</strong><br>
        📄 Nombre: ${file.name}<br>
        📏 Tamaño: ${sizeInMB} MB<br>
        🔧 Tipo: ${file.type || 'Desconocido'}
    `;
    fileInfo.style.display = 'block';
}

function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

function hideResults() {
    results.style.display = 'none';
}

function showResults(result) {
    const genderText = result.gender === 'male' ? '👨 Hombre' : '👩 Mujer';
    const malePercent = (result.male_probability * 100).toFixed(1);
    const femalePercent = (result.female_probability * 100).toFixed(1);
    
    document.getElementById('predictedGender').textContent = genderText;
    document.getElementById('confidence').textContent = result.confidence;
    document.getElementById('maleProbability').textContent = `${malePercent}%`;
    document.getElementById('femaleProbability').textContent = `${femalePercent}%`;
    
    // Animar las barras de probabilidad
    setTimeout(() => {
        document.getElementById('maleBar').style.width = `${malePercent}%`;
        document.getElementById('femaleBar').style.width = `${femalePercent}%`;
    }, 100);
    
    results.style.display = 'block';
    
    // Reproducir TTS automáticamente según el género predicho
    if (speechManager && speechManager.getTranscript()) {
        setTimeout(() => {
            const success = speechManager.playTTSByGender(result.gender);
            if (success) {
                showMessage(`🔊 Reproduciendo texto con voz ${result.gender === 'male' ? 'masculina' : 'femenina'}`, 'success');
            }
        }, 1000); // Esperar 1 segundo después de mostrar los resultados
    }
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    messages.innerHTML = '';
    messages.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Función de compatibilidad con el archivo original
function displayResult(result) {
    showResults(result);
    console.log('📊 Resultado mostrado en la interfaz correctamente');
}

function downloadFile(file) {
    if (!file) {
        showMessage('❌ Error: No hay archivo para descargar', 'error');
        return;
    }
    
    // Crear URL para el archivo
    const url = URL.createObjectURL(file);
    
    // Crear elemento de descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Limpiar URL
    URL.revokeObjectURL(url);
    
    showMessage(`💾 Archivo ${file.name} descargado`, 'success');
}

function checkAudioIntegrity(file) {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        const url = URL.createObjectURL(file);
        
        audio.src = url;
        
        audio.addEventListener('loadedmetadata', () => {
            console.log('Verificación de integridad del audio:');
            console.log('- Duración:', audio.duration);
            console.log('- ¿Tiene duración válida?:', audio.duration > 0);
            
            URL.revokeObjectURL(url);
            
            if (audio.duration > 0) {
                resolve({
                    valid: true,
                    duration: audio.duration,
                    message: `Audio válido con duración de ${audio.duration.toFixed(2)} segundos`
                });
            } else {
                resolve({
                    valid: false,
                    duration: 0,
                    message: 'Audio sin duración válida'
                });
            }
        });
        
        audio.addEventListener('error', (e) => {
            console.error('Error al verificar audio:', e);
            URL.revokeObjectURL(url);
            resolve({
                valid: false,
                duration: 0,
                message: 'Error al cargar el audio'
            });
        });
        
        // Timeout para evitar bloqueo
        setTimeout(() => {
            URL.revokeObjectURL(url);
            resolve({
                valid: false,
                duration: 0,
                message: 'Timeout en verificación de audio'
            });
        }, 5000);
    });
}


