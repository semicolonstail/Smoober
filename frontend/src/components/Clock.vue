<template>
    <div>
        <p class="time">{{time}}</p>
        <span>{{date}} </span>   
    </div>
</template>


<script>
    export default {
        name: 'Clock',
        data() {
            return { 
                clock:'',
                time:'',
                date: ''
            }
        },

         methods: {
            digital(value) {
                if(value<10) {
                    return '0'+value
                } else {
                    return value
                }
            }
        },

        created() {        
            this.id = setInterval(() => {
                this.clock=new Date();

                const years = this.digital(this.clock.getFullYear());
                const months = parseInt(this.digital(this.clock.getMonth()))+1;
                const days = this.digital(this.clock.getDate());
                const hours = this.digital(this.clock.getHours());
                const minutes = this.digital(this.clock.getMinutes());

                this.date = years + '-' + months + '-' + days;
                this.time = hours +':'+ minutes;   
            }, 1000)
        },
        
        destroyed() {
            clearInterval(this.id)  
        }
    }
</script>


<style scoped>
div {
    color: #fff;
    margin: 0;
    padding: 0;
}

.time {
    font-size: 2.8em;
    font-weight: 400;
}

span {
    color: rgb(228, 228, 228);
    display: block;
    font-size: 1.3em;
    margin-top: -36%;
    font-weight: 100;
}
</style>
