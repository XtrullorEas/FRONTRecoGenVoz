class GenderAPI {
    constructor(apiUrl) {
        // Configuración de URLs - Comentar/Descomentar según necesites
        // API Local (desarrollo)
        this.apiUrl = apiUrl || 'http://127.0.0.1:5000';
        
        // API Render (producción)
        //this.apiUrl = apiUrl || 'https://apirecogenvoz.onrender.com';
        
        console.log('🌐 RecoGenVozAPI inicializada con URL:', this.apiUrl);
    }

    async checkHealth() {
        try {
            // Agregar timeout de 10 segundos
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch(`${this.apiUrl}/`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('🔌 Timeout: La API no responde');
            }
            throw new Error(`🔌 API no disponible: ${error.message}`);
        }
    }

    async predictFromFile(file) {
        if (!file) {
            throw new Error('No se proporcionó un archivo');
        }
        
        // Validar que sea un archivo WAV
        if (!file.name.toLowerCase().endsWith('.wav') && !file.type.includes('wav')) {
            throw new Error('El archivo debe ser de formato WAV');
        }
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('📤 Enviando archivo al API:', {
                name: file.name,
                size: file.size,
                type: file.type
            });
            
            const response = await fetch(`${this.apiUrl}/predict`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `Error HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('📊 Respuesta del API:', result);
            
            return result;
            
        } catch (error) {
            console.error('❌ Error en predictFromFile:', error);
            throw new Error(`Error en predicción: ${error.message}`);
        }
    }}