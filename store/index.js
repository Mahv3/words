import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '~/plugins/firebase'
import 'firebase/storage'

Vue.use(Vuex)

// TODO;wordとuserごとにfile作る
// FIXME;todo
const db = firebase.firestore()
const wordRef = db.collection('words')
const userRef = db.collection('users')
const auth = firebase.auth()
const timeStamp = firebase.firestore.FieldValue.serverTimestamp()

export const state = () => ({
    words: [],
    user: {}
})

export const actions = {
    async fetchWords({ commit }) {
        try {
            commit('initWords')
            const uid = auth.currentUser.uid
            const words = await userRef.doc(uid).collection('words').orderBy('created_at', 'desc').get()
            words.forEach(word => {
                commit('fetchWords', word.data())
            })
        } catch (error) {
            console.log(error)
        }
    },
    createWord({ commit }, payload) {
        const uid = firebase.auth().currentUser.uid
        const id = userRef.doc(uid).collection('words').doc().id
        const word = {
            id,
            uid,
            sentence: payload.word.sentence,
            author: payload.word.author,
            publisher: payload.word.publisher,
            created_at: timeStamp
        }
        userRef.doc(uid).collection('words').doc(id).set(word)
            .then(() => {
                alert('投稿しました。')
                $nuxt.$router.push('/')
            })
            .catch(error => {
                console.log(error)
            })
    },
    login({ commit }, payload) {
        const email = payload.email
        const password = payload.password
        auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
                commit('login', user)
                alert('ログインしました')
                $nuxt.$router.push('/')
            })
            .catch((error) => {
                alert(error.message)
            });
    },
    loginGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(provider)
            .then(() => {
                alert('ログインしました')
                $nuxt.$router.push('/')
            })
            .catch(error => {
                console.log(error)
            })
    },
    async register({ dispatch }, payload) {
        const userEmail = payload.email
        const userPassword = payload.password

        const user = await auth.createUserWithEmailAndPassword(userEmail, userPassword)
        const uid = user.user.uid
        db.collection('users').doc(uid).set({
                uid: uid,
                displayName: userEmail,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                firebase.auth().currentUser.sendEmailVerification()
                alert('登録しました')
                $nuxt.$router.push('/')
            })
            .catch((error) => {
                console.log(error)
            });
    },
    registerGoogle() {
        let provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(provider)
            .then(user => {
                db.collection('users').doc(user.user.uid).set({
                    displayName: user.user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                })
                auth.currentUser.sendEmailVerification()
                alert('ログインしました')
                $nuxt.$router.push('/')
            }).catch(function(error) {
                console.log(error)
            })
    },
    logout() {
        auth.signOut()
            .then(() => {
                alert('ログアウトしました')
            }).catch(function(error) {
                console.log(error)
            });
    },
    getWordDetail({ commit }, payload) {
        const id = payload.id
        const uid = auth.currentUser.uid
        return userRef.doc(uid).collection('words').doc(id).get()
    },
    updateWord({ commit }, payload) {
        const id = payload.id
        const uid = auth.currentUser.uid
        const { sentence, author, publisher } = payload.word
        userRef.doc(uid).collection('words').doc(id).update({
                sentence,
                author,
                publisher,
                updated_at: timeStamp
            })
            .then(() => {
                return alert('updated')
            })
            .catch((error) => {
                console.log(error.message)
            })
    }
}

export const mutations = {
    initWords(state) {
        state.words = []
    },
    login(state, user) {
        state.displayName = user.user.displayName
    },
    fetchWords(state, word) {
        state.words.push(word)
    },
}

export const getters = {
    getWords(state) {
        return state.words
    },
    user: state => {
        return state.user
    }
}