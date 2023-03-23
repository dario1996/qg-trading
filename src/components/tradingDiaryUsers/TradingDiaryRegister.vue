<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserService from "@/services/UsersService";

const router = useRouter();

const userName = ref("");
const userEmail = ref("");
const userPassword = ref("");
const alertSaveSucces = ref(false);
const alertEmptyField = ref(false);
const errorWebApi = ref(false);
const errorWebApiMessage = ref("");
const isLoading = ref(false);

async function saveOperation() {
  const isEmpty =
    userName.value === "" ||
    userEmail.value === "" ||
    userPassword.value === "" 
  if (isEmpty) {
    alertEmptyField.value = true;
    return;
  }

  const saveData = {
    name: userName.value,
    email: userEmail.value,
    password: userPassword.value,
  };

  isLoading.value = true;
  alertSaveSucces.value = false;
  errorWebApi.value = false;

  try {
    await UserService.addUser(saveData);
    alertSaveSucces.value = true;
    emptyField();
  } catch (error) {
    errorWebApi.value = true;
    errorWebApiMessage.value =
      "Errore Generico: il server non risponde, contattare supporto.";
  } finally {
    isLoading.value = false;
    alertEmptyField.value = false;
  }
}

function emptyField() {
  const fields = [
    userName,
    userEmail,
    userPassword,
  ];
  fields.forEach((field) => {
    field.value = "";
  });
}
// eslint-disable-next-line no-unused-vars
function goToDashboard() {
  router.push({
    path: "/dashboard",
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
                class="bi bi-person-plus-fill bi-2x me-3 text-primary"
                style="font-size: 50px"
              ></i>
              <span class="h1 fw-bold mb-0">Trading Diary - Sign up</span>
            </div>

            <h5 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px">
              Register your account
            </h5>

            <!-- Name input -->
            <div class="form-outline mb-4">
              <input
                type="text"
                id="form3Example4"
                class="form-control form-control-lg"
                placeholder="Your Name"
                v-model="userName"
              />
              <!-- <label class="form-label" for="form3Example4">Password</label> -->
            </div>

            <!-- Email input -->
            <div class="form-outline mb-4">
              <input
                type="email"
                id="form3Example3"
                class="form-control form-control-lg"
                placeholder="Your Email"
                v-model="userEmail"
              />
              <!-- <label class="form-label" for="form3Example3"
                >Email address</label
              > -->
            </div>

            <!-- Password input -->
            <div class="form-outline mb-4">
              <input
                type="password"
                id="form3Example4"
                class="form-control form-control-lg"
                placeholder="Password"
                v-model="userPassword"
              />
              <!-- <label class="form-label" for="form3Example4">Password</label> -->
            </div>

            <div class="text-center text-lg mt-4 pt-2">
              <button
                type="button"
                class="btn btn-primary btn-lg"
                style="padding-left: 2.5rem; padding-right: 2.5rem"
                @click="saveOperation"
              >
                Register
              </button>
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
