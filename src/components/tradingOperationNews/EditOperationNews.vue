<!-- eslint-disable no-unused-vars -->
<script setup lang="ts">
import OperationsNewsService from "@/services/OperationsNewsService";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const targetOrStopRadioNews = ref("");
const operationDataNews = ref("");
const operationTimeNews = ref("");
const maxTargetReached = ref<number>();
const selectedNews = ref<string[]>([]);
const targetPonitsNews = ref<number>();
const stopPonitsNews = ref<number>();
const alertSaveSucces = ref(false);
const alertEmptyField = ref(false);
const operationToEdit = ref<OperationToEdit>();
const commentsNews = ref("");
const image = ref<unknown>("");
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

interface OperationToEdit {
  data: string;
  time: string;
  result: string;
  maxTargetReached: number;
  news: string;
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
  await OperationsNewsService.getOperation(parseInt(opId)).then((response) => {
    if (response.data) {
      operationToEdit.value = response.data;
    }

    operationDataNews.value =
      operationToEdit.value?.data === undefined
        ? ""
        : operationToEdit.value.data;
    operationTimeNews.value =
      operationToEdit.value?.time === undefined
        ? ""
        : operationToEdit.value.time;
    targetPonitsNews.value = operationToEdit.value?.targetPoints;
    commentsNews.value =
      operationToEdit.value?.comments === undefined
        ? ""
        : operationToEdit.value.comments;
    stopPonitsNews.value = operationToEdit.value?.stopPoints;
    targetOrStopRadioNews.value =
      operationToEdit.value?.result === "Target" ? "1" : "0";
    maxTargetReached.value = operationToEdit.value?.maxTargetReached;
    selectedNews.value = selectedNews.value.concat(
      operationToEdit.value?.news
        .replaceAll("[", "")
        .replaceAll("]", "")
        .split(",")
        .map((el) => {
          return el.trim();
        }) ?? []
    );
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
      image: image.value,
    };
    let opId: string | number = route.params.id as string;
    await OperationsNewsService.editOperation(saveData, parseInt(opId));
    console.log(saveData);
  }
  //getOperation();
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
        Modifica Operazione (NEWS)
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
                {{ "News selezionate: " + selectedNews }}
              </p>
              <p v-else class="fw-light pt-3">
                {{ "Inserire nuovamente le news!" }}
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
                Modifica operazione news
              </button>
              <button
                type="button"
                class="fw-bold ms-3 btn btn-outline-primary"
                @click="goToSummary"
              >
                Torna al sommario news
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
.news-select {
  max-height: 200px;
  overflow-y: auto;
}
</style>
