<template>
    <v-app>
        <Navigation />
        <v-main>
            <v-container>
                <h3>word</h3>
                {{word.sentence}}
                <input type="text" v-model="update.sentence">

                <h3>author</h3>
                {{word.author}}
                <input type="text" v-model="update.author">

                <h3>publisher</h3>
                {{word.publisher}}
                <input type="text" v-model="update.publisher">
            </v-container>
            <button @click.prevent="updateWord">update</button>
            <button @click.prevent="deleteWord">delete</button>

        </v-main>
    </v-app>

</template>

<script>
import Navigation from '~/components/Navigation'
import firebase from '~/plugins/firebase'
export default {
    data(){
        return{
            word:{
                sentence:'',
                publisher:'',
                author:''
            },
            update:{
                sentence:'',
                author:'',
                publisher:''
            }
        }
    },
    mounted(){
       const id = this.$route.params.id
       firebase.firestore().collection('words').doc(id).get()
            .then(doc=>{
                const data = doc.data()
                this.word.publisher = data.publisher
                this.word.sentence = data.sentence
                this.word.author = data.author
            })
    },
    methods:{
        deleteWord(){
            const res = confirm('削除しますか？')
            if(res == true){
                const id = this.$route.params.id
                firebase.firestore().collection('words').doc(id).delete()
                alert('削除しました')
                this.$router.push('/')
            }
        },
        updateWord(){
            const id = this.$route.params.id
            if(this.update.sentence==="" && this.update.author === "" && this.update.publisher === ""){
                return alert('変更箇所がありません')
            }
            if(!this.update.sentence == ""){
                firebase.firestore().collection('words').doc(id).update({
                    sentence:this.update.sentence
                })
            }
            if(!this.update.author == ""){
                firebase.firestore().collection('words').doc(id).update({
                    author:this.update.author
                })
            }
            if(!this.update.publisher ==""){
                firebase.firestore().collection('words').doc(id).update({
                    publisher:this.update.publisher
                })
            }
            firebase.firestore().collection('words').doc(id).update({
                updatedAt:firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(()=>{
                alert('updated!')
                this.$router.push('/')
            })
        }
    }
}
</script>
