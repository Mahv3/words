<template>
    <v-app>
        <Navigation />
        <v-main>
      <v-container
        class="py-8 px-6"
        fluid
      >
        <v-row>
          <v-col
            cols="12"
          >
            <v-card>
              <v-subheader>登録済みユーザー</v-subheader>

              <v-list two-line>
                <template v-for="(user,index) in users">
                  <v-list-item
                    :key="index"
                  >
                    <v-list-item-avatar color="grey darken-1">
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ user }}</v-list-item-title>

                      <v-list-item-subtitle>
                        <!-- {{word.sentence}} -->
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- <v-divider :key="word.id"></v-divider> -->
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
      users:[]
    }
  },
    created(){
      const users = []
        firebase.firestore().collection('users').get()
          .then(querySnapshot=>{
            querySnapshot.forEach(doc=>{
              users.push(doc.data().displayName)
            })
            this.users = users
          })
    }
}
</script>
