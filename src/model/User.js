import { Firebase } from "./../Util/Firebase";
import { Model } from "./Model";

export class User extends Model {
    constructor(id) {
        //Model super
        super();
        
        if(id) this.getById(id);
    }

    get name() { return this._data.name; }
    set name(value) { this._data.name = value; }

    get email() { return this._data.email; }
    set email(value) { this._data.email = value; }

    get photo() { return this._data.photo; }
    set photo(value) { this._data.photo = value}

    get chatId() { return this._data.chatId; }
    set chatId(value) { this._data.chatId = value}

    getById(id) {
        return new Promise((s, f) => {
            User.findByEmail(id).onSnapshot(doc => {
                // retorna o documento do firebase
                this.fromJSON(doc.data());

                s(doc);
            })
        });
    }

    save() {
        return User.findByEmail(this.email).set(this.toJSON());
    }

    static getRef() {
        return Firebase.db().collection('/users');
    }

    static getContactsRef(id) {
        return User.getRef()
                .doc(id) // acha o documento pelo e-mail do usuário
                .collection('contacts') // entra na coleção contacts
    }

    static findByEmail(email) {
        // conecta com o firebase e acha o documento específico dentro da coleção user com o email que está sendo passado
        return User.getRef().doc(email);
    }

    addContact(contact) {
        return User.getContactsRef(this.email)
            .doc(btoa(contact.email)) // procura o base 64 do e-mail do contato
            .set(contact.toJSON()); // salva as informações do contato
    }

    getContacts(filter = '') {
        return new Promise((s, f) => {
            User.getContactsRef(this.email)
                .where('name', '>=', filter)
                .onSnapshot(docs => {
                    // docs: retorna a coleção de contatos
                    let contacts = [];

                    docs.forEach(doc => {
                        let data = doc.data();
                        data.id = doc.id;
                        contacts.push(data);
                    });

                    // dispara o gatilho que houve mudanças nos contatos
                    this.trigger('contactschange', docs);
                    
                    s(contacts);
                })
        });
    }
}