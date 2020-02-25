<template>
  <div>
    <div class="bg_container">
      <img src="@/assets/bg.jpg" alt="travel">
      <div class="header">
        <h1>Have a fika with us</h1>
        <span>we offer more than 20 different items</span>
      </div>
    </div>
    <div class="features">
      <h2>Welcome to Smoober Bakery Shop in Falköping</h2>
      <p>Bakery and patisserie with café operations that started in 2019. We offer both classic and new pastries, 
        sourdough bread, cakes, sandwiches and sandwich cake. Everything baked in our own bakery. Unique to Smoothber 
        Bakery Shop is our "Potato Pastry".</p>
      <ul>
        <li>
          <img src="@/assets/ingredient.svg" alt="natural ingredient">
          <h3>Natural Ingredient</h3>
        </li>

        <li>
          <img src="@/assets/fresh.svg" alt="fresh bakery">
          <h3>New-baked Everyday</h3>
        </li>

        <li>
          <img src="@/assets/healthy.svg" alt="Hygiene control">
          <h3>Hygiene Control</h3>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
export default {
}
</script> 


<style scoped>
.bg_container {
  overflow: hidden;
}

.bg_container img {
  position: relative;
  max-width: 100%;
}

.header {
  width: fit-content;
  position: absolute;
  top: 50%;
  left: 11%;
}

.header h1 {
  color:rgb(20, 20, 20);
  display: inline-block;
  font-weight: 700;
  font-size: 4vw;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: -2%;
}

.header span {
  color: rgb(90, 90, 90);
  display: block;
  font-family: 'Parisienne', cursive;
  font-size: 1.8vw;
}

/*=============features */
.features {
  width: 80%;
  margin: 0 auto;
  margin-top: 4%;
  padding: 0 14%;
  text-align: center;
  margin-bottom: 2%;
}

h2 {
  color: #af9048;
}

.features ul {
  overflow: hidden;
  list-style: none;
  margin-top: 5%;
  padding-left: 0;
}

.features ul li {
  width:32%;
  float: left;
  padding: 0 6%;
  text-align: center;
  box-sizing: border-box;
}

.features ul li+li {
  border-left: 1px dashed #dddddd;
  margin-left: 4px;
}

.features ul li img {
  width: 100%;
  margin-bottom: 5%;
}

.features ul li h3 {
  font-size: 1.1vw;
}

/* 1440 */
@media only screen and (max-width: 1400px) {
  .header {
    top: 40%;
  }
}

/* 1024 */
@media only screen and (max-width: 1024px) {
  .header {
    top: 32%;
  }

  .features {
    width: 100%;
  }
}

/* 768 */
@media only screen and (max-width: 768px) {
  .header {
    top: 20%;
  }

  h2 {
    font-size: 3.4vw;
  }

  .features {
    padding: 0 8%;
  }
}

/* 414 */
@media only screen and (max-width: 414px) {
  .header {
    top: 23%;
    left: 7%;
  }

  .header h1 {
    font-size: 5.4vw;
  }

  .header span {
    font-size: 3.2vw;
  }

  h2 {
    font-size: 5.4vw;
  }

  .features p {
    font-size: 4vw;
  }

  .features ul {
    margin-top: 8%;
    overflow: auto;
  }

  .features ul li {
    float: none;
    width: 100%;
    padding: 0 24%;
  }

  .features ul li+li {
    border: 0;
    margin-left: 0;
    margin-top: 6%;
  }

  .features ul li h3 {
    font-size: 4vw;
  }
}
</style>