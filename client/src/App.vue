<template>
  <div class="custom-container">
    <div class="content-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
.custom-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("path-to-your-background-image.jpg") no-repeat center center;
  background-size: cover;
}

.content-wrapper {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  border-radius: 20px;
  width: 80%;
  max-width: 500px;
}

@media (max-width: 480px) {
  .content-wrapper {
    width: 95%;
  }
}
</style>
