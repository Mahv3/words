export default {
    namespaced: true,
    state:{
        user: {}
    },
    mutations:{
        login(state, user) {
            state.user = user
        },
        updatedPhotoURL(state, photoURL){
            state.user.photoURL = photoURL
        },
        signout(state){
            state.user = {}
        }
    },
    actions:{
    },
    getters:{
        getUid(state){
            return state.user.uid
        },
        getUserInfo(state){
            return state.user
        }
    }
}
