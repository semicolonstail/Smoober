<template>
  <div class="box">
    <div class="left">
      <h2>Opening Hours</h2>
      <div class="weekday" v-for="(openingHour, weekday) in openingHours" :key="weekday">

        <!-- in database, 1 means weekdays, 0 is weekends-->
        <h4 v-if="openingHour.weekday==1">Mon-Fri</h4>
        <h4 v-if="openingHour.weekday==0">Sat-Sun</h4>
        <p>{{openingHour.time}}</p>
      </div>

    </div>

    <div class="right">
      <h2>About Smoober</h2>
      <div class="doc">
        <h3>Who We Are</h3>
        <p>
          The Kimberley City Bakery is a local family-owned and operated bakery specializing in Swiss, French and
          German baked goods and pastries.
        </p>
        <p>
          The "bakery" has been in the same location in Kimberley for over 92 years! We use fine ingredients and
          traditional methods to produce ​exceptional breads, artisanal breads, ciabattas, pan loafs, pastries,
          gluten free (and other dietary needs) and of course....cookies and donuts! We are a Peanut free bakery!
        </p>
      </div>

      <div class="age">
        <h3>Our Vision</h3>
        <p>
          While we continually strive for innovation at The Kimberley City Bakery, we’re still making our creations
          the way our mentors made them, no added preservatives or additives. And they'd be pretty proud of that.
        </p>
      </div>

      <h2 class="op">Order & Pick-up</h2>
      <div class="enjoy">
        <h3>When would be the best time enjoying your food?</h3>
        <p>
          There are several key differences between artisan breads and factory-made alternatives. And a big one—besides
          flavor and texture—is the speed at which the bread will age.
        </p>
        <p>After 2-3 days, the bread will start to harden. Dogu suggests this is a good time to use the bread for toast.</p>
        <p><i>Remember, if you’re buying bread with just 3 ingredients, there aren’t any preservatives.</i></p>
      </div>

      <div class="insurances">
        <h3>Pick-up Service</h3>
        <p>
          Additional insurances can be signed with Trygg Hansa, by Sixt. Minimum age 24 and signed CTI is required to sign the CTI Drive Safe. Rented equipment is not covered by the collision damage reduction/waiver. The Collision Cost
          Reduction shall not apply should the vehicle be stolen with keys. The Collision Cost Reduction does not apply for
          damages that occurred outside Sweden. Should the lessor have approved use in another country, the Collision Cost
          Reduction is extended to the relevant country/countries.
        </p>
      </div>
    </div>
  </div>
</template>


<script>
var data = require('@/frontend-db')

export default {
  data() {
    return {
      openingHours: ''
    }
  },

  created(){
      data.getOpeningHours((errors, openingHours) => {

        if(errors.length == 0){
          this.openingHours = openingHours
        }else{
          console.log(errors)
        }

      })
  }
}
</script>


<style scoped>
.box {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  padding: 2% 0;
  border-top: 1px solid #ddd;
}

.top {
  height: 40vh;
  overflow: hidden;
}

.top img {
  width: 100%;
}

.left {
  width: 23%;
  float: left;
  margin-right: 4%;
}

.left h2 {
  color: #fff;
  font-weight: 400;
  background: #af9048;
  font-size: 1.5em;
  margin-bottom: 5%;
  padding: 2.4% 4%;
  box-sizing: border-box;
  font-weight: 300;
}

.left h4 {
  margin-bottom: 0;
  margin-top: 5%;
}

.left p {
  font-size: 1.2em;
  margin-bottom: 0.5%;
  padding-bottom: 2%;
  border-bottom: 1px dashed #ddd;
}

.phone {
  margin-top: 6%;
  border-bottom: 0 !important;
  margin-bottom: 0 !important;
}

.right {
  width: 71%;
  float: left;
}

.right p {
  margin-bottom: .5%;
}

.right h2 {
  color: #af9048;
  font-size: 1.8em;
  margin-bottom: -1%;
}

.op {
  margin-top: 4%;
}

.right h3 {
  font-size: 1.3em;
  margin-bottom: .5%;
  margin-top: 2%;
}


/* 768 */
@media only screen and (max-width: 768px) {
  .box {
    overflow: auto;
  }

  .left {
    width: 100%;
    float: none;
    border-bottom: 1px dashed #ddd;
    padding-bottom: 2%;
    margin-bottom: 4%;
  }

  .left h2 {
    font-size: 3vw;
    padding: 1% 3%;
    display: inline-block;
    margin-bottom: 0;
  }

  .left h4 {
    margin-top: 2.6%;
  }

  .weekday, .weekend {
    width: 100%;
  }

  .weekday p, .weekend p {
    padding-bottom: 0;
    border: 0;
  }

  .right {
    width: 100%;
    float: none;
  }

}

/* 414 */
@media only screen and (max-width: 414px) {
  .box {
    margin-top: 2%;
    border: 0;
  }
  .left h2 {
    font-size: 5.6vw;
    padding: 2% 4%;
  }

  .weekday h4, .weekend h4 {
    font-size: 5vw;
  }

  .weekday p, .weekend p {
    font-size: 4vw;
  }

  .right h2 {
    font-size: 6vw;
  }

  .right h3 {
    font-size: 4.6vw;
    margin-top: 8%;
  }

  .doc h3 {
    margin-top: 3%;
  }

  .age p {
    margin-bottom: 12%;
  }

  .enjoy h3 {
    margin-top: 3%;
  }

}

</style>
