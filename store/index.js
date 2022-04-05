import Vue from 'vue'
import Vuex from 'vuex'
import { firebase } from './modules'

Vue.use(Vuex)

export const actions = {
    // registerGoogle() {
    //     let provider = new firebase.auth.GoogleAuthProvider()
    //     auth.signInWithPopup(provider)
    //         .then(user => {
    //             db.collection('users').doc(user.user.uid).set({
    //                 displayName: user.user.email,
    //                 createdAt: firebase.firestore.FieldValue.serverTimestamp()
    //             })
    //             auth.currentUser.sendEmailVerification()
    //             alert('ログインしました')
    //             $nuxt.$router.push('/')
    //         }).catch(function(error) {
    //             console.log(error)
    //         })
    // },
}
