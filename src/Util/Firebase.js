import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

export class Firebase {
    constructor() {
 
        //////////////////////////////////////////////
        //                                          //
        // Parâmetros de configurações recebidos    //
        // ao criar um projeto no firebase          //
        // Tipo de BD: Firestore                    //
        //                                          //
        //////////////////////////////////////////////

        this._config = {
            apiKey: "",
            authDomain: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: ""
        };
        
        this.init();
    }
 
    init(){
        // firebase pode iniciar apenas uma vez
        if (!window._initializedFirebase) {
            firebase.initializeApp(this._config);
            firebase.firestore().settings({
                timestampsInSnapshots: true
            });
            window._initializedFirebase = true;
        }
    }
 
    static db() {
        return firebase.firestore();
    }
 
    static hd() {
        return firebase.storage();
    }

    initAuth() {
        return new Promise((s, f) => {
            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth()
            .signInWithPopup(provider)
            .then(result => {
                let token = result.credential.accessToken;
                let user = result.user;

                s({
                    token,
                    user,
                });
            })
            .catch(err => {
                f(err);
            })
        });
    }
}