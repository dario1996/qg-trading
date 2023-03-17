<script setup lang="ts">
import OperationsNewsService from "@/services/OperationsNewsService";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const targetOrStopRadioNews = ref("");
const operationDataNews = ref("");
const operationTimeNews = ref("");
const maxTargetReached = ref<number>();
const selectedNews = ref<string[]>([]);
const targetPonitsNews = ref<number>();
const stopPonitsNews = ref<number>();
const commentsNews = ref("");
const imageNews = ref<unknown>("");
const riskReturn = ref<number>(0);
const alertSaveSucces = ref(false);
const alertEmptyField = ref(false);
const newsList = ref([
  "Decisioni tassi d’interesse della FED",
  "Vendita al dettaglio dei beni essenziali",
  "Sussidi di disoccupazione",
  "Scorte di Petrolio Greggio",
  "PIL",
  "Principali ordinativi di beni durevoli",
  "Vendite di nuove abitazioni",
  "Vendite abitazioni esistenti",
  "Indice prezzi spese personali principali",
  "Permessi di costruzione",
  "Proiezioni economiche FOMC",
  "Decisioni FOMC",
  "Rapporto sulla fiducia dei consumatori",
  "ISM manifatturiero",
  "ISM NON manifatturiero",
  "Variazione occupazione NON agricola",
  "Previsioni EIA sull’energia",
  "Indice prezzi di produzione della FED di Filadelfia",
  "No farm payroll",
  "IPP",
  "IPC",
]);

onMounted(() => {});

function emptyField() {
  targetOrStopRadioNews.value = "";
  operationDataNews.value = "";
  operationTimeNews.value = "";
  targetPonitsNews.value = undefined;
  stopPonitsNews.value = undefined;
  maxTargetReached.value = undefined;
  commentsNews.value = "";
  selectedNews.value = [];

  const inputElement = document.getElementById("formFile") as HTMLInputElement;
  inputElement.value = "";
}

function saveOperation() {
  checkFieldEmpty();

  if (alertEmptyField.value === false) {
    emptyField();
  }
}

function getRiskReturn() {
  if (targetPonitsNews.value && stopPonitsNews.value) {
    riskReturn.value = targetPonitsNews.value / stopPonitsNews.value;
  }
  return riskReturn.value.toFixed(1);
}

async function checkFieldEmpty() {
  if (
    targetOrStopRadioNews.value == "" ||
    operationDataNews.value == "" ||
    operationTimeNews.value == "" ||
    maxTargetReached.value == null ||
    selectedNews.value.length == null ||
    targetPonitsNews.value == null ||
    stopPonitsNews.value == null
  ) {
    alertEmptyField.value = true;
    alertSaveSucces.value = false;
  } else {
    alertSaveSucces.value = true;
    alertEmptyField.value = false;

    const saveData = {
      data: operationDataNews.value,
      time: operationTimeNews.value,
      result: targetOrStopRadioNews.value === "1" ? "Target" : "Stop",
      maxTargetReached: maxTargetReached.value,
      news: selectedNews.value,
      targetPoints: targetPonitsNews.value,
      stopPoints: stopPonitsNews.value,
      comments: commentsNews.value,
      riskReturn:
        parseFloat(getRiskReturn()) === null ? 0 : parseFloat(getRiskReturn()),
      image: imageNews.value,
    };

    await OperationsNewsService.addOperation(saveData);
    console.log(saveData);
  }
}

async function onFileChange(e: any) {
  console.log(e.target.files);
  console.log(await getBase64(e.target.files[0]));
  imageNews.value = await getBase64(e.target.files[0]);
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
    path: "/operations/news",
  });
}

function goToAddOperation() {
  router.push({
    path: "/operation/add",
  });
}
</script>
<template>
  <div class="card asd">
    <div class="card-body">
      <h3 class="fw-bold card-title card-title-center">
        Inserisci Operazione (NEWS)
      </h3>

      <form @submit.prevent="() => {}">
        <div>
          <div class="row pt-5">
            <div class="col-md-6">
              <label for="inputData" class="fw-bold form-label">Data</label>
              <input
                type="date"
                class="form-control"
                id="inputData"
                v-model="operationDataNews"
              />
            </div>
            <div class="col-md-6">
              <label for="inputTime" class="fw-bold form-label">Orario</label>
              <input
                type="time"
                class="form-control"
                id="inputTime"
                v-model="operationTimeNews"
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
                  v-model="targetOrStopRadioNews"
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
                  v-model="targetOrStopRadioNews"
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
                v-model="maxTargetReached"
                min="0"
              />
            </div>
            <div class="col-md-4">
              <div class="form-group news-select">
                <label class="fw-bold pb-2" for="news-select">News:</label>
                <div
                  class="form-check"
                  v-for="(news, index) in newsList"
                  :key="index"
                >
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :id="'news' + index"
                    :value="news"
                    v-model="selectedNews"
                  />
                  <label class="form-check-label" :for="'news' + index">{{
                    news
                  }}</label>
                </div>
              </div>
              <p v-if="selectedNews.length > 0" class="fw-light pt-3">
                {{ "News selezionate: " + selectedNews.join(", ") }}
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
                v-model="targetPonitsNews"
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
                v-model="stopPonitsNews"
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
                  v-model="commentsNews"
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
                Salva operazione news
              </button>
              <button
                type="button"
                class="fw-bold ms-3 btn btn-outline-primary"
                @click="goToSummary"
              >
                Vai al sommario news
              </button>
              <button
                type="button"
                class="fw-bold ms-3 btn btn-outline-primary"
                @click="goToAddOperation"
              >
                Torna aggiungi operazione
              </button>
            </div>
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
.asd {
  margin-top: 125px !important;
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}
.news-select {
  max-height: 200px;
  overflow-y: auto;
}
</style>
