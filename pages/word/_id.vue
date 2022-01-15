<template>
    <v-app>
        <Navigation />
        <v-main>
            <v-card v-if="!this.edit" class="col-6 mx-auto my-12">
                <v-card-title>{{word.author}}</v-card-title>
                <v-card-subtitle>{{word.publisher}}</v-card-subtitle>
                <v-divider class="mx-3"></v-divider>
                <v-card-text>{{word.sentence}}</v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small @click.prevent="editWord">edit</v-btn>
                    <v-btn small @click.prevent="deleteWord">delete</v-btn>
                </v-card-actions>
            </v-card>


            <v-card v-if="this.edit" class="col-6 mx-auto my-12">
                <v-container>
                    <v-row class="col-12">
                        <v-card-title>edit word</v-card-title>
                        <v-btn text @click.prevent="closeEdit" class="ml-auto">
                            <v-icon>mdi-close-circle</v-icon>
                        </v-btn>
                    </v-row>
                    <v-divider class="mx-3"></v-divider>

                    <v-card-text>word</v-card-text>
                    <v-textarea type="text" solo v-model="word.sentence"></v-textarea>

                    <v-card-text>who said?</v-card-text>
                    <v-text-field type="text" solo v-model="word.author"></v-text-field>

                    <v-card-text>出版社</v-card-text>
                    <v-text-field type="text" solo v-model="word.publisher"></v-text-field>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small @click.prevent="updateWord">update</v-btn>
                     </v-card-actions>
                </v-container>
            </v-card>

        </v-main>
    </v-app>

</template>

<script>
import Navigation from '~/components/Navigation'
import firebase from '~/plugins/firebase'
export default {
    data(){
        return{
            edit:false,
            word:{
                sentence:'',
                publisher:'',
                author:''
            }
        }
    },
    async mounted(){
        const id = this.$route.params.id
        const res = await this.$store.dispatch("getWordDetail",{id})
        const {sentence,publisher,author} = res.data()
        this.word.sentence = sentence
        this.word.publisher = publisher
        this.word.author = author
    },
    methods:{
        editWord(){
            this.edit = true
        },
        closeEdit(){
            this.edit = false
        },
        async deleteWord(){
            const res = confirm('削除しますか？')
            if(res == true){
                const id = this.$route.params.id
                const uid = firebase.auth().currentUser.uid
                await firebase.firestore().collection('users').doc(uid).collection('words').doc(id).delete()
                alert('削除しました')
                this.$router.push('/')
            }
        },
        async updateWord(){
            const id = this.$route.params.id
            await this.$store.dispatch('updateWord',{
                id,
                word:this.word
            })
            this.edit = false
        }
    }
}
</script>
