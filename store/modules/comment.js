export default {
    namespaced: true,
    state:{
        commentList:[]
    },
    mutations:{
        getCommentList(state,commentListData){
            state.commentList = commentListData
        }
    },
    actions:{
},
    getters:{
        getCommentList(state){
            return state.commentList
        }
    }
}
