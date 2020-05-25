<template>
    <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>

@import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600&display=swap');

body, html {
  margin: 0;
  padding: 0;
  font-family: 'Montserrat';
  color: rgb(180, 180, 180);
  height: 100%;
  background-color: #1f1d1d;
  overflow-x: hidden;
}
a {
 color: inherit;
 text-decoration: none;
 font-weight: bold;
}

button {
    background-color: lavender;
    border: none;
}

.green {
  color:rgb(6, 165, 27);
}

button.green {
    background-color: rgb(6, 165, 27);
    color: lavender;
}

button.skip {
    background: none;
    color: lavender;
    border: rgb(6, 165, 27)  1px solid;
}
</style>
