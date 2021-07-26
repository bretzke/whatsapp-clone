import { ClassEvent } from "../Util/ClassEvent";

export class MicrophoneController extends ClassEvent {
    constructor() {
        super(); //chama o construtor da pai dele (ClassEvent)

        this._mimeType = 'audio/webm';
        this._available = false;

        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {
            this._available = true;
            this._stream = stream;
            
            this.trigger('ready', this._stream)
        }).catch(err => {
            console.error(err);
        })
    }

    stop() {
        this._stream.getTracks().forEach(track => {
            track.stop();
        })
    }

    isAvailable() {
        return this._available;
    }

    startRecorder() {
        if(this.isAvailable()) {

            this._mediaRecorder = new MediaRecorder(this._stream, {
                mimeType: this._mimeType
            }); // classe do Javascript

            this._recorderChunks = []; //pedaços gravados
            this._mediaRecorder.addEventListener('dataavailable', e => {
                if(e.data.size > 0) this._recorderChunks.push(e.data);
            });

            this._mediaRecorder.addEventListener('stop', e => {
                let blob = new Blob(this._recorderChunks, {
                    type: this._mimeType,
                });

                let filename = `rec${Date.now()}.webm`;
                let audioContext = new AudioContext();
                let reader = new FileReader();
                reader.onload = e => {
                    audioContext.decodeAudioData(reader.result).then(decode => {
                        let file = new File([blob], filename, {
                            type: this._mimeType,
                            lastModified: Date.now()
                        }); // cria um arquivo

                        // dispara o gatilho
                        this.trigger('recorded', file, decode);
                    });
                };

                reader.readAsArrayBuffer(blob);
            })

            this._mediaRecorder.start();
            this.startTimer();
        }
    }

    stopRecorder() {
        if(this.isAvailable()) {
            this._mediaRecorder.stop();
            this.stop(); //para o microfone
            this.stopTimer();
        }
    }

    startTimer() {
        let start = Date.now();
        this._recordMicrophoneInterval = setInterval(() => {
            //dispara o gatilho para lá no WhatsappController receber o tempo e renderizar na tela
            this.trigger('recordtimer', (Date.now() - start));
        }, 100);
    }

    stopTimer() {
        clearInterval(this._recordMicrophoneInterval);
    }
}