<template>
  <div class="box">
    <div class="bg">
      <img src="@/assets/login_bg.jpg" alt="">
      <div class="login">
        <div class="top">

          <form @submit.prevent="createUser()">
          <div class="username">
            <label>Username</label> 
            <input type="text" v-model.trim="username" @keyup.enter="createUser">
            <span v-if="usernameMsg" class="tips2">{{usernameMsg}}</span>
          </div>
          <div>
            <label for="">Password</label>
            <input type="password" v-model="password" @keyup.enter="createUser">
            <span v-if="passwordMsg" class="tips2">{{passwordMsg}}</span>
          </div>
          <div>
            <label for="">Password Again</label>
            <input type="password" v-model="againPassword" @keyup.enter="createUser">
          </div>
          <span class="tips">{{msg}}</span><br v-if="msg">
          <span v-on:click="createUser" class="btn_register">register</span>
        </form>

        <p class="register"><router-link to="/login">Already have an account</router-link></p>
        </div>

        <div class="bottom">
          <p>Or login with</p>
          <img src="@/assets/googleplus32.png" alt="google">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var data = require('@/frontend-db');

export default {
  data() {
    return{
      username: '',
      password: '',
      againPassword: '',
      msg : '',
      usernameMsg: '',
      passwordMsg: ''
    }
  },

  methods: {
    // check user's input in frontend
    verifyInput() {
      let outcome = true

      this.usernameMsg = ''
      this.passwordMsg = ''

      if(this.username.length < 3 || this.username.length > 9) {
        outcome = false
        this.usernameMsg = "username should contain 3 to 9 characters"
      } 
      
      if (this.password.length < 9) {
        outcome = false
        this.passwordMsg = "password should contain at least 9 characters"
      } else if (this.password != this.againPassword) {
        outcome = false
        this.passwordMsg = "please make sure passwords match"
        // Msgs won't be empty because we do not except user to remember all requirements/errors
      } 
      return outcome
    },

    createUser() {
      if(!this.verifyInput()) {
        return
      } 

      const user = {
        username: this.username,
        password: this.password,
        type: 0
      }

      data.createUser(user, (errors, id) => {
        if(errors.length == 0) {
          this.signIn()

        } else {
          switch(errors[0]) {
            case "usernameTaken" :

              this.usernameMsg = "username already been taken"
              break
          }
        }

      })  
    },

    signIn() {
      data.signIn(this.username, this.password, (errors, user) => {

        if(errors.length == 0){
          this.toParent(user)

          if(user.type == 0) {
            this.$router.push("/products/")
          } else {
            this.$router.push("/admin/")
          }

        }else{
          this.msg = errors[0]
        }
      })
    },

    toParent(user) {
        this. $emit('loginStatus', user)
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
  top: 10%;
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
  margin-bottom: 3%;
  padding: 2% 3%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.tips2 {
  display: block;
  color: rgb(167, 30, 30);
  margin-top: -2%;
  margin-bottom: 3%;
}

.btn_register {
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

.btn_register:hover {
  background: #c5a353;
}

.tips {
  color: rgb(184, 23, 23);
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