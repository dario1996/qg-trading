<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";
import OperationsService from "@/services/OperationsService";
//import * as chartConfig from './chartConfig.js'

ChartJS.register(ArcElement, Tooltip, Legend);

const router = useRouter();
const alertTableEmpty = ref(false);
const tableVisibility = ref(false);
const isLoading = ref(false);
const lastOperationAdded = ref<OperationList[]>([]);
const operationList = ref<OperationList[]>([]);
const isMounted = ref<boolean>(false);
const rateWin = ref();
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

const tableHeader = ref({
  id: "Id",
  data: "Data e Ora",
  rating: "Rating",
  esitoOperazione: "Esito",
  puntiDiTarget: "Punti di Target",
  puntiDiStop: "Punti di Stop",
  rischioRendimento: "Rischio/Rendimento",
  target: "Target",
  detail: "Dettaglio",
});

// const operationList = ref([
//   { id: "1", data: "13/10/2022", rating: "Rating 4", stop: "Si", target: "No" },
// ]);

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
  getOperations();
  // //Get the button
  // let mybutton = document.getElementById("btn-back-to-top");

  // // When the user scrolls down 20px from the top of the document, show the button
  // window.onscroll = function () {
  //   scrollFunction();
  // };

  // function scrollFunction() {
  //   if (
  //     document.body.scrollTop > 20 ||
  //     document.documentElement.scrollTop > 20
  //   ) {
  //     if (mybutton) mybutton.style.display = "block";
  //   } else {
  //     if (mybutton) mybutton.style.display = "none";
  //   }
  // }
  //console.log(data);
  //console.log(data.datasets[0].data);
});

function getOperations() {
  OperationsService.getOperations().then((response) => {
    isLoading.value = true;
    tableVisibility.value = false;
    operationList.value = response.data;
    //operationPagedList.value = operationList.value;
    setTimeout(() => {
      isLoading.value = false;
      if (response.data.length !== 0) {
        lastOperationAdded.value = operationList.value.slice(-1);
        tableVisibility.value = true;
      } else {
        tableVisibility.value = false;
        alertTableEmpty.value = true;
      }
    }, 1000);
    isMounted.value = true;
    getWinRate();
  });
}

function getWinRate() {
  //getOperations();
  let targetCount = 0;
  //let stopCount = 0;
  let winRate = 0;
  operationList.value.forEach((el) => {
    if (el.result == "Target") {
      targetCount = targetCount + 1;
    }
  });
  //console.log(operationList.value);
  winRate = (targetCount / operationList.value.length) * 100;
  data.datasets[0].data.push(winRate, 100 - winRate);
  console.log(data.datasets[0]);
  rateWin.value = parseInt(winRate.toFixed());
}

function getTotalnetPoints() {
  let totalTargetPoints = 0;
  let totalStopPoints = 0;
  operationList.value.forEach((el) => {
    totalTargetPoints = totalTargetPoints + el.targetPoints;
    totalStopPoints = totalStopPoints + el.stopPoints;
  });
  return totalTargetPoints - totalStopPoints;
}

function convertDate(dateString: string) {
  var p = dateString.split(/\D/g);
  return [p[2], p[1], p[0]].join("-");
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

// When the user clicks on the button, scroll to the top of the document
// if (mybutton) {
//   mybutton.addEventListener("click", backToTop);
// }
</script>

<template>
  <div class="row row-cols-1 row-cols-md-2 g-4 margin-row">
    <div class="col">
      <div class="card h-100 border-primary mb-3 asd">
        <i
          class="bi bi-plus-circle text-primary text-center"
          style="font-size: 100px; cursor: pointer"
          @click="goToAddOperation"
        ></i>
        <!-- <img src="../assets/back_img_2.png" class="card-img-top img" alt="..."> -->
        <div class="card-body pt-5">
          <h5 class="card-title">Aggiungi operazione</h5>
          <p class="card-text">
            Clicca sull'icona per aggiungere una nuova operazione (navigazione
            alla pagina dedicata).
          </p>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100 border-info mb-3 asd">
        <!-- <i
          class="bi bi-graph-up text-info text-center"
          style="font-size: 100px"
        ></i> -->
        <div class="d-flex justify-content-center">
          <Doughnut
            v-if="isMounted"
            id="chart"
            class="chart justify-content-center"
            :data="data"
            :options="options"
          ></Doughnut>
        </div>

        <!-- <img src="../assets/back_img_3.png" class="card-img-top img" alt="..."> -->
        <div class="card-body">
          <h5 class="card-title">Grafico di riepilogo</h5>
          <p class="card-text">
            Grafico che rappresenta il win rate - percentuale di vincita
            (rapporto tra operazioni chiuse a target e operazioni chiuse a
            stop).
          </p>
          <div class="d-flex justify-content-center">
            <h1 class="pt-3">{{ rateWin }}%</h1>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100 border-warning mb-3 asd">
        <i
          class="bi bi-trophy text-warning text-center"
          style="font-size: 100px"
        ></i>
        <!-- <img src="../assets/back_img_2.png" class="card-img-top img" alt="..."> -->
        <div class="card-body pt-5">
          <h5 class="card-title">Punti netti</h5>
          <p class="card-text">
            Questo valore indica la differenza tra i punti di target ed i punti
            di stop.
          </p>
          <h1 class="text-warning text-center pt-5">
            {{ getTotalnetPoints() }} Punti
          </h1>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100 border-success mb-3 asd">
        <i
          class="bi bi-cloud-arrow-up text-success text-center"
          style="font-size: 100px"
        ></i>
        <!-- <img src="../assets/back_img_3.png" class="card-img-top img" alt="..."> -->
        <div class="card-body pt-3">
          <h5 class="card-title">Ultima operazione aggiunta</h5>
          <p class="card-text">
            Questa è l'ultima operazione che è stata aggiunta nel diario del
            trading.
          </p>
          <table
            v-if="tableVisibility && !isLoading"
            class="table table-responsive align-middle mt-5"
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
                    class="mx-1 btn btn-outline-success"
                    @click="goToDetails(operation.id)"
                  >
                    <i class="bi bi-arrow-right"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex justify-content-center">
            <div
              v-if="isLoading === true"
              class="spinner-border text-primary"
              style="width: 3rem; height: 3rem"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="card margin-row">
    <h3 class="fw-bold card-title mt-4 mb-4 d-flex justify-content-center">
      Dashboard
    </h3>
    <div class="card-body">
      <div class="row">
        <div class="mt-0 pt-3 d-flex justify-content-center">
          <button
            type="button"
            class="fw-bold ms-3 btn btn-outline-primary"
            @click="goToAddOperation"
          >
            Inserisci Operazione
          </button>
        </div>
      </div>
    </div>
  </div> -->
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
.asd {
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
</style>
