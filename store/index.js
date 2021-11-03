import firebase from '~/plugins/firebase'
import 'firebase/storage'

const db = firebase.firestore()
const wordRef = db.collection('words')
const firestorage = firebase.storage()

export const state = () => ({
    words: [],
    user: {
        uid: '',
        email: '',
        login: false
    },
    users: []
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
        const word = {
            id: wordRef.doc().id,
            sentence: payload.word.sentence,
            author: payload.word.author,
            publisher: payload.word.publisher,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        }
        wordRef.add(word)
        this.$router.push('/')
    },
    login({ dispatch }, payload) {
        const email = payload.email
        const password = payload.password
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                alert('ログインしました')
                dispatch('checkLogin')
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage)
                alert('メールアドレス、またはパスワードに誤りがあります。')
            });
    },
    loginGoogle({ dispatch }) {
        let provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider)
            .then(function(result) {
                alert('ログインしました')
                dispatch('checkLogin')
            }).catch(function(error) {
                console.log(error)
            })
    },
    register({ dispatch }, payload) {
        const email = payload.email
        const password = payload.password

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(user => {
                console.log(user)
                firebase.firestore().collection('users').doc(user.uid).set(user)
                dispatch('checkLogin')
                alert('登録しました')
                firebase.auth().currentUser.sendEmailVerification()
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage)
            });
    },
    checkLogin({ commit }) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firebase.auth().currentUser.updateProfile({
                    displayName: user.email
                })
                commit('getData', { uid: user.uid, email: user.email })
                commit('switchLogin')
            } else {
                $nuxt.$router.push('/login')
            }
        })
    },
    logout({ commit }) {
        firebase.auth().signOut()
            .then(() => {
                alert('ログアウトしました')
                commit('logout')
            }).catch(function(error) {
                console.log(error)
            });
    },
    getUsers({ commit }) {
        const users = []
        firebase.firestore().collection('users').get()
            .then((res) => {
                console.log(res.data)
            })
        commit('getUsers', users)
    }
}

export const mutations = {
    initUsers(state) {
        state.words = []
    },
    createWord(state, word) {
        state.words.push(word)
    },
    getData(state, payload) {
        state.user.uid = payload.uid
        state.user.email = payload.email
    },
    switchLogin(state) {
        state.user.login = true
    },
    logout(state) {
        state.user.uid = ''
        state.user.email = ''
        state.user.password = ''
        state.user.login = false
    },
    getUsers(state, payload) {
        state.users = payload.users
    }
}

export const getters = {
    getWords(state) {
        return state.words
    },
    user: state => {
        return state.user
    },
    getUsers: state => {
        return state.users
    }
}