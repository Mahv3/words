<template>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-sheet
        color="grey lighten-4"
        class="pa-4"
      >
        <v-avatar
          class="mb-4"
          color="grey darken-1"
          size="64"
        ></v-avatar>

        <div>{{ user.displayName }}</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item link @click="home">
          <v-list-item-icon>
            <v-icon>mdi-inbox-arrow-down</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="post">
          <v-list-item-icon>
            <v-icon>mdi-send</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Post</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="login">
          <v-list-item-icon>
            <v-icon>mdi-inbox-arrow-down</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="register">
          <v-list-item-icon>
            <v-icon>mdi-inbox-arrow-down</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>register</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="mypage">
          <v-list-item-icon>
            <v-icon>mdi-inbox-arrow-down</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Mypage</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
    data(){
        return {
            drawer:true,
            user:{
              id:null,
              displayName:''
            }
        }
    },
    mounted(){
       firebase.auth().onAuthStateChanged((user)=>{
            if(user){
              const id = user.uid
              this.user.id = id
              firebase.firestore().collection('users').doc(id).get()
              .then(res=>{
                this.user.displayName = res.data().displayName
              })
            }
        })
    },
    methods:{
      home(){
        this.$router.push('/')
      },
      post(){
        this.$router.push('/create')
      },
      login(){
        this.$router.push('/login')
      },
      register(){
        this.$router.push('/register')
      },
      mypage(){
        this.$router.push(`/user/${this.user.id}`)
      }
    }
}
</script>
