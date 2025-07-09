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
        
        this.initElements();
        this.initSpeechRecognition();
        this.loadVoices();
        this.bindEvents();
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
        if (this.speechTranscript) {
            if (text.trim()) {
                this.speechTranscript.textContent = text;
                this.speechTranscript.className = 'speech-transcript';
            } else {
                this.speechTranscript.textContent = 'El texto reconocido aparecerá aquí mientras hablas...';
                this.speechTranscript.className = 'speech-transcript empty';
            }
            this.speechTranscript.style.display = 'block';
        }
    }

    showSpeechElements() {
        if (this.speechStatus) this.speechStatus.style.display = 'flex';
        if (this.speechTranscript) this.speechTranscript.style.display = 'block';
        if (this.textToSpeechControls) this.textToSpeechControls.style.display = 'block';
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
}