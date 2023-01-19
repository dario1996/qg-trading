<script setup lang="ts">
import OperationsService from "@/services/OperationsService";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const targetOrStopRadio = ref("");
const operationData = ref("");
const operationTime = ref("");
const dynamicRating = ref("");
const targetPonits = ref<number>();
const stopPonits = ref<number>();
const alertSaveSucces = ref(false);
const alertEmptyField = ref(false);
const operationToEdit = ref<OperationToEdit>();
const comments = ref("");
const image = ref<unknown>("");

interface OperationToEdit {
  data: string;
  time: string;
  result: string;
  dynamic: string;
  stopPoints: number;
  targetPoints: number;
  comments: string;
  id: number;
  image: string;
}

onMounted(() => {
  getOperation();
});

async function getOperation() {
  let opId: string | number = route.params.id as string;
  await OperationsService.getOperation(parseInt(opId)).then((response) => {
    if (response.data) {
      operationToEdit.value = response.data;
    }

    operationData.value =
      operationToEdit.value?.data === undefined
        ? ""
        : operationToEdit.value.data;
    operationTime.value =
      operationToEdit.value?.time === undefined
        ? ""
        : operationToEdit.value.time;
    targetPonits.value = operationToEdit.value?.targetPoints;
    comments.value =
      operationToEdit.value?.comments === undefined
        ? ""
        : operationToEdit.value.comments;
    stopPonits.value = operationToEdit.value?.stopPoints;
    targetOrStopRadio.value =
      operationToEdit.value?.result === "Target" ? "1" : "0";
    dynamicRating.value =
      operationToEdit.value?.dynamic === "Rating 4"
        ? "0"
        : operationToEdit.value?.dynamic === "Rating 5"
        ? "1"
        : "2";
    image.value = operationToEdit.value?.image;
  });
}

function saveOperation() {
  checkFieldEmpty();

  // if (alertEmptyField.value === false) {
  //   emptyField();
  // }
}

async function checkFieldEmpty() {
  if (
    targetOrStopRadio.value == "" ||
    operationData.value == "" ||
    operationTime.value == "" ||
    dynamicRating.value == "" ||
    operationTime.value == "" ||
    targetPonits.value == null ||
    stopPonits.value == null
  ) {
    alertEmptyField.value = true;
    alertSaveSucces.value = false;
  } else {
    alertSaveSucces.value = true;
    alertEmptyField.value = false;

    const saveData = {
      data: operationData.value,
      time: operationTime.value,
      result: targetOrStopRadio.value === "1" ? "Target" : "Stop",
      dynamic:
        dynamicRating.value === "0"
          ? "Rating 4"
          : dynamicRating.value === "1"
          ? "Rating 5"
          : "Rating maggiore di 5",
      targetPoints: targetPonits.value,
      stopPoints: stopPonits.value,
      comments: comments.value,
      image: image.value,
    };
    let opId: string | number = route.params.id as string;
    await OperationsService.editOperation(saveData, parseInt(opId));
    console.log(saveData);
  }
  //getOperation();
}

// function emptyField() {
//   targetOrStopRadio.value = "";
//   operationData.value = "";
//   dynamicRating.value = "";
//   targetPonits.value = undefined;
//   stopPonits.value = undefined;
//   comments.value = "";
// }

async function onFileChange(e: any) {
  console.log(e.target.files);
  console.log(await getBase64(e.target.files[0]));
  image.value = await getBase64(e.target.files[0]);
}

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
}

function goToSummary() {
  router.push({
    path: "/operations",
  });
}
</script>

<template>
  <div class="card asd">
    <div class="card-body">
      <h3 class="fw-bold card-title card-title-center">Modifica Operazione</h3>
      <form @submit.prevent="() => {}">
        <div class="row pt-5">
          <div class="col-md-6">
            <label for="inputData" class="fw-bold form-label">Data</label>
            <input
              type="date"
              class="form-control"
              id="inputData"
              v-model="operationData"
            />
          </div>
          <div class="col-md-6">
            <label for="inputTime" class="fw-bold form-label">Orario</label>
            <input
              type="time"
              class="form-control"
              id="inputTime"
              v-model="operationTime"
            />
          </div>
        </div>
        <div class="row pt-5">
          <div class="col-md-6">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="stopOrTargetRadio"
                id="targetRadio"
                v-model="targetOrStopRadio"
                :value="'1'"
              />
              <label class="fw-bold form-check-label" for="targetRadio">
                Target
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="stopOrTargetRadio"
                id="stopRadio"
                :value="'0'"
                v-model="targetOrStopRadio"
              />
              <label class="fw-bold form-check-label" for="stopRadio">
                Stop
              </label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="dynamicOneRadio"
                :value="'0'"
                v-model="dynamicRating"
              />
              <label class="fw-bold form-check-label" for="dynamicOneRadio">
                Rating 4
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="dynamicTwoRadio"
                :value="'1'"
                v-model="dynamicRating"
              />
              <label class="fw-bold form-check-label" for="dynamicTwoRadio">
                Rating 5
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="dynamicThreeRadio"
                :value="'2'"
                v-model="dynamicRating"
              />
              <label class="fw-bold form-check-label" for="dynamicThreeRadio">
                Rating maggiore di 5
              </label>
            </div>
          </div>
        </div>
        <div class="row pt-5">
          <div class="col-md-6">
            <label for="targetPoints" class="fw-bold form-label"
              >Punti di target</label
            >
            <input
              type="number"
              class="form-control"
              id="targetPoints"
              placeholder="Inserisci i punti di target"
              v-model="targetPonits"
              min="0"
            />
          </div>
          <div class="col-md-6">
            <label for="stopPoints" class="fw-bold form-label"
              >Punti di stop</label
            >
            <input
              type="number"
              class="form-control"
              id="stopPoints"
              placeholder="Inserisci i punti di stop"
              v-model="stopPonits"
              min="0"
            />
          </div>
        </div>
        <div class="row pt-5">
          <div class="col-md-6">
            <div class="">
              <label class="fw-bold form-label" for="floatingTextarea"
                >Commenti</label
              >
              <textarea
                class="form-control"
                id="floatingTextarea"
                v-model="comments"
              ></textarea>
            </div>
          </div>
          <div class="col-md-6">
            <div class="">
              <label for="formFile" class="fw-bold form-label"
                >Allega File</label
              >
              <input
                class="form-control"
                type="file"
                id="formFile"
                @change="onFileChange"
              />
            </div>
          </div>
        </div>
        <div v-if="alertSaveSucces || alertEmptyField" class="row pt-5 mx-1">
          <div
            v-if="alertSaveSucces"
            class="alert alert-success d-flex align-items-center"
            role="alert"
          >
            <svg
              class="bi flex-shrink-0 me-2"
              width="24"
              height="24"
              role="img"
              aria-label="Success:"
            >
              <use xlink:href="#check-circle-fill" />
            </svg>
            <div>Operazione modificata con successo!</div>
          </div>
          <div
            v-if="alertEmptyField"
            class="alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <svg
              class="bi flex-shrink-0 me-2"
              width="24"
              height="24"
              role="img"
              aria-label="Danger:"
            >
              <use xlink:href="#exclamation-triangle-fill" />
            </svg>
            <div>Tutti i campi sono obbligatori!</div>
          </div>
        </div>
        <div class="row pt-5">
          <div class="mt-0 pt-3 d-flex justify-content-center">
            <button
              type="button"
              class="fw-bold ms-3 btn btn-outline-success"
              @click="saveOperation()"
            >
              Modifica operazione
            </button>
            <button
              type="button"
              class="fw-bold ms-3 btn btn-outline-primary"
              @click="goToSummary"
            >
              Vai al sommario
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.card-title-center {
  text-align: center;
}
.margin-row {
  margin-top: 20px;
}
.asd {
  margin-top: 125px !important;
  /* margin-bottom: 75px !important; */
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}
</style>
