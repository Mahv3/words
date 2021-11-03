<template>
    <v-app>
        <Navigation />
        <v-container class="row justify-center">
            <div>
                <h1 class="mb-5">word作成</h1>
                <div class="row justify-center mb-3">
                    <textarea
                        cols="30"
                        rows="5"
                        placeholder="wordを入力してください"
                        require
                        name="word"
                        v-model="word.sentence"
                    ></textarea>
                </div>

                <div class="row justify-center mb-3">
                    <input type="text" name="author" require placeholder="著者を入力してください" v-model="word.author" />
                </div>

                <div class="row justify-center mb-3">
                    <input type="text" name="publisher" placeholder="出版社を入力してください" v-model="word.publisher" />
                </div>

                <button class="row justify-center mb-3" @click="createWord">投稿</button>
            </div>
        </v-container>
    </v-app>
</template>

<script>
import firebase from '~/plugins/firebase'
import Navigation from '~/components/Navigation'
export default {
    data() {
        return {
            word: {
                sentence: "",
                author: "",
                publisher: ""
            }
        };
    },
    mounted(){
        firebase.auth().onAuthStateChanged((user)=>{
            if(user === null){
               this.$router.push('/login')
            }
        })
    },
    methods: {
        createWord() {
            if (this.word.sentence == "" || this.word.author == "") {
                return;
            }
            this.$store.dispatch("createWord", { word: this.word });
        }
    }
};
</script>

<style scopde>
textarea,
input {
    border: 1px solid #333;
}
</style>
