class SpeechToTextManager {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.isRecognitionActive = false;
        this.isSpeaking = false;
        this.isPaused = false;
        this.voices = [];
        this.currentTranscript = '';
        this.gifElement = null; // Cambiar de videoElement a gifElement
        this.gifContainer = null; // Cambiar de videoContainer a gifContainer
        this.customGifs = null; // Cambiar de customVideos a customGifs
        
        this.initElements();
        this.initSpeechRecognition();
        this.loadVoices();
        this.bindEvents();
        this.createGifElements(); // Cambiar de createVideoElements a createGifElements
    }

    initElements() {
        this.speechStatus = document.getElementById('speechStatus');
        this.speechTranscript = document.getElementById('speechTranscript');
        this.textToSpeechControls = document.getElementById('textToSpeechControls');
        this.speakBtn = document.getElementById('speakBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopSpeakBtn = document.getElementById('stopSpeakBtn');
        this.voiceSelect = document.getElementById('voiceSelect');
    }

    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'es-ES';
            
            this.recognition.onstart = () => {
                this.isRecognitionActive = true;
                this.updateSpeechStatus('listening', 'Escuchando... Habla ahora');
                console.log('Reconocimiento de voz iniciado');
            };
            
            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                if (finalTranscript) {
                    this.currentTranscript += finalTranscript + ' ';
                }
                
                this.updateTranscriptDisplay(this.currentTranscript + interimTranscript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Error en reconocimiento de voz:', event.error);
                this.updateSpeechStatus('error', `Error: ${event.error}`);
                
                if (event.error === 'not-allowed') {
                    alert('Por favor, permite el acceso al micrófono para usar el reconocimiento de voz.');
                }
            };
            
            this.recognition.onend = () => {
                this.isRecognitionActive = false;
                this.updateSpeechStatus('stopped', 'Reconocimiento detenido');
                console.log('Reconocimiento de voz terminado');
            };
        } else {
            console.warn('Speech Recognition no está soportado en este navegador');
            this.updateSpeechStatus('error', 'Speech Recognition no soportado');
        }
    }

    loadVoices() {
        const updateVoices = () => {
            this.voices = this.synthesis.getVoices();
            this.populateVoiceSelect();
        };

        updateVoices();
        
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = updateVoices;
        }
    }

    populateVoiceSelect() {
        this.voiceSelect.innerHTML = '<option value="">Seleccionar voz...</option>';
        
        this.voices.forEach((voice, index) => {
            if (voice.lang.startsWith('es')) {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${voice.name} (${voice.lang})`;
                this.voiceSelect.appendChild(option);
            }
        });
        
        // Agregar algunas voces en inglés como alternativa
        this.voices.forEach((voice, index) => {
            if (voice.lang.startsWith('en')) {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${voice.name} (${voice.lang})`;
                this.voiceSelect.appendChild(option);
            }
        });
    }

    bindEvents() {
        if (this.speakBtn) {
            this.speakBtn.addEventListener('click', () => this.speakText());
        }
        
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.pauseResumeText());
        }
        
        if (this.stopSpeakBtn) {
            this.stopSpeakBtn.addEventListener('click', () => this.stopSpeaking());
        }
    }

    startRecognition() {
        if (this.recognition && !this.isRecognitionActive) {
            this.currentTranscript = '';
            this.updateTranscriptDisplay('');
            this.showSpeechElements();
            
            try {
                this.recognition.start();
                this.updateSpeechStatus('starting', 'Iniciando reconocimiento...');
            } catch (error) {
                console.error('Error al iniciar reconocimiento:', error);
                this.updateSpeechStatus('error', 'Error al iniciar');
            }
        }
    }

    stopRecognition() {
        if (this.recognition && this.isRecognitionActive) {
            this.recognition.stop();
            this.updateSpeechStatus('stopping', 'Deteniendo...');
        }
    }

    updateSpeechStatus(status, message) {
        if (this.speechStatus) {
            this.speechStatus.className = `speech-status ${status}`;
            this.speechStatus.querySelector('span').textContent = `Estado: ${message}`;
            this.speechStatus.style.display = 'flex';
        }
    }

    updateTranscriptDisplay(text) {
        // Mantener el texto internamente pero no mostrarlo en la UI
        // Solo actualizar el contenido sin mostrar el elemento
        if (this.speechTranscript) {
            if (text.trim()) {
                this.speechTranscript.textContent = text;
                this.speechTranscript.className = 'speech-transcript';
            } else {
                this.speechTranscript.textContent = 'El texto reconocido aparecerá aquí mientras hablas...';
                this.speechTranscript.className = 'speech-transcript empty';
            }
            // Mantener oculto durante la grabación
            this.speechTranscript.style.display = 'none';
        }
    }

    showSpeechElements() {
        if (this.speechStatus) this.speechStatus.style.display = 'flex';
        // Ocultar la transcripción - solo mostrar el estado
        if (this.speechTranscript) this.speechTranscript.style.display = 'none';
        if (this.textToSpeechControls) this.textToSpeechControls.style.display = 'none';
    }

    hideSpeechElements() {
        if (this.speechStatus) this.speechStatus.style.display = 'none';
        if (this.speechTranscript) this.speechTranscript.style.display = 'none';
        if (this.textToSpeechControls) this.textToSpeechControls.style.display = 'none';
    }

    speakText() {
        const textToSpeak = this.currentTranscript.trim();
        
        if (!textToSpeak) {
            alert('No hay texto para reproducir. Primero graba algo con reconocimiento de voz.');
            return;
        }

        if (this.isSpeaking) {
            this.stopSpeaking();
        }

        this.currentUtterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // Configurar voz seleccionada
        if (this.voiceSelect.value) {
            this.currentUtterance.voice = this.voices[this.voiceSelect.value];
        }
        
        // Configurar propiedades
        this.currentUtterance.rate = 1;
        this.currentUtterance.pitch = 1;
        this.currentUtterance.volume = 1;

        // Eventos
        this.currentUtterance.onstart = () => {
            this.isSpeaking = true;
            this.isPaused = false;
            this.updateTTSControls(true);
            console.log('Iniciando text-to-speech');
        };

        this.currentUtterance.onend = () => {
            this.isSpeaking = false;
            this.isPaused = false;
            this.updateTTSControls(false);
            console.log('Text-to-speech terminado');
        };

        this.currentUtterance.onerror = (event) => {
            console.error('Error en text-to-speech:', event.error);
            this.isSpeaking = false;
            this.isPaused = false;
            this.updateTTSControls(false);
        };

        this.synthesis.speak(this.currentUtterance);
    }

    pauseResumeText() {
        if (this.isSpeaking && !this.isPaused) {
            this.synthesis.pause();
            this.isPaused = true;
            this.pauseBtn.textContent = '▶️ Reanudar';
        } else if (this.isSpeaking && this.isPaused) {
            this.synthesis.resume();
            this.isPaused = false;
            this.pauseBtn.textContent = '⏸️ Pausar';
        }
    }

    stopSpeaking() {
        if (this.isSpeaking) {
            this.synthesis.cancel();
            this.isSpeaking = false;
            this.isPaused = false;
            this.updateTTSControls(false);
            this.hideGif(); // Ocultar GIF al detener TTS
        }
    }

    updateTTSControls(isPlaying) {
        if (this.speakBtn) this.speakBtn.disabled = isPlaying;
        if (this.pauseBtn) {
            this.pauseBtn.disabled = !isPlaying;
            this.pauseBtn.textContent = '⏸️ Pausar';
        }
        if (this.stopSpeakBtn) this.stopSpeakBtn.disabled = !isPlaying;
    }

    clearTranscript() {
        this.currentTranscript = '';
        this.updateTranscriptDisplay('');
        this.stopSpeaking();
    }

    getTranscript() {
        return this.currentTranscript.trim();
    }

    isActive() {
        return this.isRecognitionActive;
    }

    // Función para reproducir TTS automáticamente según el género predicho
    playTTSByGender(gender) {
        const textToSpeak = this.currentTranscript.trim();
        
        if (!textToSpeak) {
            console.log('No hay texto para reproducir con TTS');
            return false;
        }

        // Detener cualquier reproducción en curso
        if (this.isSpeaking) {
            this.stopSpeaking();
        }

        // Seleccionar voz según el género
        this.selectVoiceByGender(gender);

        // Mostrar GIF según el género
        this.showGif(gender);

        // Crear y configurar utterance
        this.currentUtterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // Configurar voz seleccionada
        if (this.voiceSelect.value) {
            this.currentUtterance.voice = this.voices[this.voiceSelect.value];
        }
        
        // Configurar propiedades
        this.currentUtterance.rate = 1;
        this.currentUtterance.pitch = 1;
        this.currentUtterance.volume = 1;

        // Eventos
        this.currentUtterance.onstart = () => {
            this.isSpeaking = true;
            this.isPaused = false;
            console.log(`Reproduciendo TTS con voz ${gender === 'male' ? 'masculina' : 'femenina'}: "${textToSpeak}"`);
            console.log('GIF sincronizado con TTS iniciado');
        };

        this.currentUtterance.onend = () => {
            this.isSpeaking = false;
            this.isPaused = false;
            console.log('TTS automático terminado');
            
            // Ocultar GIF cuando termine el TTS
            setTimeout(() => {
                this.hideGif();
            }, 500); // Pequeño delay para transición suave
        };

        this.currentUtterance.onerror = (event) => {
            console.error('Error en TTS automático:', event.error);
            this.isSpeaking = false;
            this.isPaused = false;
            this.hideGif(); // Ocultar GIF en caso de error
        };

        // Reproducir
        this.synthesis.speak(this.currentUtterance);
        return true;
    }

    // Función para seleccionar voz según el género
    selectVoiceByGender(gender) {
        let selectedVoiceIndex = null;
        
        // Buscar voz específica según el género
        for (let i = 0; i < this.voices.length; i++) {
            const voice = this.voices[i];
            const voiceName = voice.name.toLowerCase();
            
            if (gender === 'male') {
                // Buscar Microsoft Raul específicamente para hombre
                if (voiceName.includes('raul') && voiceName.includes('spanish')) {
                    selectedVoiceIndex = i;
                    break;
                }
            } else if (gender === 'female') {
                // Buscar Microsoft Sabina específicamente para mujer
                if (voiceName.includes('sabina') && voiceName.includes('spanish')) {
                    selectedVoiceIndex = i;
                    break;
                }
            }
        }
        
        // Si no se encontraron las voces específicas, buscar alternativas
        if (selectedVoiceIndex === null) {
            for (let i = 0; i < this.voices.length; i++) {
                const voice = this.voices[i];
                const voiceName = voice.name.toLowerCase();
                
                if (voice.lang.startsWith('es')) {
                    if (gender === 'male') {
                        // Buscar otras voces masculinas como alternativa
                        if (voiceName.includes('male') || 
                            voiceName.includes('diego') ||
                            voiceName.includes('jorge') ||
                            voiceName.includes('carlos') ||
                            voiceName.includes('miguel') ||
                            voiceName.includes('raul')) {
                            selectedVoiceIndex = i;
                            break;
                        }
                    } else if (gender === 'female') {
                        // Buscar otras voces femeninas como alternativa
                        if (voiceName.includes('female') || 
                            voiceName.includes('maria') ||
                            voiceName.includes('carmen') ||
                            voiceName.includes('lucia') ||
                            voiceName.includes('sofia') ||
                            voiceName.includes('sabina')) {
                            selectedVoiceIndex = i;
                            break;
                        }
                    }
                }
            }
        }
        
        // Si aún no se encontró una voz específica del género, usar la primera voz en español
        if (selectedVoiceIndex === null) {
            for (let i = 0; i < this.voices.length; i++) {
                if (this.voices[i].lang.startsWith('es')) {
                    selectedVoiceIndex = i;
                    break;
                }
            }
        }
        
        // Si aún no hay voz en español, usar la primera disponible
        if (selectedVoiceIndex === null && this.voices.length > 0) {
            selectedVoiceIndex = 0;
        }
        
        // Actualizar el selector
        if (selectedVoiceIndex !== null) {
            this.voiceSelect.value = selectedVoiceIndex;
            console.log(`Voz seleccionada para ${gender === 'male' ? 'hombre' : 'mujer'}: ${this.voices[selectedVoiceIndex].name}`);
        } else {
            console.warn('No se pudo seleccionar una voz apropiada');
        }
    }

    createGifElements() {
        // Crear contenedor de GIF si no existe
        this.gifContainer = document.getElementById('gifContainer');
        if (!this.gifContainer) {
            this.gifContainer = document.createElement('div');
            this.gifContainer.id = 'gifContainer';
            this.gifContainer.className = 'gif-container';
            this.gifContainer.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
                background: rgba(0,0,0,0.8);
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                display: none;
                max-width: 95vw;
                max-height: 95vh;
                overflow: auto;
                text-align: center;
            `;
            document.body.appendChild(this.gifContainer);
        }

        // Crear elemento de imagen GIF si no existe
        this.gifElement = document.getElementById('avatarGif');
        if (!this.gifElement) {
            this.gifElement = document.createElement('img');
            this.gifElement.id = 'avatarGif';
            this.gifElement.style.cssText = `
                max-width: 90vw;
                max-height: 80vh;
                width: auto;
                height: auto;
                border-radius: 15px;
                object-fit: contain;
                display: block;
                margin: 0 auto;
            `;
            
            // Agregar título
            const title = document.createElement('h3');
            title.style.cssText = `
                color: white;
                text-align: center;
                margin-bottom: 15px;
                font-family: 'Segoe UI', sans-serif;
            `;
            title.textContent = 'Avatar TTS';
            
            // Agregar botón de cerrar
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 15px;
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
            `;
            closeBtn.onclick = () => this.hideGif();
            
            this.gifContainer.appendChild(title);
            this.gifContainer.appendChild(closeBtn);
            this.gifContainer.appendChild(this.gifElement);
        }

        // Event listeners para el GIF
        this.gifElement.onerror = (e) => {
            console.error('Error al cargar GIF:', e);
            this.hideGif();
        };
    }

    showGif(gender) {
        if (!this.gifElement || !this.gifContainer) return;

        // Obtener URL del GIF según el género
        const gifSrc = this.getGifUrl(gender);
        
        // Configurar dimensiones específicas según el género
        this.adjustGifDimensions(gender);
        
        // Configurar y mostrar GIF
        this.gifElement.src = gifSrc;
        this.gifContainer.style.display = 'block';
        
        // Actualizar título
        const title = this.gifContainer.querySelector('h3');
        if (title) {
            title.textContent = `Avatar ${gender === 'male' ? 'Masculino' : 'Femenino'}`;
        }

        console.log(`Mostrando GIF ${gender === 'male' ? 'masculino' : 'femenino'}: ${gifSrc}`);
    }

    adjustGifDimensions(gender) {
        if (!this.gifElement) return;

        // Dimensiones originales de los GIFs
        const dimensions = {
            male: { width: 567, height: 1024 },    // Hombre: 567 x 1024
            female: { width: 620, height: 1009 }   // Mujer: 620 x 1009
        };

        const gifDims = gender === 'male' ? dimensions.male : dimensions.female;
        
        // Calcular el tamaño óptimo para la pantalla
        const maxWidth = window.innerWidth * 0.8;   // 80% del ancho de pantalla
        const maxHeight = window.innerHeight * 0.8; // 80% del alto de pantalla
        
        // Calcular el factor de escala manteniendo la proporción
        const scaleX = maxWidth / gifDims.width;
        const scaleY = maxHeight / gifDims.height;
        const scale = Math.min(scaleX, scaleY, 1); // No agrandar más del tamaño original
        
        const finalWidth = gifDims.width * scale;
        const finalHeight = gifDims.height * scale;
        
        // Aplicar las dimensiones calculadas
        this.gifElement.style.cssText = `
            width: ${finalWidth}px;
            height: ${finalHeight}px;
            border-radius: 15px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
        `;

        console.log(`GIF ${gender} ajustado a: ${finalWidth.toFixed(0)}x${finalHeight.toFixed(0)}px (escala: ${scale.toFixed(2)})`);
    }

    hideGif() {
        if (this.gifContainer) {
            this.gifContainer.style.display = 'none';
        }
        if (this.gifElement) {
            this.gifElement.src = ''; // Limpiar la fuente para detener el GIF
        }
        console.log('GIF oculto');
    }

    // Función para configurar GIFs personalizados
    setCustomGifs(maleGifUrl, femaleGifUrl) {
        this.customGifs = {
            male: maleGifUrl,
            female: femaleGifUrl
        };
        console.log('GIFs personalizados configurados:', this.customGifs);
    }

    // Función para obtener la URL del GIF según el género
    getGifUrl(gender) {
        // Si hay GIFs personalizados configurados, usarlos
        if (this.customGifs) {
            return gender === 'male' ? this.customGifs.male : this.customGifs.female;
        }
        
        // URLs de los GIFs locales en la carpeta assets
        const defaultGifs = {
            male: 'assets/hombre-avatar.gif',
            female: 'assets/mujer-avatar.gif'
        };
        
        return gender === 'male' ? defaultGifs.male : defaultGifs.female;
    }
}