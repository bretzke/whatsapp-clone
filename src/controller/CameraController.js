export class CameraController {
    constructor(videoEl) {
        this._videoEl = videoEl;
        //getUserMedia verifica a permissão de midia do usuário nesse caso o vídeo
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(stream => {
            this._stream = stream;
            this._videoEl.srcObject = stream; // cria arquivos no formato binário
            this._videoEl.play();
        }).catch(err => {
            console.error(err);
        })
    }

    stop() {
        this._stream.getTracks().forEach(track => {
            track.stop();
        })
    }

    takePicture(mimeType = 'image/png') {
        //cria um elemento canvas
        let canvas = document.createElement('canvas');

        //seta os atributos do elemento
        canvas.setAttribute('height', this._videoEl.videoHeight);
        canvas.setAttribute('width', this._videoEl.videoWidth);


        let context = canvas.getContext('2d');
        context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL(mimeType); //converte para base 64
    }
}