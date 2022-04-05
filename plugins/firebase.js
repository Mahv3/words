import firebase from 'firebase'

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyCrHEEJkKrdJBegQMo7T94xcAI9PneCzb4",
        authDomain: "words-app-c009c.firebaseapp.com",
        projectId: "words-app-c009c",
        storageBucket: "words-app-c009c.appspot.com",
        messagingSenderId: "809697591167",
        appId: "1:809697591167:web:dc8cedf84ddc87a39b644a"
    })
}
export default firebase
