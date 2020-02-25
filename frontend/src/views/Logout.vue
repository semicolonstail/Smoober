<template></template>


<script>
var data = require('@/frontend-db');

export default {
    data() {
        return {
            user: {
                userId: '',
                type: '',
                username: '',
                isSignedIn: false
            }
        }
    },

    methods: {
        signOut() {
            data.signOut(() => {

            })
            this.$router.push("/")
        },     
    },

    beforeMount() {
        this.$emit('loginStatus', this.user)

        // show header and footer after log out
        this.$emit('header', true);
        this.$emit('footer', true)
		
        this.signOut()
    }  
}
</script>


<style>
</style>