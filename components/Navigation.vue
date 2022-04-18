<template>
    <div>
        <v-navigation-drawer v-model="drawer" app>
            <v-sheet class="pa-4">
                <v-avatar class="mb-2" size="120">
					<img class="col-12" :src="this.user.photoURL" alt="Avatar">
					<v-icon></v-icon>
				</v-avatar>
                <div>{{ user.displayName }}</div>
          	</v-sheet>
          	<v-divider></v-divider>
          	<v-list>
				<v-list-item link @click="home">
					<v-list-item-icon>
						<v-icon color="blue">mdi-home-circle</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Home</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-item link @click="post">
					<v-list-item-icon>
						<v-icon color="blue">mdi-pencil</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Post</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-item link @click="register" v-if="this.user.displayName == ''">
					<v-list-item-icon>
						<v-icon color="blue">mdi-account-plus</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>register</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-item link @click="mypage">
					<v-list-item-icon>
						<v-icon color="blue">mdi-account-circle</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Mypage</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
        	</v-list>
        </v-navigation-drawer>

        <v-app-bar color="blue" dark app>
            <v-app-bar-nav-icon @click="drawer=!drawer"></v-app-bar-nav-icon>
              	<v-toolbar-title>words</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              	<v-menu offset-y>
					<template v-slot:activator="{on}">
						<v-btn v-if="user.displayName == ''" @click.prevent="login" text style="text-transform: none">
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
        	drawer:null,
			user:{}
        }
    },
    async mounted(){
		const user = await this.$store.dispatch("modules/firebase/getUserInfo")
		if(!user == ""){
			this.user = user
		}
    },
    methods:{
    	home(){
			this.$router.push('/')
		},
		post(){
			this.$store.dispatch('modules/firebase/notSignedUserRouting')
			this.$router.push('/create')
		},
		login(){
			this.$router.push('/login')
		},
		register(){
			this.$router.push('/register')
		},
		mypage(){
			this.$store.dispatch('modules/firebase/notSignedUserRouting')
			this.$router.push(`/user/${this.user.id}`)
		},
		logout(){
			this.$store.dispatch('modules/firebase/signout')
		}
    }
}
</script>
