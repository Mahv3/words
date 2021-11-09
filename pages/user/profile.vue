<template>
    <v-app>
        <Navigation />

        <v-container class="row justify-center">
            <form>
                <h3>displayName</h3>
                <div>Now {{user.displayName}}</div>
                <input type="text" class="yellow" v-model="displayName">
            </form>

            <button @click.prevent="updateProfile">update!</button>
        </v-container>
    </v-app>
</template>

<script>
import Navigation from '~/components/Navigation'
import firebase from '~/plugins/firebase'
export default {
    data(){
        return{
            user:{},
            displayName:''
        }
    },
    mounted(){
        const id = firebase.auth().currentUser.uid
        firebase.firestore().collection('users').doc(id).get()
        .then(res=>{
            this.user = res.data()
        })
    },
    methods:{
        updateProfile(){
            if(this.displayName == ""){
                return
            }
            const id = firebase.auth().currentUser.uid
           firebase.firestore().collection('users').doc(id).update({
               displayName : this.displayName,
               updatedAt:firebase.firestore.FieldValue.serverTimestamp()
           })
           alert('updated!')
           this.$router.push(`/user/${id}`)
        }
    }

}
</script>
