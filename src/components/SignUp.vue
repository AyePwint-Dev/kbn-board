<template>
    <h1>SignUp</h1>
    <div class="login-wrapper">
    <div class="login-left">
      <img height="100" src="https://wisk.s3.amazonaws.com/assets/vms/images/wisk-logo-black.png" srcr="https://preview.ibb.co/hUAr57/bar_bg.jpg">
    </div>
    <form class="login-right" @submit.prevent>
      <div class="h2">Login</div>
      <div class="form-group">
        <input type="text" id="username" placeholder="Username" v-model="username">
        <label for="username">Username</label>    
      </div>
      <div class="form-group">
        <input type="password" id="Password" placeholder="Password" v-model="password">
        <label for="Password">Password</label>    
      </div>
      <div class="checkbox-container">
        <input type="checkbox" v-model="rememberMe">
        <div class="text-checkbox">Remember me</div>
      </div> 
      <div class="button-area">
        <button class="btn btn-primary pull-right" @click="login()" >Login</button>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  name: 'SignUp'  
}
</script>
