<template>
    <div>
        <v-navigation-drawer
          v-model="drawer"
          app
        >
            <v-sheet
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
                <v-icon>mdi-home-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item link @click="post">
              <v-list-item-icon>
                <v-icon>mdi-pencil</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Post</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item link @click="register">
              <v-list-item-icon>
                <v-icon>mdi-account-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>register</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item link @click="mypage">
              <v-list-item-icon>
                <v-icon>mdi-account-circle</v-icon>
              </v-list-item-icon>
                  <v-list-item-content>
                      <v-list-item-title>Mypage</v-list-item-title>
                  </v-list-item-content>
              </v-list-item>

          </v-list>
        </v-navigation-drawer>

        <v-app-bar color="primary" dark app>
            <v-app-bar-nav-icon @click="drawer=!drawer"></v-app-bar-nav-icon>
              <v-toolbar-title>words</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-menu offset-y>
                <template v-slot:activator="{on}">
                  <v-btn v-if="user.displayName == '' " @click="login" text style="text-transform: none">
                    <v-icon>mdi-login</v-icon>
                    login
                    </v-btn>
                  <v-btn v-else v-on="on" text style="text-transform: none">{{ user.displayName }}</v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-btn text @click.prevent="logout">
                        <v-icon>mdi-logout</v-icon>
                        Logout
                        </v-btn>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar-items>
        </v-app-bar>
    </div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
    data(){
        return {
          drawer:false,
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
            this.user.displayName = user.displayName
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
      },
      logout(){
        alert('ログアウトしました。')
        firebase.auth().signOut()
        .then(()=>{
          location.reload()
        })
      }
    }
}
</script>
