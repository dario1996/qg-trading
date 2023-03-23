<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
function goToDashboard() {
  router.push({
    path: "/dashboard",
  });
}
function goToRegister() {
  router.push({
    path: "/register",
  });
}
</script>
<template>
  <section class="v-h 100 asd">
    <div class="container-fluid h-custom h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-md-9 col-lg-6 col-xl-5">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            class="img-fluid"
            alt="Sample image"
          />
        </div>
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
          <form>
            <div class="d-flex align-items-center mb-3 pb-1">
              <i
                class="bi bi-journal-text bi-2x me-3 text-primary"
                style="font-size: 50px"
              ></i>
              <span class="h1 fw-bold mb-0">Trading Diary - Login</span>
            </div>

            <h5 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px">
              Sign into your account
            </h5>
            <!-- Email input -->
            <div class="form-outline mb-4">
              <input
                type="email"
                id="form3Example3"
                class="form-control form-control-lg"
                placeholder="Enter a valid email address"
              />
              <!-- <label class="form-label" for="form3Example3"
                >Email address</label
              > -->
            </div>

            <!-- Password input -->
            <div class="form-outline mb-3">
              <input
                type="password"
                id="form3Example4"
                class="form-control form-control-lg"
                placeholder="Enter password"
              />
              <!-- <label class="form-label" for="form3Example4">Password</label> -->
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <!-- Checkbox -->
              <div class="form-check mb-0">
                <input
                  class="form-check-input me-2"
                  type="checkbox"
                  value=""
                  id="form2Example3"
                />
                <label class="form-check-label" for="form2Example3">
                  Remember me
                </label>
              </div>
              <a href="#!" class="text-body">Forgot password?</a>
            </div>

            <div class="text-center text-lg mt-4 pt-2">
              <button
                type="button"
                class="btn btn-primary btn-lg"
                style="padding-left: 2.5rem; padding-right: 2.5rem"
                @click="goToDashboard"
              >
                Login
              </button>
              <p class="small fw-bold mt-4 pt-1 mb-0">
                Don't have an account?
                <a href="" class="link-danger" @click="goToRegister">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.asd {
  margin-top: 120px !important;
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}
</style>
