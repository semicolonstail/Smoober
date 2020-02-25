<template>
  <div class="box">
    <div class="bg">
      <img src="@/assets/login_bg.jpg" alt="login background">
      <div class="login">
        <div class="top">

          <form @submit.prevent="getUserById()">
          <div>
            <label>Username</label>
            <input type="text" v-model="username" v-on:click="empty" @keyup.enter="signIn">
          </div>
          <div>
            <label>Password</label>
            <input type="password" v-model="password" v-on:click="empty"  @keyup.enter="signIn">
          </div>
          <p class="tips">{{msg}}</p>
          <span v-on:click="signIn">Login</span>
        </form>

        <p class="register"><router-link to="/register">Create an account</router-link></p>
        </div>

        <div class="bottom" v-on:click="handleOAuth">
          <p>Or login with</p>
          <img src="@/assets/googleplus32.png" alt="google">
        </div>
      </div>
    </div>
  </div>
</template>


<script>
var data = require('@/frontend-db')

window.onload = function(){
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if(code){
    console.log(code)

    data.thirdParty(code, (errors, user) => {
      if(errors.length == 0){
        localStorage.user = JSON.stringify(user)       
        window.location.href = "http://localhost:8080/#/products"
      }else{
        console.log(errors)
        console.log("fail to authorization!")
      } 
    })
  }

}

export default {
  data(){
    return{
      username: '',
      password: '',
      msg: '',

      //google OAuth information
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      client_id: "1012649354433-jorv1l6ns3gbigml0psiil7tei5hefn7.apps.googleusercontent.com",
      client_secret: "MiwC-RGa50Zclt5c3V4nhOhJ",
      redirect_uri: "http://localhost:8080"
    }
  },

  methods: {
    empty() {
      this.msg = ''
    },

    signIn() {
      const user = {
        username: this.username,
        password: this.password
      }

      data.signIn(this.username, this.password, (errors, user) => {

        if(errors.length == 0){
          this.toParent(user)

          if(user.type == 0) {
            this.$router.push("/products/")
          } else {
            this.$router.push("/admin/")
          }

        }else{
          switch(errors[0]) {
            case "wrongPassword" :

              this.msg = "Username and password does not match"
              break
          }
        }

      })
    },

    toParent(user) {
      this.$emit('loginStatus', user)
    },

    handleOAuth(){
    window.location.href = this.auth_uri + "?access_type=offline&scope=openid%20email%20profile&response_type=code&client_id=" + this.client_id + "&redirect_uri=" + this.redirect_uri
    }

  }

}
</script>


<style scoped>
.box {
  margin-bottom: -4%;
}
.bg {
  width: 100%;
  height: 80vh;
  position: relative;
}

.bg>img {
  width: 100%;

}

.login {
  width: 30%;
  position: absolute;
  top: 16%;
  left: 10%;
}

.top{
  padding-right: 5%;
  box-sizing: border-box;
}

.top label {
  font-size: 1.1em;
  color: rgb(138, 138, 138);
  margin-bottom: 0;
}

.top input {
  width: 100%;
  margin-bottom: 3.6%;
  padding: 2% 3%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.top span {
  width: 100%;
  text-align: center;
  background: #b18f40;
  padding: 2.5% 10%;
  font-size: 1.4em;
  color: #fff;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 4px;
  display: inline-block;
  margin-top: 4%;
}

.top span:hover {
  background: #c5a353;
}

.top p {
  margin-top: 2%;
  text-align: right;
  cursor: pointer;
}

.bottom p {
  margin-bottom: 1%;
}

.bottom img {
  cursor: pointer;
}

.bottom img+img {
  margin-left: 3%;
}

.register a:hover {
  color: #b18f40;
}

.tips {
  color: rgb(172, 20, 20);
}


/* 1024 */
@media only screen and (max-width: 1024px) {
  .login {
    width: 40%;
    left: 30%;
  }

  .top {
    margin-right: 0;
  }

  .top p {
    font-size: 1.2em;
    margin-top: 3%;
  }
}

/* 768 */
@media only screen and (max-width: 768px) {
  .login {
    width: 50%;
    left: 25%;
    top: 12%;
  }
}

/* 414 */
@media only screen and (max-width: 414px) {
  .login {
    width: 80%;
    left: 10%;
    top: 7%;
  }

  .top {
    margin-bottom:10%;
  }
}
</style>
