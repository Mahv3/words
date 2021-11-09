<template>
    <v-app>
        <Navigation />
        <v-main>
            <v-container class="row justify-center">
                <h3>Welcome {{user.displayName}}</h3>

                <form>
                    <button @click.prevent="logout">ログアウト</button>

                    <nuxt-link to="/password">パスワード変更はこちらから</nuxt-link>
                    <nuxt-link to="/users">登録済みのユーザー</nuxt-link>
                </form>

                <nuxt-link to="/user/profile">プロフィール編集</nuxt-link>
                <button @click.prevent="withdrawal">退会</button>
            </v-container>

              <v-container
                class="py-8 px-6"
                fluid
            >
                <v-row>
                <v-col
                    cols="12"
                >
                    <v-card>
                    <v-subheader>最近の投稿</v-subheader>

                    <v-list two-line>
                        <template v-for="(word,index) in this.userWords">
                        <v-list-item
                            :key="index"
                            link
                        >
                            <v-list-item-avatar color="grey darken-1">
                            </v-list-item-avatar>

                            <v-list-item-content>
                            <v-list-item-title>{{ word.author }}</v-list-item-title>

                            <v-list-item-subtitle>
                                {{word.sentence}}
                            </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-divider :key="word.id"></v-divider>
                        </template>
                    </v-list>
                    </v-card>
                </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import Navigation from '~/components/Navigation'
import firebase from '~/plugins/firebase'
export default {
    data(){
        return{
            user:{},
            words:{},
            userWords:[]
        }
    },
    mounted(){
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                const id = this.$route.params.id
                firebase.firestore().collection('users').doc(id).get()
                .then(res=>{
                    this.user = res.data()
                })

                const uid = user.uid
                firebase.firestore().collection('words').where('uid','==',uid).get()
                .then(snapshot=>{
                    snapshot.docs.forEach(doc=>{
                        const data = doc.data()
                        this.userWords.push(data)
                    })
                })
            }else{
                this.$router.push('/login')
            }
        })
    },
    methods:{
        logout(){
            this.$store.dispatch('logout')
        },
        withdrawal() {
            const res = confirm('退会処理を行いますか？')
            if(res == true){
                const id = this.$route.params.id
                // firebase.auth().signOut()
                // firebase.firestore().collection('users').doc(id).delete()
                firebase.firestore().collection('words').where('uid','==',id).get()
                .then(docs=>{
                    docs.forEach(doc=>{
                        doc.delete()
                    })
                })
                // this.$router.push('/')
                // alert('退会しました')
            }else{
                return
            }
        }
    }
}
</script>
