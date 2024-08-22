<template>
  <div class="row justify-content-center text-white">
    <div class="col-md-10">
      <h2 class="mb-4">Sign In</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <input
            v-model="emailOrPhone"
            type="text"
            class="form-control"
            id="emailOrPhone"
            required
            placeholder="Email or Phone number"
          />
          <div v-if="errors.emailOrPhone" class="text-danger">
            {{ errors.emailOrPhone }}
          </div>
        </div>
        <div class="mb-3">
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="password"
            placeholder="Password"
            required
          />
          <div v-if="errors.password" class="text-danger">
            {{ errors.password }}
          </div>
        </div>
        <button type="submit" class="btn btn-danger btn-lg w-100 mt-3">
          Sign In
        </button>
      </form>
      <p class="mt-3 text-secondary">
        New to Netflix?
        <router-link to="/register" class="text-white"
          >Sign up now.</router-link
        >
      </p>
      <div class="text-secondary">
        <p>This page is protected by Google reCAPTCHA</p>
        <p>
          to ensure you're not a bot.
          <router-link to="#" class="text-white">Learn more.</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { z } from "zod";
import Swal from "sweetalert2";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^[0-9]{10}$/;

const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Email or phone is required")
    .refine((value) => emailRegex.test(value) || phoneRegex.test(value), {
      message: "Invalid email or phone format",
    }),
  password: z
    .string()
    .min(4, "Your password must contain between 4 and 60 characters.")
    .max(60, "Your password must contain between 4 and 60 characters."),
});

export default {
  data() {
    return {
      emailOrPhone: "",
      password: "",
      errors: {
        emailOrPhone: "",
        password: "",
      },
    };
  },
  methods: {
    async handleLogin() {
      try {
        // Reset errors
        this.errors = {
          emailOrPhone: "",
          password: "",
        };

        const validatedData = loginSchema.parse({
          emailOrPhone: this.emailOrPhone,
          password: this.password,
        });

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/login`,
          validatedData
        );
        console.log(response.data);

        // Store user data in localStorage
        localStorage.setItem("userData", JSON.stringify(response.data.user));

        // Show success message
        await Swal.fire({
          title: "Success!",
          text: "You have successfully logged in.",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Redirect to user page
        this.$router.push("/user");
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            if (err.path) {
              this.errors[err.path[0]] = err.message;
            }
          });
        } else {
          console.error("Login failed:", error);
          // Show error message using SweetAlert2
          Swal.fire({
            title: "Login failed.",
            text: "Invalid email, phone, or password.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    },
  },
};
</script>
<style scoped>
.form-control {
  background-color: #333;
  border: none;
  border-radius: 4px;
  color: #fff;
  height: 50px;
  line-height: 50px;
  padding: 16px 20px;
}

.form-control:focus {
  background-color: #454545;
  box-shadow: none;
  color: #fff;
}

.form-control::placeholder {
  color: #8c8c8c;
}
.btn-danger {
  background-color: #e50914;
  border: none;
}
</style>
