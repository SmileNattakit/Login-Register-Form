<template>
  <div class="user-profile">
    <div class="content-wrapper">
      <h2 class="mb-4">Welcome, User!</h2>
      <div class="profile-info">
        <h5>User Information</h5>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Phone:</strong> {{ user.phone }}</p>
      </div>
      <button @click="logout" class="btn btn-logout">Logout</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: "",
        phone: "",
      },
    };
  },
  created() {
    const userData = localStorage.getItem("userData");
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.$router.push("/");
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("userData");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.user-profile {
  display: flex;
  justify-content: center;
  align-items: center;

  color: #fff;
}

h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 28px;
}

.profile-info {
  background-color: #333;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}

.profile-info h5 {
  font-size: 18px;
  margin-bottom: 15px;
}

.profile-info p {
  margin-bottom: 10px;
  font-size: 16px;
}

.btn-logout {
  background-color: #e50914;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  margin-top: 24px;
  padding: 16px;
  width: 100%;
}

.btn-logout:hover {
  background-color: #f40612;
}
</style>
