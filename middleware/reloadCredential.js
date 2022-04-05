import firebase from '@/plugins/firebase'

export default async ({store}) => {
    if(process.client){
        return new Promise((resolve) => {
            firebase.auth().onAuthStateChanged( async (user) => {
                if(user){
                    const userData = JSON.parse(JSON.stringify(user))
                    store.commit('modules/user/login',userData)
                }
                if(!store.getters['modules/words/isFetchedWords']){
                    await store.dispatch('modules/firebase/fetchWords')
                }
                resolve()
            })
        })
    }
}
