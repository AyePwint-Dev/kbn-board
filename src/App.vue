<template> 
  <!-- <SignUp/> -->  
  <nav>
    <RouterLink to="/">BoardHome |</RouterLink>
    <!-- <RouterLink to="/standardboard">Standard Board | </RouterLink> -->
    <RouterLink to="/about"> About |</RouterLink>
    <RouterLink to="/signup">Singup </RouterLink>    
  </nav>
  <main>
    <RouterView />
  </main>  
 
</template>

<script>
// import SignUp from './components/SignUp.vue'
    
export default {
  name: 'App',
  components: {
    // SignUp,   
  }
  
}
</script>

<style>

</style>
