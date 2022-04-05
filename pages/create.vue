<template>
    <v-app>
        <Navigation />
        <v-main>
            <v-card class="mx-auto my-6 col-8" elevation="0">
                    <v-card-title class="mb-5">word作成</v-card-title>
                        <v-textarea
                            placeholder="what words?"
                            v-model="word.sentence" solo
                        ></v-textarea>
                        <v-text-field type="text" solo placeholder="who said?" v-model="word.author"></v-text-field>

                        <v-card-actions>
                            <v-btn small class="mb-3" block  width="100px" height="40px" color="success" @click="createWord">post</v-btn>
                        </v-card-actions>
            </v-card>
        </v-main>
    </v-app>
</template>

<script>
import Navigation from '~/components/Navigation'
export default {
    data() {
        return {
            word: {
                sentence: "",
                author: ""
            }
        };
    },
    async mounted(){
        this.$store.dispatch('modules/firebase/notSignedUserRouting')
    },
    methods: {
        async createWord() {
            const userInfo = await this.$store.dispatch("modules/firebase/getUserInfo")
            if (this.word.sentence == "" || this.word.author == "") return alert('未入力の投稿はできません。')
            this.$store.dispatch("modules/firebase/createNewWord", {
                word: this.word,
                creator: userInfo.displayName,
                photoURL: userInfo.photoURL
            })
        }
    }
};
</script>
