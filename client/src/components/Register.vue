<template>
  <div class="row justify-content-center text-white">
    <div class="col-md-10">
      <h2 class="mb-4">Register</h2>
      <form @submit.prevent="handleRegister">
        <div v-for="field in fields" :key="field.id" class="mb-3">
          <input
            v-model="formData[field.id]"
            :type="field.type"
            :id="field.id"
            :placeholder="field.placeholder"
            class="form-control"
            required
          />
          <div v-if="errors[field.id]" class="text-danger">
            {{ errors[field.id] }}
          </div>
        </div>
        <button type="submit" class="btn btn-danger btn-lg w-100 mt-3">
          Register
        </button>
      </form>
      <p class="mt-3 text-secondary">
        Already have an account?
        <router-link to="/" class="text-white">Sign in now.</router-link>
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

const registerSchema = z
  .object({
    email: z.string().email("Invalid email"),
    phone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
    password: z
      .string()
      .min(4, "Your password must contain between 4 and 60 characters.")
      .max(60, "Your password must contain between 4 and 60 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export default {
  data() {
    return {
      fields: [
        { id: "email", type: "email", placeholder: "Email" },
        { id: "phone", type: "tel", placeholder: "Phone number" },
        { id: "password", type: "password", placeholder: "Password" },
        {
          id: "confirmPassword",
          type: "password",
          placeholder: "Confirm Password",
        },
      ],
      formData: {
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      },
      errors: {},
    };
  },
  methods: {
    async handleRegister() {
      try {
        this.errors = {};

        const validatedData = registerSchema.parse(this.formData);

        const { confirmPassword, ...dataToSend } = validatedData;

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/register`,
          dataToSend
        );

        await Swal.fire({
          title: "Success!",
          text: "Registration successful. You can now log in.",
          icon: "success",
          confirmButtonText: "OK",
        });

        this.$router.push("/");
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            if (err.path) {
              this.errors[err.path[0]] = err.message;
            }
          });
        } else {
          console.error("Registration failed:", error);
          Swal.fire({
            title: "Error!",
            text: "Email or phone number already in use.",
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
  margin-bottom: 16px;
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

.btn-danger:hover,
.btn-danger:focus {
  background-color: #f40612;
}

.text-danger {
  font-size: 14px;
  margin-top: -12px;
  margin-bottom: 10px;
}
</style>
