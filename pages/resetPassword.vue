<template>
    <v-app>
        <Navigation />
        <v-main>
            <v-container class="py-8 px-6" fluid>
                <v-row>
                    <v-col cols="12">
                        <v-card>
                            <input fluid type="text"  v-model="email" placeholder="登録しているemialを入力してください">
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import Navigation from '~/components/Navigation'
export default {
    data(){
        return{
            email:''
        }
    }

}
</script>
