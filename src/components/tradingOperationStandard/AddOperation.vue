<script setup lang="ts">
import OperationsService from "@/services/OperationsService";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const standardOrNewsTrading = ref("");
const router = useRouter();
const targetOrStopRadio = ref("");
const operationData = ref("");
const operationTime = ref("");
const dynamicRating = ref("");
const targetPonits = ref<number>();
const stopPonits = ref<number>();
const riskReturn = ref<number>(0);
const alertSaveSucces = ref(false);
const alertEmptyField = ref(false);
const comments = ref("");
const image = ref<unknown>("");

// const selectedNews = ref([]);
// const newsList = ref([
//   "Decisioni tassi d’interesse della FED",
//   "Vendita al dettaglio dei beni essenziali",
//   "Sussidi di disoccupazione",
//   "Scorte di Petrolio Greggio",
//   "PIL",
//   "Principali ordinativi di beni durevoli",
//   "Vendite di nuove abitazioni",
//   "Vendite abitazioni esistenti",
//   "Indice prezzi spese personali principali",
//   "Permessi di costruzione",
//   "Proiezioni economiche FOMC",
//   "Decisioni FOMC",
//   "Rapporto sulla fiducia dei consumatori",
//   "ISM manifatturiero",
//   "ISM NON manifatturiero",
//   "Variazione occupazione NON agricola",
//   "Previsioni EIA sull’energia",
//   "Indice prezzi di produzione della FED di Filadelfia",
//   "No farm payroll",
//   "IPP",
//   "IPC"
// ]);

onMounted(() => {
  // const inputElement = document.getElementById('formFile') as HTMLInputElement;
  // inputElement.value = '';
  // emptyField();
});

function saveOperation() {
  checkFieldEmpty();

  if (alertEmptyField.value === false) {
    emptyField();
  }
}

function getRiskReturn() {
  if (targetPonits.value && stopPonits.value) {
    riskReturn.value = targetPonits.value / stopPonits.value;
  }
  return riskReturn.value.toFixed(1);
}

async function checkFieldEmpty() {
  if (
    targetOrStopRadio.value == "" ||
    operationData.value == "" ||
    operationTime.value == "" ||
    dynamicRating.value == "" ||
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
      riskReturn:
        parseFloat(getRiskReturn()) === null ? 0 : parseFloat(getRiskReturn()),
      image: image.value,
    };

    await OperationsService.addOperation(saveData);
    console.log(saveData);
  }
}

function emptyField() {
  targetOrStopRadio.value = "";
  operationData.value = "";
  operationTime.value = "";
  dynamicRating.value = "";
  targetPonits.value = undefined;
  stopPonits.value = undefined;
  comments.value = "";

  const inputElement = document.getElementById("formFile") as HTMLInputElement;
  inputElement.value = "";
}

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

function goToAddOperationNews() {
  if (standardOrNewsTrading.value == "News") {
    router.push({
      path: "/operation/add/news",
    });
  }
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
      <h3
        v-if="standardOrNewsTrading == 'Standard'"
        class="fw-bold card-title card-title-center"
      >
        Inserisci Operazione (STANDARD)
      </h3>
      <h3
        v-else-if="standardOrNewsTrading == 'News'"
        class="fw-bold card-title card-title-center"
      >
        Inserisci Operazione (NEWS)
      </h3>
      <h3 v-else class="fw-bold card-title card-title-center">
        Inserisci Operazione
      </h3>
      <form @submit.prevent="() => {}">
        <div class="row pt-5">
          <div class="col-md-10 d-flex align-self-end justify-content-start">
            <h5 class="fw-bold">Che tipo di operazione si vuole aggiungere?</h5>
          </div>
          <div class="col-md-2 d-flex align-self-end justify-content-start">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="standardOrNewsTrading"
                id="standardTrading"
                v-model="standardOrNewsTrading"
                :value="'Standard'"
              />
              <label class="fw-bold form-check-label" for="standardTrading">
                Standard
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="standardOrNewsTrading"
                id="newsTrading"
                v-model="standardOrNewsTrading"
                :value="'News'"
                @change="goToAddOperationNews"
              />
              <label class="fw-bold form-check-label" for="newsTrading">
                News
              </label>
            </div>
          </div>
        </div>
        <div v-if="standardOrNewsTrading == 'Standard'">
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
                  ref="file"
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
          <div class="row pt-5">
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
        </div>
        <!-- togliere dinamica e aggiungere massimo target raggiunto e lista news -->
        <!-- <div v-else-if="standardOrNewsTrading == 'News'">
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
            <div class="col-md-4">
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
            <div class="col-md-4">
              <label for="targetPoints" class="fw-bold form-label"
                >Massimo target raggiunto</label
              >
              <input
                type="number"
                class="form-control"
                id="targetPoints"
                placeholder="Inserisci il massimo target raggiunto"
                v-model="targetPonits"
                min="0"
              />
            </div>
            <div class="col-md-4">
              <label
                for="news"
                class="fw-bold form-label"
                aria-label="Default select example"
                >News</label
              >
              <select
                class="form-select"
                id="news"
                v-model="selectedNews"
                multiple
              >
                <option v-for="news in newsList" :key="news">{{ news }}</option>
              </select>
              <p v-if="selectedNews.length > 0" class="fw-light">
                {{ "News selezionate: " + selectedNews }}
              </p>
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
          <div class="row pt-5">
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
        </div> -->
      </form>
    </div>
  </div>
</template>

<style scoped>
.card-title-center {
  text-align: center;
}
.asd {
  margin-top: 125px !important;
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}
</style>
