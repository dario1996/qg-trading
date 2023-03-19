<script setup lang="ts">
import OperationsService from "@/services/OperationsService";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const standardOrNewsTrading = ref("");
const alertNoDataForFilters = ref(false);
const tableVisibility = ref(false);
const alertTableEmpty = ref(false);
const errorWebApi = ref(false);
const isLoading = ref(false);
const operationPorPage = ref<number>(25);
const actualPage = ref<number>(1);
const operationPagedList = ref<OperationList[]>([]);
const operationList = ref<OperationList[]>([]);
const tableHeader = ref({
  id: "Id",
  data: "Data e Ora",
  rating: "Rating",
  esitoOperazione: "Esito",
  puntiDiTarget: "Punti di Target",
  puntiDiStop: "Punti di Stop",
  rischioRendimento: "Rischio/Rendimento",
  target: "Target",
  edit: "Modifica",
  delete: "Elimina",
  detail: "Dettaglio",
});
const filteredData = ref({
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  targetOrStopRadio: "",
  dynamicRadio: "",
  startTargetPoints: 0,
  endTargetPoints: 0,
  startStopPoints: 0,
  endStopPoints: 0,
  startRiskResult: 0,
  endRiskResult: 0,
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

onMounted(async () => {
  // if (standardOrNewsTrading.value == "Standard") {
  //   getOperations();
  // }
});

async function getOperations() {
  isLoading.value = true;
  await OperationsService.getOperations()
    .then((response) => {
      operationList.value = response.data;
      getPagesData(1);
    })
    .catch((error) => {
      tableVisibility.value = false;
      if (operationList.value && operationList.value.length !== 0) {
        alertTableEmpty.value = true;
      } else {
        errorWebApi.value = true;
        console.log(error.response.status);
      }
    })
    .finally(() => {
      isLoading.value = false;
      tableVisibility.value = true;
    });
}

async function deleteOperation(opId: number) {
  await OperationsService.deleteOperation(opId).then(() => {
    const index = operationPagedList.value.findIndex(
      (post) => post.id === opId
    );
    if (~index) operationPagedList.value.splice(index, 1); //delete the post
    getOperations();
  });
}

//FILTRI TABELLA
// function filterOperationsTable() {
//   let filterOperationResult = filteredData.value.targetOrStopRadio;
//   let filterOperationDynamic = filteredData.value.dynamicRadio;
//   let startRiskResult = filteredData.value.startRiskResult;
//   let endRiskResult = filteredData.value.endRiskResult;
//   let startTargetPoints = filteredData.value.startTargetPoints;
//   let endTargetPoints = filteredData.value.endTargetPoints;
//   let startStopPoints = filteredData.value.startStopPoints;
//   let endStopPoints = filteredData.value.endStopPoints;
//   let startDate = localizeDate(filteredData.value.startDate);
//   let endDate = localizeDate(filteredData.value.endDate);
//   let startTime = filteredData.value.startTime;
//   let endTime = filteredData.value.endTime;
//   if (operationList.value) {
//     operationList.value = filterOperationResult
//       ? operationList.value.filter((el) => el.result === filterOperationResult)
//       : operationList.value;
//     operationList.value =
//       startDate && endDate
//         ? operationList.value.filter(
//             (el) =>
//               startDate <= new Date(localizeDate(el.data)) &&
//               new Date(localizeDate(el.data)) <= endDate
//           )
//         : operationList.value;
//     if (startRiskResult != 0 && endRiskResult != 0) {
//       operationList.value = operationList.value.filter(
//         (el) =>
//           startRiskResult <= el.riskReturn && el.riskReturn <= endRiskResult
//       );
//     } else {
//       operationList.value;
//     }
//     if (endTargetPoints != 0) {
//       operationList.value = operationList.value.filter(
//         (el) =>
//           startTargetPoints <= el.targetPoints &&
//           el.targetPoints <= endTargetPoints
//       );
//     } else {
//       operationList.value;
//     }
//     if (endStopPoints != 0) {
//       operationList.value = operationList.value.filter(
//         (el) =>
//           startStopPoints <= el.stopPoints && el.stopPoints <= endStopPoints
//       );
//     } else {
//       operationList.value;
//     }
//     operationList.value = filterOperationDynamic
//       ? operationList.value.filter(
//           (el) => el.dynamic === filterOperationDynamic
//         )
//       : operationList.value;
//     operationList.value =
//       startTime && endTime
//         ? operationList.value.filter(
//             (el) => startTime <= el.time && el.time <= endTime
//           )
//         : operationList.value;
//     getPagesData(1);
//   }
//   console.log(operationList.value);
//   if (operationPagedList.value.length === 0) {
//     tableVisibility.value = false;
//     alertNoDataForFilters.value = true;
//   }
// }

function filterOperationsTable() {
  const operationListValue = operationList.value;
  if (!operationListValue) return;

  const filterOperationResult = filteredData.value.targetOrStopRadio;
  const filterOperationDynamic = filteredData.value.dynamicRadio;
  const startRiskResult = filteredData.value.startRiskResult;
  const endRiskResult = filteredData.value.endRiskResult;
  const startTargetPoints = filteredData.value.startTargetPoints;
  const endTargetPoints = filteredData.value.endTargetPoints;
  const startStopPoints = filteredData.value.startStopPoints;
  const endStopPoints = filteredData.value.endStopPoints;
  const startDate = localizeDate(filteredData.value.startDate);
  const endDate = localizeDate(filteredData.value.endDate);
  const startTime = filteredData.value.startTime;
  const endTime = filteredData.value.endTime;

  const filteredList = operationListValue.filter((el) => {
    const data = new Date(localizeDate(el.data));
    return (
      (!filterOperationResult || el.result === filterOperationResult) &&
      (!startDate || !endDate || (startDate <= data && data <= endDate)) &&
      ((startRiskResult === 0 && endRiskResult === 0) ||
        (startRiskResult <= el.riskReturn && el.riskReturn <= endRiskResult)) &&
      (endTargetPoints === 0 ||
        (startTargetPoints <= el.targetPoints &&
          el.targetPoints <= endTargetPoints)) &&
      (endStopPoints === 0 ||
        (startStopPoints <= el.stopPoints && el.stopPoints <= endStopPoints)) &&
      (!filterOperationDynamic || el.dynamic === filterOperationDynamic) &&
      (!startTime || !endTime || (startTime <= el.time && el.time <= endTime))
    );
  });

  operationList.value = filteredList;
  getPagesData(1);

  if (operationPagedList.value.length === 0) {
    tableVisibility.value = false;
    alertNoDataForFilters.value = true;
  } else if (alertNoDataForFilters.value) {
    alertNoDataForFilters.value = false;
  }

  console.log(operationList.value);
}

//CANCELLA FILTRI
function cancelFilters() {
  filteredData.value.startDate = "";
  filteredData.value.endDate = "";
  filteredData.value.targetOrStopRadio = "";
  filteredData.value.startRiskResult = 0;
  filteredData.value.endRiskResult = 0;
  filteredData.value.startTime = "";
  filteredData.value.endTime = "";
  alertNoDataForFilters.value = false;
  getOperations();
}

//UTILS DATA
function localizeDate(date: string) {
  if (!date || !date.includes("-")) return date;
  const [yyyy, mm, dd] = date.split("-");
  return new Date(`${mm}/${dd}/${yyyy}`);
}

function convertDate(dateString: string) {
  var p = dateString.split(/\D/g);
  return [p[2], p[1], p[0]].join("-");
}

//PAGINAZIONE TABELLA
function totalPage() {
  return Math.ceil(operationList.value.length / operationPorPage.value);
}

function getPagesData(pageNumber: number) {
  actualPage.value = pageNumber;
  operationPagedList.value = [];
  let ini = pageNumber * operationPorPage.value - operationPorPage.value;
  let fin = pageNumber * operationPorPage.value;
  operationPagedList.value = operationList.value.slice(ini, fin);
}

function getPreviousPage() {
  if (actualPage.value > 1) {
    actualPage.value--;
  }
  getPagesData(actualPage.value);
}

function getNextPage() {
  if (actualPage.value < totalPage()) {
    actualPage.value++;
  }
  getPagesData(actualPage.value);
}

function isActive(pageNumber: number) {
  return pageNumber == actualPage.value ? "active" : "";
}

//LABEL PUNTI TARGET, STOP, WIN RATE E RISCHIO RENDIMENTO MEDIO
function getTotalTargetPointsPorPage() {
  let total = 0;
  operationList.value
    .filter((el) => el.result == "Target")
    .forEach((el) => {
      total = total + el.targetPoints;
    });
  return total.toFixed(1);
}

function getTotalStopPointsPorPage() {
  let total = 0;
  operationList.value
    .filter((el) => el.result == "Stop")
    .forEach((el) => {
      total = total + el.stopPoints;
    });
  return total.toFixed(1);
}

function getWinRate() {
  let targetCount = 0;
  let winRate = 0;
  operationList.value.forEach((el) => {
    if (el.result == "Target") {
      targetCount = targetCount + 1;
    }
  });
  winRate = (targetCount / operationList.value.length) * 100;
  return winRate.toFixed(2);
}

function getMediumRiskReturn() {
  let riskReturnSum = 0;
  let mediumRiskReturn = 0;

  operationList.value.forEach((el) => {
    riskReturnSum = riskReturnSum + el.riskReturn;
  });
  mediumRiskReturn = riskReturnSum / operationList.value.length;
  return mediumRiskReturn.toFixed(1);
}

//NAVIGAZIONE PAGINA
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
function goToEdit(opId: number) {
  router.push({
    name: "Edit",
    params: {
      id: opId,
    },
  });
}

function goToSummaryNews() {
  if (standardOrNewsTrading.value == "News") {
    router.push({
      path: "/operations/news",
    });
  }
}
</script>

<template>
  <div class="card margin-row">
    <h3 class="fw-bold card-title mt-4 mb-4 d-flex justify-content-center">
      Sommario delle Operazioni
    </h3>
    <div class="card-body">
      <div v-if="!isLoading" class="row pt-5">
        <div class="col-md-10 d-flex align-self-end justify-content-start">
          <h5 class="fw-bold">
            Per quale tipo di operazione si desidera guardare il sommario?
          </h5>
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
              @change="getOperations"
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
              @change="goToSummaryNews"
            />
            <label class="fw-bold form-check-label" for="newsTrading">
              News
            </label>
          </div>
        </div>
      </div>
      <div v-if="standardOrNewsTrading == 'Standard'">
        <h5
          v-if="!isLoading && !alertTableEmpty && !errorWebApi"
          class="fw-bold card-title mt-2 mb-4 d-flex justify-content-start"
        >
          Filtri
        </h5>
        <div
          v-if="!isLoading && !alertTableEmpty && !errorWebApi"
          class="accordion pb-3"
          id="accordionPanelsStayOpenExample"
        >
          <div class="accordion-item">
            <h2 class="accordion-header" id="panelsStayOpen-headingOne">
              <button
                class="fw-bold accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseOne"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseOne"
              >
                Data e orario
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingOne"
            >
              <div class="accordion-body">
                <div
                  v-if="!isLoading && !alertTableEmpty"
                  class="row pb-2 align-items-center"
                >
                  <div class="col-md-2 align-self-center">
                    <label for="startDate" class="fw-bold form-label">Da</label>
                    <input
                      type="date"
                      class="form-control"
                      id="startDate"
                      v-model="filteredData.startDate"
                    />
                  </div>
                  <div class="col-md-2 align-self-center">
                    <label for="endDate" class="fw-bold form-label">A</label>
                    <input
                      type="date"
                      class="form-control"
                      id="endDate"
                      v-model="filteredData.endDate"
                    />
                  </div>
                  <div class="col-md-2 align-self-center">
                    <label for="startTime" class="fw-bold form-label">Da</label>
                    <input
                      type="time"
                      class="form-control"
                      id="startTime"
                      v-model="filteredData.startTime"
                    />
                  </div>
                  <div class="col-md-2 align-self-center">
                    <label for="endTime" class="fw-bold form-label">A</label>
                    <input
                      type="time"
                      class="form-control"
                      id="endTime"
                      v-model="filteredData.endTime"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
              <button
                class="fw-bold accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseTwo"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseTwo"
              >
                Esito e dinamica
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingTwo"
            >
              <div class="accordion-body">
                <div
                  v-if="!isLoading && !alertTableEmpty"
                  class="row pb-2 align-items-center"
                >
                  <div
                    class="col-md-2 d-flex align-self-end justify-content-start"
                  >
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="stopOrTargetRadio"
                        id="targetRadio"
                        v-model="filteredData.targetOrStopRadio"
                        :value="'Target'"
                      />
                      <label class="fw-bold form-check-label" for="targetRadio">
                        Target
                      </label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="stopOrTargetRadio"
                        id="stopRadio"
                        v-model="filteredData.targetOrStopRadio"
                        :value="'Stop'"
                      />
                      <label class="fw-bold form-check-label" for="stopRadio">
                        Stop
                      </label>
                    </div>
                  </div>
                  <div
                    class="col-md-4 d-flex align-self-end justify-content-center"
                  >
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="dynamicRadio"
                        id="rating4Radio"
                        v-model="filteredData.dynamicRadio"
                        :value="'Rating 4'"
                      />
                      <label
                        class="fw-bold form-check-label"
                        for="rating4Radio"
                      >
                        Rating 4
                      </label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="dynamicRadio"
                        id="rating5Radio"
                        v-model="filteredData.dynamicRadio"
                        :value="'Rating 5'"
                      />
                      <label
                        class="fw-bold form-check-label"
                        for="rating5Radio"
                      >
                        Rating 5
                      </label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="dynamicRadio"
                        id="ratingMaggioreDi5Radio"
                        v-model="filteredData.dynamicRadio"
                        :value="'Rating maggiore di 5'"
                      />
                      <label
                        class="fw-bold form-check-label"
                        for="ratingMaggioreDi5Radio"
                      >
                        Rating maggiore di 5
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="panelsStayOpen-headingThree">
              <button
                class="fw-bold accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseThree"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseThree"
              >
                Punti di target, stop e rischio/rendimento
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingThree"
            >
              <div class="accordion-body">
                <div
                  v-if="!isLoading && !alertTableEmpty"
                  class="row pb-2 align-items-center"
                >
                  <div class="col-md-4 align-self-center">
                    <label for="startDate" class="fw-bold form-label"
                      >Punti Target Da</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="startDate"
                      v-model="filteredData.startTargetPoints"
                    />
                  </div>
                  <!-- <div class="col-md-2 align-self-center">
          <label for="endDate" class="fw-bold form-label">P. Target A</label>
          <input
            type="number"
            class="form-control"
            id="endDate"
            v-model="filteredData.endDate"
          />
        </div> -->
                  <div class="col-md-4 align-self-center">
                    <label for="startDate" class="fw-bold form-label"
                      >Punti Stop Da</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="startDate"
                      v-model="filteredData.startStopPoints"
                    />
                  </div>
                  <!-- <div class="col-md-2 align-self-center">
          <label for="endDate" class="fw-bold form-label">P. Stop A</label>
          <input
            type="number"
            class="form-control"
            id="endDate"
            v-model="filteredData.endDate"
          />
        </div> -->
                  <div class="col-md-4 align-self-center">
                    <label for="startDate" class="fw-bold form-label"
                      >R/R Da</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="startDate"
                      v-model="filteredData.startRiskResult"
                    />
                  </div>
                  <!-- <div class="col-md-2 align-self-center">
          <label for="endDate" class="fw-bold form-label"
            >Rischio/Rend. A</label
          >
          <input
            type="number"
            class="form-control"
            id="endDate"
            v-model="filteredData.endRiskResult"
          />
        </div> -->
                  <!-- <div class="col-md-2 align-self-end">
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="stopOrTargetRadio"
              id="targetRadio"
              v-model="filteredData.targetOrStopRadio"
              :value="'Target'"
            />
            <label class="fw-bold form-check-label" for="targetRadio">
              Target
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="stopOrTargetRadio"
              id="stopRadio"
              v-model="filteredData.targetOrStopRadio"
              :value="'Stop'"
            />
            <label class="fw-bold form-check-label" for="stopRadio">
              Stop
            </label>
          </div>
        </div> -->
                  <!-- <div class="col-md-2 align-self-end">
          <button
            type="button"
            class="fw-bold ms-3 btn btn-outline-success"
            @click="filterOperationsTable()"
          >
            Filtra tabella
          </button>
        </div>
        <div class="col-md-2 align-self-end">
          <button
            type="button"
            class="fw-bold ms-3 btn btn-outline-danger"
            @click="cancelFilters()"
          >
            Annulla filtri
          </button>
        </div> -->
                </div>
                <div
                  v-if="!isLoading && !alertTableEmpty"
                  class="row pb-5 align-items-center"
                >
                  <!-- <div class="col-md-2 align-self-center">
          <label for="startDate" class="fw-bold form-label">P. Target Da</label>
          <input
            type="number"
            class="form-control"
            id="startDate"
            v-model="filteredData.startDate"
          />
        </div> -->
                  <div class="col-md-4 align-self-center">
                    <label for="endDate" class="fw-bold form-label"
                      >Punti Target A</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="endDate"
                      v-model="filteredData.endTargetPoints"
                    />
                  </div>
                  <!-- <div class="col-md-2 align-self-center">
          <label for="startDate" class="fw-bold form-label">P. Stop Da</label>
          <input
            type="number"
            class="form-control"
            id="startDate"
            v-model="filteredData.startDate"
          />
        </div> -->
                  <div class="col-md-4 align-self-center">
                    <label for="endDate" class="fw-bold form-label"
                      >Punti Stop A</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="endDate"
                      v-model="filteredData.endStopPoints"
                    />
                  </div>
                  <!-- <div class="col-md-2 align-self-center">
          <label for="startDate" class="fw-bold form-label"
            >Rischio/Rend. Da</label
          >
          <input
            type="number"
            class="form-control"
            id="startDate"
            v-model="filteredData.startRiskResult"
          />
        </div> -->
                  <div class="col-md-4 align-self-center">
                    <label for="endDate" class="fw-bold form-label"
                      >R/R A</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="endDate"
                      v-model="filteredData.endRiskResult"
                    />
                  </div>
                  <!-- <div class="col-md-2 align-self-end">
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="stopOrTargetRadio"
              id="targetRadio"
              v-model="filteredData.targetOrStopRadio"
              :value="'Target'"
            />
            <label class="fw-bold form-check-label" for="targetRadio">
              Target
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="stopOrTargetRadio"
              id="stopRadio"
              v-model="filteredData.targetOrStopRadio"
              :value="'Stop'"
            />
            <label class="fw-bold form-check-label" for="stopRadio">
              Stop
            </label>
          </div>
        </div> -->
                  <!-- <div class="col-md-2 align-self-end">
          <button
            type="button"
            class="fw-bold ms-3 btn btn-outline-success"
            @click="filterOperationsTable()"
          >
            Filtra tabella
          </button>
        </div>
        <div class="col-md-2 align-self-end">
          <button
            type="button"
            class="fw-bold ms-3 btn btn-outline-danger"
            @click="cancelFilters()"
          >
            Annulla filtri
          </button>
        </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="!isLoading && !alertTableEmpty && !errorWebApi"
          class="pb-5 row"
        >
          <div class="mt-0 pt-3 d-flex justify-content-center">
            <button
              type="button"
              class="fw-bold ms-3 btn btn-outline-success"
              @click="filterOperationsTable()"
            >
              Filtra tabella
            </button>
            <button
              type="button"
              class="fw-bold ms-3 btn btn-outline-danger"
              @click="cancelFilters()"
            >
              Annulla filtri
            </button>
          </div>
        </div>
        <div
          v-if="alertTableEmpty"
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
          <div>Nessuna operazione presente nel sommario</div>
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
          <div>ERRORE GENERICO, CONTATTARE IL SUPPORTO</div>
        </div>
        <table
          v-if="tableVisibility && !isLoading && !errorWebApi"
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
              <!-- <th scope="col">{{ tableHeader.target }}</th> -->
              <th scope="col">{{ tableHeader.edit }}</th>
              <th scope="col">{{ tableHeader.delete }}</th>
              <th scope="col">{{ tableHeader.detail }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="operation in operationPagedList" :key="operation.id">
              <th scope="row">{{ operation.id }}</th>
              <td>
                {{ convertDate(operation.data) + " - " + operation.time }}
              </td>
              <td>{{ operation.dynamic }}</td>
              <!-- <td>{{ operation.result }}</td> -->
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
              <!-- operation.target -->
              <!-- <td>{{}}</td> -->
              <td>
                <button
                  type="button"
                  class="mx-1 btn btn-outline-primary"
                  @click="goToEdit(operation.id)"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
              </td>
              <td>
                <button
                  type="button"
                  class="mx-1 btn btn-outline-danger"
                  @click="deleteOperation(operation.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
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
        <nav
          v-if="
            !isLoading &&
            !alertTableEmpty &&
            !alertNoDataForFilters &&
            !errorWebApi
          "
          aria-label="Page navigation example"
        >
          <ul class="pagination justify-content-center pt-3">
            <li class="fw-bold page-item" @click="getPreviousPage()">
              <button class="page-link">Previous</button>
            </li>
            <li
              v-for="(page, i) in totalPage()"
              :key="i"
              @click="getPagesData(page)"
              class="fw-bold page-item"
              :class="isActive(page)"
            >
              <button class="page-link">{{ page }}</button>
            </li>
            <li class="fw-bold page-item" @click="getNextPage()">
              <button class="page-link">Next</button>
            </li>
          </ul>
        </nav>
        <div class="d-flex justify-content-center">
          <div
            v-if="isLoading"
            class="spinner-border text-primary mt-5"
            style="width: 3rem; height: 3rem"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div
          v-if="!alertTableEmpty && !alertNoDataForFilters && !errorWebApi"
          class="row pt-3"
        >
          <div class="col-md-3">
            <!-- <label class="fw-bold">Punti: {{getTotalTargetPointsPorPage()}}</label> -->
            <h5
              v-if="!isLoading && !alertTableEmpty"
              class="fw-bold card-title mt-2 mb-4 d-flex justify-content-center"
            >
              Punti di target totali: {{ getTotalTargetPointsPorPage() }}
            </h5>
          </div>
          <div class="col-md-3">
            <h5
              v-if="!isLoading && !alertTableEmpty"
              class="fw-bold card-title mt-2 mb-4 d-flex justify-content-center"
            >
              Punti di stop totali: {{ getTotalStopPointsPorPage() }}
            </h5>
          </div>
          <div class="col-md-3">
            <h5
              v-if="!isLoading && !alertTableEmpty"
              class="fw-bold card-title mt-2 mb-4 d-flex justify-content-center"
            >
              Win rate: {{ getWinRate() }} %
            </h5>
          </div>
          <div class="col-md-3">
            <h5
              v-if="!isLoading && !alertTableEmpty"
              class="fw-bold card-title mt-2 mb-4 d-flex justify-content-center"
            >
              R/R Medio: {{ getMediumRiskReturn() }}
            </h5>
          </div>
        </div>
        <div
          v-if="alertNoDataForFilters"
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
          <div>Dati non presenti per i filtri selezionati.</div>
        </div>
        <div class="row">
          <div class="mt-0 pt-3 d-flex justify-content-center">
            <button
              v-if="!isLoading && !errorWebApi"
              type="button"
              class="fw-bold ms-3 btn btn-outline-primary"
              @click="goToAddOperation"
            >
              Torna indietro
            </button>
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
  margin-top: 125px !important;
  /* margin-bottom: 75px !important; */
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}
</style>
