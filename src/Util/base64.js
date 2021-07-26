export class Base64 {
    static getMimeType(urlBase64) {
        let regex = /^data:(.+);base64,(.*)$/; //procura o que estiver entre data: e ;base64 para extrair o mimetype do arquivo
        let result = urlBase64.match(regex);
        return result[1]; // mimeType
    }

    // Gera o arquivo
    static toFile(urlBase64) {
        let mimeType = Base64.getMimeType(urlBase64);
        let ext = mimeType.split('/')[1]; //extensão
        let filename = `file${Date.now}.${ext}`;

        return fetch(urlBase64)
            .then(res => { return res.arrayBuffer(); }) //converte para bytes
            .then(buffer => { return new File([buffer], filename, { type: mimeType }); })
    }
}