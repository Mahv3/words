<template>
    <v-app>
        <Navigation />

        <v-container class="row justify-center">
            <form>
                <input type="password" v-model="password" placeholder="新しいパスワードを入力してください">

                <button @click.prevent="createNewPassword">変更</button>
                <button @click.prevent="passwordReset">emailから変更をする</button>
            </form>
        </v-container>
    </v-app>
</template>

<script>
import Navigation from '~/components/Navigation'
import firebase from '~/plugins/firebase'
export default {
    data(){
        return{
            password:''
        }
    },
    methods:{
        createNewPassword(){
            const newPassword = this.password
            const passLength = this.password.length

            firebase.auth().currentUser.updatePassword(newPassword)
                .then(()=>{
                    alert('パスワードを変更しました。')
                    firebase.auth().signOut()
                    this.$router.push('/login')
                })
                .catch(()=>{
                    if(passLength < 6){
                        alert('パスワードは6文字以上で入力してください')
                    }
                })
        },
        passwordReset(){
            const  email = firebase.auth().currentUser.email
            firebase.auth().sendPasswordResetEmail(email)
                .then(()=>{
                    alert('emailにパスワード変更のリンクを送信しました')
                })
                .catch(()=>{
                    alert('emailにパスワード変更のリンクを送信できませんでした')
                })
        }
    }
}
</script>
