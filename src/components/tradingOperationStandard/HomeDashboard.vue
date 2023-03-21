<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Line } from "vue-chartjs";
import OperationsService from "@/services/OperationsService";
import OperationsNewsService from "@/services/OperationsNewsService";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const router = useRouter();
const alertTableEmpty = ref(false);
const tableStandardVisibility = ref(false);
const tableNewsVisibility = ref(false);
const errorWebApi = ref(false);
const errorWebApiMessage = ref("");
const isLoading = ref(false);
const lastOperationAdded = ref<OperationList[]>([]);
const lastOperationAddedNews = ref<OperationListNews[]>([]);
const operationList = ref<OperationList[]>([]);
const operationListNews = ref<OperationListNews[]>([]);
const isMountedStandard = ref<boolean>(false);
const isMountedNews = ref<boolean>(false);
const isMountedLineChart = ref<boolean>(false);
const rateWinStandard = ref();
const rateWinNews = ref();
const options = {
  responsive: true,
  maintainAspectRatio: true,
};

const data = {
  labels: ["Target", "Stop"],
  datasets: [
    {
      backgroundColor: ["#41B883", "#DD1B16"],
      data: [] as number[],
    },
  ],
};

const dataNews = {
  labels: ["Target", "Stop"],
  datasets: [
    {
      backgroundColor: ["#41B883", "#DD1B16"],
      data: [] as number[],
    },
  ],
};

const labels = populateLineChartLabels();
const dataLineChart = {
  labels: labels,
  datasets: [
    {
      label: "Punti netti STANDARD",
      data: [] as number[],
      fill: false,
      borderColor: "#FFC107",
      tension: 0.1,
    },
    {
      label: "Punti netti NEWS",
      data: [] as number[],
      fill: false,
      borderColor: "#0D6EFD",
      tension: 0.1,
    },
  ],
};

const tableHeader = ref({
  id: "Id",
  data: "Data e Ora",
  rating: "Rating",
  news: "News",
  esitoOperazione: "Esito",
  maxTargetReached: "Massimo target raggiunto",
  puntiDiTarget: "Punti di Target",
  puntiDiStop: "Punti di Stop",
  rischioRendimento: "Rischio/Rendimento",
  target: "Target",
  detail: "Dettaglio",
});

interface OperationList {
  id: number;
  data: string;
  time: string;
  result: string;
  dynamic: string;
  targetPoints: number;
  stopPoints: number;
  riskReturn: number;
}

interface OperationListNews {
  id: number;
  data: string;
  time: string;
  result: string;
  news: string[];
  targetPoints: number;
  stopPoints: number;
  riskReturn: number;
  maxTargetReached: number;
}

onMounted(async () => {
  await getOperationsStandard();
  await getOperationsNews();
  isMountedLineChart.value = true;
});

async function getOperationsStandard() {
  try {
    isLoading.value = true;
    const response = await OperationsService.getOperations();
    operationList.value = response.data;
    if (operationList.value && operationList.value.length > 0) {
      lastOperationAdded.value = operationList.value.slice(-1);
      tableStandardVisibility.value = true;
    } else {
      tableStandardVisibility.value = false;
      alertTableEmpty.value = true;
    }
    isMountedStandard.value = true;
    getWinRateStandard();
    updateDataLineChartStandard();
  } catch (error) {
    errorWebApi.value = true;
    errorWebApiMessage.value =
      "Errore Generico: il server non risponde, contattare supporto.";
  } finally {
    isLoading.value = false;
  }
}

async function getOperationsNews() {
  try {
    isLoading.value = true;
    const response = await OperationsNewsService.getOperations();
    operationListNews.value = response.data;
    if (operationListNews.value && operationListNews.value.length > 0) {
      lastOperationAddedNews.value = operationListNews.value.slice(-1);
      tableNewsVisibility.value = true;
    } else {
      tableNewsVisibility.value = false;
      alertTableEmpty.value = true;
    }
    isMountedNews.value = true;
    getWinRateNews();
    updateDataLineChartNews();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

function getWinRateStandard() {
  let targetCount = 0;
  let winRate = 0;
  operationList.value.forEach((el) => {
    if (el.result == "Target") {
      targetCount = targetCount + 1;
    }
  });
  winRate = (targetCount / operationList.value.length) * 100;
  data.datasets[0].data.push(winRate, 100 - winRate);
  rateWinStandard.value = parseInt(winRate.toFixed());
}

function getWinRateNews() {
  let targetCount = 0;
  let winRate = 0;
  operationListNews.value.forEach((el) => {
    if (el.result == "Target") {
      targetCount = targetCount + 1;
    }
  });
  winRate = (targetCount / operationListNews.value.length) * 100;
  dataNews.datasets[0].data.push(winRate, 100 - winRate);
  rateWinNews.value = parseInt(winRate.toFixed());
}

function getWeekOfMonth(date: Date): number {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const offset = firstDayWeekday == 0 ? 6 : firstDayWeekday - 1;
  const dayOfMonth = date.getDate();
  const index = offset + dayOfMonth;
  return Math.floor(index / 7) + (index % 7 == 0 ? 0 : 1);
}

function updateDataLineChartStandard() {
  const weeksInMonth = getWeeksInMonth(
    new Date().getFullYear(),
    new Date().getMonth()
  );
  const dataStandard = Array.from({ length: weeksInMonth }, () => 0);
  operationList.value.forEach((el) => {
    const week = getWeekOfMonth(new Date(el.data));
    const sPoints = el.result == "Stop" ? el.stopPoints : 0;
    const tPoints = el.result == "Target" ? el.targetPoints : 0;
    dataStandard[week - 1] += tPoints - sPoints;
  });
  dataLineChart.datasets[0].data = dataStandard;
  console.log(dataLineChart.datasets[0].data);
}

function updateDataLineChartNews() {
  const weeksInMonth = getWeeksInMonth(
    new Date().getFullYear(),
    new Date().getMonth()
  );
  const dataNews = Array.from({ length: weeksInMonth }, () => 0);
  operationListNews.value.forEach((el) => {
    const week = getWeekOfMonth(new Date(el.data));
    const sPoints = el.result == "Stop" ? el.stopPoints : 0;
    const tPoints = el.result == "Target" ? el.targetPoints : 0;
    dataNews[week - 1] += tPoints - sPoints;
  });
  dataLineChart.datasets[1].data = dataNews;
  console.log(dataLineChart.datasets[1].data);
}

function getTotalnetPointsStandard() {
  let totalTargetPoints = 0;
  let totalStopPoints = 0;
  operationList.value
    .filter((el) => el.result == "Target")
    .forEach((el) => {
      totalTargetPoints = totalTargetPoints + el.targetPoints;
    });
  operationList.value
    .filter((el) => el.result == "Stop")
    .forEach((el) => {
      totalStopPoints = totalStopPoints + el.stopPoints;
    });
  return (totalTargetPoints - totalStopPoints).toFixed(1);
}

function getTotalnetPointsNews() {
  let totalTargetPoints = 0;
  let totalStopPoints = 0;
  operationListNews.value
    .filter((el) => el.result == "Target")
    .forEach((el) => {
      totalTargetPoints = totalTargetPoints + el.targetPoints;
    });
  operationListNews.value
    .filter((el) => el.result == "Stop")
    .forEach((el) => {
      totalStopPoints = totalStopPoints + el.stopPoints;
    });
  return (totalTargetPoints - totalStopPoints).toFixed(1);
}

function convertDate(dateString: string) {
  var p = dateString.split(/\D/g);
  return [p[2], p[1], p[0]].join("-");
}

function populateLineChartLabels() {
  const today = new Date();
  const monthName = today.toLocaleString("default", { month: "long" });
  const weeksInMonth = getWeeksInMonth(today.getFullYear(), today.getMonth());
  const labels = [];

  for (let i = 1; i <= weeksInMonth; i++) {
    labels.push(`${monthName} - settimana ${i}`);
  }

  return labels;
}

function getWeeksInMonth(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const firstDayOfWeek = firstDay.getDay();
  const lastDayOfWeek = lastDay.getDay();

  const daysInFirstWeek = 6 - firstDayOfWeek;
  const daysInLastWeek = lastDayOfWeek === 0 ? 7 : lastDayOfWeek;

  const daysInMonthWithoutFirstAndLastWeek =
    daysInMonth - daysInFirstWeek - (daysInLastWeek - 1);
  let weeksInMonth = Math.ceil(daysInMonthWithoutFirstAndLastWeek / 7) + 2;

  if (daysInFirstWeek >= 4 && daysInFirstWeek < 7 && daysInMonth > 28) {
    weeksInMonth--;
  }

  if (daysInLastWeek >= 4 && daysInLastWeek < 7 && daysInMonth > 28) {
    weeksInMonth--;
  }

  return weeksInMonth;
}

function goToAddOperation() {
  router.push({
    path: "/operation/add",
  });
}

function goToDetails(opId: number) {
  router.push({
    name: "Detail",
    params: {
      id: opId,
    },
  });
}

function goToDetailsNews(opId: number) {
  router.push({
    name: "DetailNews",
    params: {
      id: opId,
    },
  });
}
</script>

<template>
  <div class="row row-cols-1 row-cols-md-2 g-4 margin-row">
    <div class="col">
      <div class="card h-100 border-primary mb-3 card-style">
        <i
          class="bi bi-plus-circle text-primary text-center"
          style="font-size: 100px; cursor: pointer"
          @click="goToAddOperation"
        ></i>
        <div class="card-body pt-5">
          <h2 class="card-title">Aggiungi operazione</h2>
          <p class="card-text">
            Clicca sull'icona per aggiungere una nuova operazione (navigazione
            alla pagina dedicata).
          </p>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100 border-info mb-3 card-style">
        <h2 class="card-title">Grafici di riepilogo</h2>
        <p class="card-text">
          Grafico che rappresenta il win rate - percentuale di vincita (rapporto
          tra operazioni chiuse a target e operazioni chiuse a stop).
        </p>
        <div v-if="!isLoading" class="row">
          <div class="col-6 d-flex justify-content-center">
            <Doughnut
              v-if="isMountedStandard && !data.datasets[0].data.includes(NaN)"
              id="chart"
              class="chart justify-content-center"
              :data="data"
              :options="options"
            ></Doughnut>
          </div>
          <div class="col-6 d-flex justify-content-center">
            <Doughnut
              v-if="isMountedNews && !dataNews.datasets[0].data.includes(NaN)"
              id="chartNews"
              class="chart justify-content-center"
              :data="dataNews"
              :options="options"
            ></Doughnut>
          </div>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-center">
            <div
              v-if="isLoading"
              class="spinner-border text-primary mt-5"
              style="width: 3rem; height: 3rem"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-if="!isLoading" class="row">
            <div class="col-6 d-flex justify-content-center">
              <div
                v-if="!isLoading && data.datasets[0].data.includes(NaN)"
                class="alert alert-primary d-flex align-items-center"
                role="alert"
              >
                <svg
                  class="bi flex-shrink-0 me-2"
                  width="24"
                  height="24"
                  role="img"
                  aria-label="Info:"
                >
                  <use xlink:href="#info-fill" />
                </svg>
                <div>
                  Il grafico che rappresenta il win rate delle operazioni
                  standard non contiene alcun dato.
                </div>
              </div>
              <h1
                v-if="!errorWebApi && !data.datasets[0].data.includes(NaN)"
                class="pt-3"
              >
                {{ "Standard: " + rateWinStandard + "%" }}
              </h1>
            </div>
            <div class="col-6 d-flex justify-content-center">
              <div
                v-if="!isLoading && dataNews.datasets[0].data.includes(NaN)"
                class="alert alert-primary d-flex align-items-center"
                role="alert"
              >
                <svg
                  class="bi flex-shrink-0 me-2"
                  width="24"
                  height="24"
                  role="img"
                  aria-label="Info:"
                >
                  <use xlink:href="#info-fill" />
                </svg>
                <div>
                  Il grafico che rappresenta il win rate delle operazioni news
                  non contiene alcun dato.
                </div>
              </div>
              <h1
                v-if="!errorWebApi && !dataNews.datasets[0].data.includes(NaN)"
                class="pt-3"
              >
                {{ "News: " + rateWinNews + "%" }}
              </h1>
            </div>
            <div
              v-if="errorWebApi"
              class="alert alert-danger d-flex align-items-center mt-5"
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
              <div>{{ errorWebApiMessage }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100 border-warning mb-3 card-style">
        <i
          class="bi bi-trophy text-warning text-center"
          style="font-size: 100px"
        ></i>
        <div class="card-body pt-5">
          <h2 class="card-title">Punti netti</h2>
          <p class="card-text">
            Questo valore indica la differenza tra i punti di target ed i punti
            di stop.
          </p>
          <div class="row">
            <h1 class="col-6 text-warning text-center pt-5">
              {{ "Standard: " + getTotalnetPointsStandard() }}
            </h1>
            <h1 class="col-6 text-warning text-center pt-5">
              {{ "News: " + getTotalnetPointsNews() }}
            </h1>
          </div>
          <div class="row pt-5">
            <div class="col-12">
              <div class="chart-container">
                <Line v-if="isMountedLineChart" :data="dataLineChart"></Line>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100 border-success mb-3 card-style">
        <i
          class="bi bi-cloud-arrow-up text-success text-center"
          style="font-size: 100px"
        ></i>
        <div v-if="!errorWebApi" class="card-body pt-3">
          <h2 class="card-title">Ultime operazioni aggiunte</h2>
          <p class="card-text">
            Queste sono le ultime operazioni che sono state aggiunte nel diario
            del trading.
          </p>
          <div class="d-flex justify-content-center">
            <div
              v-if="isLoading"
              class="spinner-border text-primary mt-5"
              style="width: 3rem; height: 3rem"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <h5 v-if="!isLoading" class="card-title fw-light pb-3 pt-3">
            Ultima operazione standard
          </h5>
          <div
            v-if="!isLoading && !tableStandardVisibility"
            class="alert alert-primary d-flex align-items-center"
            role="alert"
          >
            <svg
              class="bi flex-shrink-0 me-2"
              width="24"
              height="24"
              role="img"
              aria-label="Info:"
            >
              <use xlink:href="#info-fill" />
            </svg>
            <div>
              Nessuna ultima operazione standard aggiunta da visualizzare.
            </div>
          </div>
          <table
            v-if="tableStandardVisibility && !isLoading"
            class="table table-responsive align-middle"
          >
            <thead>
              <tr>
                <th scope="col">{{ tableHeader.id }}</th>
                <th scope="col">{{ tableHeader.data }}</th>
                <th scope="col">{{ tableHeader.rating }}</th>
                <th class="text-center" scope="col">
                  {{ tableHeader.esitoOperazione }}
                </th>
                <th class="text-center" scope="col">
                  {{ tableHeader.puntiDiTarget }}
                </th>
                <th class="text-center" scope="col">
                  {{ tableHeader.puntiDiStop }}
                </th>
                <th class="text-center" scope="col">
                  {{ tableHeader.rischioRendimento }}
                </th>
                <th scope="col">{{ tableHeader.detail }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="operation in lastOperationAdded" :key="operation.id">
                <th scope="row">{{ operation.id }}</th>
                <td>
                  {{ convertDate(operation.data) + " - " + operation.time }}
                </td>
                <td>{{ operation.dynamic }}</td>
                <td class="text-center">
                  <i
                    v-if="operation.result == 'Target'"
                    class="bi bi-check-circle-fill fs-3 text-success"
                  ></i>
                  <i
                    v-if="operation.result == 'Stop'"
                    class="bi bi-x-circle-fill fs-3 text-danger"
                  ></i>
                </td>
                <td class="text-center">{{ operation.targetPoints }}</td>
                <td class="text-center">{{ operation.stopPoints }}</td>
                <td class="text-center">{{ operation.riskReturn }}</td>
                <td>
                  <button
                    type="button"
                    class="mx-1 btn btn-outline-success"
                    @click="goToDetails(operation.id)"
                  >
                    <i class="bi bi-arrow-right"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <h5 v-if="!isLoading" class="card-title fw-light pb-2 pt-4">
            Ultima operazione news
          </h5>
          <table
            v-if="tableNewsVisibility && !isLoading"
            class="table table-responsive align-middle"
          >
            <thead>
              <tr>
                <th scope="col">{{ tableHeader.id }}</th>
                <th scope="col">{{ tableHeader.data }}</th>
                <th scope="col">{{ tableHeader.news }}</th>
                <th class="text-center" scope="col">
                  {{ tableHeader.esitoOperazione }}
                </th>
                <th class="text-center" scope="col">
                  {{ tableHeader.maxTargetReached }}
                </th>
                <th class="text-center" scope="col">
                  {{ tableHeader.puntiDiTarget }}
                </th>
                <th class="text-center" scope="col">
                  {{ tableHeader.puntiDiStop }}
                </th>
                <th class="text-center" scope="col">
                  {{ tableHeader.rischioRendimento }}
                </th>
                <th scope="col">{{ tableHeader.detail }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="operation in lastOperationAddedNews"
                :key="operation.id"
              >
                <th scope="row">{{ operation.id }}</th>
                <td>
                  {{ convertDate(operation.data) + " - " + operation.time }}
                </td>
                <td>
                  <span v-for="(news, index) in operation.news" :key="index">
                    {{ news.replace(/\[|\]/g, "") }}
                  </span>
                </td>
                <td class="text-center">
                  <i
                    v-if="operation.result == 'Target'"
                    class="bi bi-check-circle-fill fs-3 text-success"
                  ></i>
                  <i
                    v-if="operation.result == 'Stop'"
                    class="bi bi-x-circle-fill fs-3 text-danger"
                  ></i>
                </td>
                <td class="text-center">{{ operation.maxTargetReached }}</td>
                <td class="text-center">{{ operation.targetPoints }}</td>
                <td class="text-center">{{ operation.stopPoints }}</td>
                <td class="text-center">{{ operation.riskReturn }}</td>
                <td>
                  <button
                    type="button"
                    class="mx-1 btn btn-outline-success"
                    @click="goToDetailsNews(operation.id)"
                  >
                    <i class="bi bi-arrow-right"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="!isLoading && !tableNewsVisibility"
            class="alert alert-primary d-flex align-items-center"
            role="alert"
          >
            <svg
              class="bi flex-shrink-0 me-2"
              width="24"
              height="24"
              role="img"
              aria-label="Info:"
            >
              <use xlink:href="#info-fill" />
            </svg>
            <div>Nessuna ultima operazione news aggiunta da visualizzare.</div>
          </div>
        </div>
        <div v-if="errorWebApi" class="card-body pt-3">
          <h2 class="card-title">Ultime operazioni aggiunte</h2>
          <p class="card-text">
            Queste sono le ultime operazioni che sono state aggiunte nel diario
            del trading.
          </p>
          <div
            class="alert alert-danger d-flex align-items-center mt-5"
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
            <div>{{ errorWebApiMessage }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card-title-center {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 30px;
}
.margin-row {
  margin-top: 50px;
  margin-bottom: 100px;
}
.img {
  width: auto;
  height: 300px;
}
.card-style {
  /* margin-top: 100px !important; */
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}
.chart {
  width: 230px !important;
  height: 230px !important;
}
.line-chart {
  width: 1000px !important;
  height: 350px !important;
}
.chart-container {
  position: relative;
  height: 0;
  padding-bottom: 45%; /* impostare questa percentuale in base alle tue esigenze */
  width: 100%;
}
.chart-container canvas {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
