<script setup lang="ts">
import OperationsService from "@/services/OperationsService";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const targetOrStopRadio = ref("");
const operationData = ref("");
const dynamicRating = ref("");
const targetPonits = ref<number>();
const stopPonits = ref<number>();
const alertSaveSucces = ref(false);
const alertEmptyField = ref(false);
const comments = ref("");

onMounted(() => {
  emptyField();
});

function saveOperation() {
  checkFieldEmpty();

  if (alertEmptyField.value === false) {
    emptyField();
  }
}

function checkFieldEmpty() {
  if (
    targetOrStopRadio.value == "1" &&
    (operationData.value == "" ||
      dynamicRating.value == "" ||
      targetPonits.value == null ||
      comments.value == "")
  ) {
    alertEmptyField.value = true;
    alertSaveSucces.value = false;
  } else if (
    targetOrStopRadio.value == "0" &&
    (operationData.value == "" ||
      dynamicRating.value == "" ||
      stopPonits.value == null ||
      comments.value == "")
  ) {
    alertEmptyField.value = true;
    alertSaveSucces.value = false;
  } else if (
    targetOrStopRadio.value == "" &&
    (operationData.value == "" ||
      dynamicRating.value == "" ||
      targetPonits.value == null ||
      stopPonits.value == null ||
      comments.value == "")
  ) {
    alertEmptyField.value = true;
    alertSaveSucces.value = false;
  } else {
    alertSaveSucces.value = true;
    alertEmptyField.value = false;
    //WARNING: se targetPonits o stopPonits tornano stringa vuota metto null
    // if(targetOrStopRadio.value === "1") {
    //   targetOrStopRadio.value = "Target"
    // } else {

    // }
    const saveData = {
      data: operationData.value,
      result: targetOrStopRadio.value === "1" ? "Target" : "Stop",
      dynamic:
        dynamicRating.value === "0"
          ? "Rating 4"
          : dynamicRating.value === "1"
          ? "Rating 5"
          : "Retest livello",
      targetPoints: targetPonits.value,
      stopPoints: stopPonits.value === undefined ? 0 : stopPonits.value,
      comments: comments.value,
    };

    OperationsService.addOperation(saveData);
    console.log(saveData);
  }
}

function emptyField() {
  targetOrStopRadio.value = "";
  operationData.value = "";
  dynamicRating.value = "";
  targetPonits.value = undefined;
  stopPonits.value = undefined;
  comments.value = "";
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
        <h3 class="fw-bold card-title card-title-center">
          Inserisci Operazione
        </h3>
        <form @submit.prevent="() => {}">
          <div class="row margin-row">
            <div class="col-md-6">
              <label for="inputData" class="fw-bold form-label">Data</label>
              <input
                type="date"
                class="form-control"
                id="inputData"
                v-model="operationData"
              />
            </div>
          </div>
          <div class="row margin-row">
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
                  Dinamica 1 (Rating 4)
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
                  Dinamica 2 (Rating 5)
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
                  Dinamica 3 (Retest livello)
                </label>
              </div>
            </div>
          </div>
          <div class="row margin-row">
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
                :disabled="targetOrStopRadio === '0' ? true : false"
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
                :disabled="targetOrStopRadio === '1' ? true : false"
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
                <input class="form-control" type="file" id="formFile" />
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
              <div>Operazione salvata con successo!</div>
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
          <div class="row pt-3">
            <div class="mt-0 pt-3 d-flex justify-content-center">
              <button
                type="button"
                class="fw-bold ms-3 btn btn-outline-success"
                @click="saveOperation()"
              >
                Salva operazione
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
