<template>
    <v-app>
        <Navigation />
        <v-main>
            <v-container class="row justify-center">
                <v-card elevation="0" class="col-11">
                    <v-card-title>Mypage</v-card-title>
                    <form>
                        <nuxt-link to="/password">パスワード変更はこちらから</nuxt-link>
                        <nuxt-link to="/user/profile">プロフィール編集</nuxt-link>
                        <v-btn text color="blue" @click.prevent="logout">ログアウト</v-btn>
                        <v-btn text color="blue" @click.prevent="withdrawal">退会</v-btn>
                    </form>
                </v-card>
            </v-container>

            <v-container class="py-8 px-6" fluid>
                <v-row>
                    <v-col cols="12">
                        <v-card elevation="0">
                            <v-subheader>最近の投稿</v-subheader>

                            <v-list two-line>
                                <template v-for="(word,index) in this.myWords">
                                    <v-list-item
                                        :key="index"
                                        link
                                        @click.prevent="routeToWordDetail(index)"
                                    >
                                        <v-list-item-avatar color="grey darken-1">
                                            <img :src="word.photoURL" alt="">
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
            myWords:[]
        }
    },
    async created(){
        const myWords = await this.$store.dispatch('modules/firebase/getMyWords')
        this.myWords = myWords
    },
    methods:{
        logout(){
            this.$store.dispatch('modules/firebase/signout')
        },
        async withdrawal() {
            const id = this.$route.params.id
            this.$store.dispatch("modules/firebase/withdrawal",{id})
        },
        routeToWordDetail(index){
            const id = this.myWords[index].id
            this.$router.push(`/word/${id}`)
        }
    }
}
</script>
