<template>
    <div>
        <footer>
            <p>© Smoober Falkoping AB<br>0771-33 33 10</p>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'app-footer'
}
</script>

<style scoped>
/*=============footer*/
footer {
  color: rgb(163, 163, 163);
  margin-top: 2.6%;
  overflow: hidden;
  text-align: center;
  margin-bottom: 2%;
  border-top: 1px solid #eee;
  padding: 2%;
}

footer span {
  width: 50%;
  text-align: right;
  float: left;
}

/* 414 */
@media only screen and (max-width: 414px) {
  footer {
    margin-top: 5%;
    padding: 5% 0;
  }

  footer span {
    width: 40%;
  }
}
</style>