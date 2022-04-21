import firebase from '~/plugins/firebase'
import "firebase/firestore"
import "firebase/auth"
import "firebase/storage"

const db = firebase.firestore()
const usersRef = db.collection('users')
const wordCollection = db.collectionGroup('words')
const auth = firebase.auth()
const storage = firebase.storage()
const timeStamp = firebase.firestore.FieldValue.serverTimestamp()
const increment = firebase.firestore.FieldValue.increment(1)
const decrement = firebase.firestore.FieldValue.increment(-1)

export default {
    namespaced: true,
    state: {},
    mutations: {
    },
    actions: {
        async registerWithEmailAndPassword({ commit }, {email, password, displayName}) {
            const res = await auth.createUserWithEmailAndPassword(email, password)
            const uid = res.user.uid
            await usersRef.doc(uid).set({
                uid,
                displayName,
                email,
                likesCount: 0,
                created_at: timeStamp
            })
            const user = await usersRef.doc(uid).get()
            const userCopy = JSON.parse(JSON.stringify(user.data()))
            commit("modules/user/login", {userCopy}, {root:true})
            alert("ログインしました")
            $nuxt.$router.push("/")
        },
        async loginWithEmailAndPassword({ commit }, { email, password }) {
            if(email === "" || password === ""){
                return alert("メールアドレスとパスワードを入力してください")
            }
            try{
                const res = await auth.signInWithEmailAndPassword(email, password)
                const user = JSON.parse(JSON.stringify(res.user))
                await commit('modules/user/login', user,{root:true})
                alert("ログインしました")
                $nuxt.$router.push('/')
            }catch(error){
                alert("emailかパスワードが正しくありません。")
            }
        },
        async registerWithGoogleAccount({commit}) {
            const provider = new firebase.auth.GoogleAuthProvider()
            const res = await auth.signInWithPopup(provider)
            const uid = res.user.uid
            usersRef.doc(res.user.uid).set({
                uid,
                displayName: res.user.email,
                createdAt: timeStamp,
                likesCount:0,
                email: res.user.email
            })
            auth.currentUser.sendEmailVerification()
            alert('ログインしました')
            $nuxt.$router.push('/')
        },
        async loginWithGoogleAccount(){
            const provider = new firebase.auth.GoogleAuthProvider()
            await auth.signInWithPopup(provider)
            alert("ログインしました")
            $nuxt.$router.push("/")
        },
        async getUid({ context }){
            return auth.currentUser.uid
        },
        async getUserInfo(){
            if(!auth.currentUser == null){
                const uid = auth.currentUser.uid
                const userInfo = await usersRef.doc(uid).get()
                return userInfo.data()
            }else{
                return
            }
        },
        async createNewPassword({context},{newPassword}){
            await auth.currentUser.updatePassword(newPassword)
            alert("パスワードを変更しました")
            auth.signOut()
            $nuxt.$router.push('/login')
        },
        notSignedUserRouting() {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    return
                } else {
                    $nuxt.$router.push('login')
                }
            })
        },
        async withdrawal({context}, {uid}){
            const res = confirm("退会処理を行いますか？")
            if(res == true){
                await usersRef.doc(uid).delete()
                await auth.signOut()
                $nuxt.$router.push('/')
                alert("退会しました")
            }
        },
        async fetchWords({ commit},) {
            try {
                const words = []
                const res = await wordCollection.orderBy('created_at', 'desc').get()
                res.forEach((doc) => {
                    words.push(doc.data())
                })
                const copyWords = JSON.parse(JSON.stringify(words))
                commit('modules/words/fetchWords', copyWords,{root:true})
                return words
            } catch (error) {
                console.log(error.message)
            }
        },
        async getTargetWord({ commit }, { id }){
            const words = await wordCollection.get()
            const targetWord = []
            words.forEach(word => {
                if(word.data().id == id){
                    targetWord.push(word.data())
                }
            })
            return targetWord[0]
        },
        async getWordsToTheLimit({commit},{ limit, scrollCount }){
            try{
                const words = []
                const res = await wordCollection.orderBy("created_at", "desc").get()
                res.forEach((doc) => {
                    words.push(doc.data())
                })
                const displayWords = words.splice(scrollCount*limit, limit)
                const copyWords = JSON.parse(JSON.stringify(displayWords))
                commit("modules/words/fetchWords", copyWords, {root:true})
                return displayWords
            }catch(error){
                console.log(error.message)
            }
        },
        // async readWordsByScroll({commit}, {scrollCount}){
        //     try{
        //         const words = []
        //         const res = await wordCollection.orderBy("created_at","desc").startAt(scrollCount*10).get()
        //         console.log(res)
        //         res.forEach((doc) => {
        //             words.push(doc.data())
        //         })
        //         commit("modules/words/addWords", words, {root: true})
        //         return words
        //     }catch(error){
        //         console.log(error.message)
        //     }
        // },
        async createNewWord({ commit }, { word, creator, photoURL }) {
            console.log(photoURL)
            const uid = auth.currentUser.uid
            const id = usersRef.doc(uid).collection('words').doc().id
            const newWord = {
                id,
                uid,
                creator,
                photoURL,
                sentence: word.sentence,
                author: word.author,
                created_at: timeStamp
            }
            await usersRef.doc(uid).collection('words').doc(id).set(newWord)
            alert('投稿しました。')
            $nuxt.$router.push('/')
        },
        async getMyWords() {
            const uid = auth.currentUser.uid
            const myWords = []
            try {
                const res = await usersRef.doc(uid).collection('words').orderBy('created_at', 'desc').get()
                res.forEach((doc) => {
                    myWords.push(doc.data())
                })
                return myWords
            } catch (error) {
                console.log(error.message)
            }
        },
        async showWordDetail(context,{id}){
            try{
                const uid = context.state.user.uid
                const word = await usersRef.doc(uid).collection('words').doc(id).get()
                return word.data()
            }catch(error){
                console.log(error.message)
            }
        },
        async updateWord({ commit }, {id,word}) {
            try{
                const uid = auth.currentUser.uid
                const { sentence, author } = word
                await usersRef.doc(uid).collection('words').doc(id).update({
                    sentence,
                    author,
                    updated_at: timeStamp
                })
                return alert('updated')
            }catch(error){
                console.log(error.message)
            }
        },
        async deleteWord({context},{id}){
            const uid = auth.currentUser.uid
            const res = confirm("削除しますか？")
            if(res == true){
                await usersRef.doc(uid).collection("words").doc(id).delete()
                alert("削除しました")
                this.$router.push("/")
            }
        },
        async getSignedUser(){
            const uid = auth.currentUser.uid
            const user = await usersRef.doc(uid).get()
            return user.data()
        },
        async updateProfile({ commit }, {displayName, uploadImageURL, file}) {
            try{
                const email = auth.currentUser.email
                const storageRef = storage.ref().child(email)
                await storageRef.put(file)
                const photoURL = await storageRef.getDownloadURL()
                const uid = auth.currentUser.uid
                await usersRef.doc(uid).update({
                    displayName,
                    photoURL,
                    updated_at: timeStamp
                })
                await commit('modules/user/updatedPhotoURL', photoURL,{root:true})
                alert("updated")
                $nuxt.$router.push('/')
            }catch(error){
                console.log(error.message)
            }
        },
        async postComment({ commit }, {wordCreatorUid,id,value}) {
            try{
                const uid = auth.currentUser.uid
                const userInfo = await usersRef.doc(uid).get()
                const creator = userInfo.data().displayName
                const comment = {
                    id: usersRef.doc(uid).collection('words').doc(id).collection('comment').doc().id,
                    value,
                    uid,
                    creator,
                    likesCount: 0,
                    created_at: timeStamp
                }
                await usersRef.doc(wordCreatorUid).collection('words').doc(id).collection('comment').doc(comment.id).set(comment)
                alert('投稿しました')
                location.reload()
            }catch(error){
                console.log(error.message)
            }
        },
        async getCommentList({ commit }, {wordCreatorUid, id}) {
            const commentList= []
            const res = await usersRef.doc(wordCreatorUid).collection('words').doc(id).collection('comment').orderBy("created_at", "desc").get()
            res.forEach((comment) => {
                commentList.push(comment.data())
            })
            const commentListData = [...commentList]
            commit('modules/comment/getCommentList',commentListData,{root:true})
            return commentList
        },
        async getReplyList({ commit }, { id }){
            const replys = []
            const replyList = await db.collectionGroup("reply").get()
            replyList.forEach(reply => {
                if(reply.data().wordId == id){
                    replys.push(reply.data())
                }
            })
            return replys
        },
        async getTargetComment({ context }, { id }){
            const comments = await firebase.firestore().collectionGroup("comment").get()
            return comments
        },
        async postReply({ context }, { value, wordCreatorUid, wordId, commentId, targetComment}){
            const postUserId = auth.currentUser.uid
            const userInfo = await usersRef.doc(postUserId).get()
            const creator = userInfo.data().displayName
            const id = usersRef.doc(wordCreatorUid).collection("words").doc(wordId).collection("comment").doc(commentId).collection("reply").doc().id
            const reply = {
                id,
                wordId,
                value,
                postUserId,
                creator,
                likesCount:0,
                address: targetComment.creator,
                commentText: targetComment.value,
                created_at: timeStamp
            }
            await usersRef.doc(wordCreatorUid).collection("words").doc(wordId).collection("comment").doc(commentId).collection("reply").doc(id).set(reply)
            alert("posted")
            location.reload()
        },
        async wordLike({ context }, { wordId, wordCreatorUid }){
            const uid = auth.currentUser.uid
            const batch = db.batch()
            const likedUsersRef = usersRef.doc(wordCreatorUid).collection("words").doc(wordId).collection("likedUsers")
            const likedPostsRef = usersRef.doc(uid).collection("likedPosts")
            const wordsRef = usersRef.doc(wordCreatorUid).collection("words")
            const alreadyLikedUser = await usersRef.doc(wordCreatorUid).collection('words').doc(wordId).collection("likedUsers").get()
            const likedUsersOpts = {
                uid,
                created_at: timeStamp
            }
            const likedPostsOpts = {
                wordId,
                created_at: timeStamp
            }
            const incrementLikesCount = {
                likesCount: increment,
                updated_at: timeStamp
            }
            const decrementLikesCount = {
                likesCount: decrement,
                updated_at: timeStamp
            }
            const wordLikeFunction = () => {
                batch.set(likedUsersRef.doc(uid), likedUsersOpts)
                batch.set(likedPostsRef.doc(wordId), likedPostsOpts)
                batch.update(wordsRef.doc(wordId), incrementLikesCount)
                batch.update(usersRef.doc(uid), incrementLikesCount)
            }
             try{
                if(alreadyLikedUser.empty == true){
                    alert("いいね")
                    wordLikeFunction()
                }else{
                    const alreadyLikedUsersId = []
                    alreadyLikedUser.forEach((user) => {
                        alreadyLikedUsersId.push(user.data().uid)
                    })
                    if(alreadyLikedUsersId.includes(uid)){
                        console.log(alreadyLikedUsersId, uid)
                            batch.delete(likedUsersRef.doc(uid))
                            batch.delete(likedPostsRef.doc(wordId))
                            batch.update(wordsRef.doc(wordId), decrementLikesCount)
                            batch.update(usersRef.doc(uid), decrementLikesCount)
                            alert("いいね解除")
                        }else{
                            alert("いいね")
                            commentLikeFunction()
                        }
                }
                await batch.commit()
            }catch(error){
                if(error.message == "A write batch can no longer be used after commit() has been called."){
                    alert(`このボタンは連続して押すことができません。\nしばらくしてから再度実行してください。`)
                }else{
                    console.log(error.message)
                }
            }
        },
        async commentLike({context}, {wordCreatorUid,wordId,commentId}){
            const uid = auth.currentUser.uid
            const batch = db.batch()
            const likedUsersRef = usersRef.doc(wordCreatorUid).collection("words").doc(wordId).collection("comment").doc(commentId).collection('likedUsers')
            const likedPostsRef = usersRef.doc(uid).collection('likedPosts')
            const commentsRef = usersRef.doc(wordCreatorUid).collection('words').doc(wordId).collection("comment")
            const alreadyLikedUser = await usersRef.doc(wordCreatorUid).collection('words').doc(wordId).collection('comment').doc(commentId).collection('likedUsers').get()
            const likedUsersOpts = {
                uid,
                created_at: timeStamp
            }
            const likedPostsOpts = {
                commentId,
                created_at: timeStamp
            }
            const incrementLikesCount = {
                likesCount: increment,
                updated_at: timeStamp
            }
            const decrementLikesCount = {
                likesCount: decrement,
                updated_at: timeStamp
            }
            const commentLikeFunction = () => {
                batch.set(likedUsersRef.doc(uid), likedUsersOpts)
                batch.set(likedPostsRef.doc(commentId), likedPostsOpts)
                batch.update(commentsRef.doc(commentId), incrementLikesCount)
                batch.update(usersRef.doc(uid), incrementLikesCount)
            }
            try{
                if(alreadyLikedUser.empty == true){
                    alert("いいね")
                    commentLikeFunction()
                }else{
                    const alreadyLikedUsersId = []
                    alreadyLikedUser.forEach((user) => {
                        alreadyLikedUsersId.push(user.data().uid)
                    })
                    if(alreadyLikedUsersId.includes(uid)){
                        batch.delete(likedUsersRef.doc(uid))
                        batch.delete(likedPostsRef.doc(commentId))
                        batch.update(commentsRef.doc(commentId), decrementLikesCount)
                        batch.update(usersRef.doc(uid), decrementLikesCount)
                        alert("いいね解除")
                    }else{
                        alert("いいね")
                        commentLikeFunction()
                    }
                }
                await batch.commit()
            }catch(error){
                if(error.message == "A write batch can no longer be used after commit() has been called."){
                    alert(`このボタンは連続して押すことができません。\nしばらくしてから再度実行してください。`)
                }else{
                    console.log(error.message)
                }
            }
        },
        async signout({commit}) {
            commit("modules/user/signout", {}, {root:true})
            await auth.signOut()
            alert('ログアウトしました。')
            $nuxt.$router.push("/login")
        },
        async sendEmailToResetPassword({ context }, { email }){
            try{
                await auth.sendPasswordResetEmail(email)
                alert("登録しているemailにリセットフォームを送信しました")
            }catch(error){
                alert("そのemailは登録されていないか、退会しています。")
            }


            //  const  email = firebase.auth().currentUser.email
            // firebase.auth().sendPasswordResetEmail(email)
            //     .then(()=>{
            //         alert('emailにパスワード変更のリンクを送信しました')
            //     })
            //     .catch(()=>{
            //         alert('emailにパスワード変更のリンクを送信できませんでした')
            //     })
            // }
        }
    },
}
