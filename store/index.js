import firebase from '~/plugins/firebase'
import 'firebase/storage'

const db = firebase.firestore()
const wordRef = db.collection('words')
const firestorage = firebase.storage()

export const state = () => ({
    words: []
})

export const actions = {
    fetchUsers({ commit }) {
        commit('initUsers')

        wordRef.orderBy('created_at', 'desc').get()
            .then(res => {
                res.forEach(doc => {
                    commit('createWord', doc.data())
                })
            })
    },
    createWord({ commit }, payload) {
        const uid = firebase.auth().currentUser.uid
        const word = {
            id: wordRef.doc().id,
            uid: uid,
            sentence: payload.word.sentence,
            author: payload.word.author,
            publisher: payload.word.publisher,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        }
        wordRef.doc(word.id).set(word)
        $nuxt.$router.push('/')
    },
    login({ dispatch }, payload) {
        const email = payload.email
        const password = payload.password
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                alert('ログインしました')
                $nuxt.$router.push('/')
            })
            .catch((error) => {
                alert(error.message)
            });
    },
    loginGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider)
            .then(() => {
                alert('ログインしました')
                $nuxt.$router.push('/')
            })
    },
    async register({ dispatch }, payload) {
        const email = payload.email
        const password = payload.password

        await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(user => {
                firebase.firestore().collection('users').doc(user.user.uid).set({
                    displayName: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                })
                firebase.auth().currentUser.sendEmailVerification()
            })
            .catch((error) => {
                alert(error.message)
            });
        alert('登録しました')
        $nuxt.$router.push('/')
    },
    async registerGoogle() {
        let provider = new firebase.auth.GoogleAuthProvider()
        await firebase.auth().signInWithPopup(provider)
            .then(user => {
                firebase.firestore().collection('users').doc(user.user.uid).set({
                    displayName: user.user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                })
                firebase.auth().currentUser.sendEmailVerification()
            }).catch(function(error) {
                console.log(error)
            })
        alert('ログインしました')
        $nuxt.$router.push('/')
    },
    logout() {
        firebase.auth().signOut()
            .then(() => {
                alert('ログアウトしました')
            }).catch(function(error) {
                console.log(error)
            });
    }
}

export const mutations = {
    initUsers(state) {
        state.words = []
    },
    createWord(state, word) {
        state.words.push(word)
    }
}

export const getters = {
    getWords(state) {
        return state.words
    },
    user: state => {
        return state.user
    }
}