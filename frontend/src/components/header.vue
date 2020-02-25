<template>
    <div class="header">
        <div class="logo">
            <img src="@/assets/logo.png">
        </div>
        <nav>
        <ul class="nav_ul">
            <li class="bag">
            <router-link to="/bag">
                <img src="@/assets/bag.png" alt="bag">
                <p v-if="bag.length">{{bag.length}}</p>
            </router-link>
            </li>
            
            <li v-if="!user.isSignedIn" class="login">
              <router-link to="/login">Log in</router-link>
            </li>

            <template v-else class="login">
              <li class="afterLogin"><router-link to="/logout">Log out</router-link></li>
              <li class="afterLogin"><router-link to="/user">Hi, {{user.username}}</router-link></li>
            </template>

            <li><router-link to="/service">Service</router-link></li>    
            <li><router-link to="/products">Products</router-link></li>
            <li><router-link to="/">Home</router-link></li>
        </ul>
        </nav>        
    </div>   
</template>


<script>
  export default {
    name: 'app-header',
    props: ['user', 'bag']
  }
</script>


<style scoped>
a {
  text-decoration: none;
  color: rgb(39, 39, 39);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.header {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  margin-bottom: 0.5%;
}

.logo {
  width: 12%;
  float: left;
  margin-top: 1.3%;
}

.logo img {
  width: 100%;
}

/*=============menu*/
nav {
  width: 80%;
  font-size: 1.3vw;
  display: block;
  float: right;
  margin-top: 1%;
}

.nav_ul {
  height: 5.4vh;
  list-style: none;
  padding: 0;
  overflow: hidden;
}

.nav_ul li {
  float: right;
  margin: 0 2%;
  padding: 2vh 0;
  font-weight: 500;
}

.nav_ul li a:hover {
  color: #af9048;
  text-decoration: none;
}

.login {
  margin-left: 4% !important;
  font-weight: 300 !important;
  color: rgb(110, 110, 110);
  margin-right: 0 !important;
}

.afterLogin {
  font-weight: 300 !important;
  margin-right: 0 !important;
}

.bag {
  margin-right: 0!important;
  cursor: pointer;
  position: relative;
}

.bag img {
  width: 100%;
}

.bag p {
  font-size: .6em;
  color: #fff;
  position: absolute;
  top: 18%;
  left: 23%;
  background: rgb(206, 5, 5);
  margin: 0;
  padding: 0 21%;
  border-radius: 14px;
}

/* 1400 */
@media only screen and (max-width: 1400px) {
  .header {
    margin-bottom: 1%;
  }

  .logo {
    width: 14%;
  }

  nav {
    font-size: 1.8vw;
  }

  .nav_ul {
    margin-bottom: 0;
  }

  .nav_ul li {
    padding: 1.2% 0;
  }

  .logo {
    width: 13%;
  }

  .bag p {
    top: 10%;
  }
  
}

/* 1024 */
@media only screen and (max-width: 1024px) {
  .header {
    margin-bottom: 0;
  }
}

/* 768 */
@media only screen and (max-width: 768px) {
  .logo {
    width: 20%;
  }

  nav {
    font-size: 2.6vw
  }

  .nav_ul {
    padding-top: 1%;
  }

  .bag img {
    width: 80%
  }
}

/* 414 */
@media only screen and (max-width: 414px) {
  .header {
    width: 100%;
  }

  .logo {
    width: 100%;
    text-align: center;
    float: none;
    margin-top: 0;
    padding: 3% 0;
  }

  .logo img {
    width: 34%;
  }

  nav {
    width: 100%;
    font-size: 4vw;
    background: #eee;
  }

  .nav_ul li {
    width: 16%;
    text-align: center;
  }

  .bag{
    text-align: left !important;
  }

  .bag p {
    padding: 0 10%;
    left: 7%;
    top: 0;
  }

  .bag img {
    width: 40%;
  }
}

</style>