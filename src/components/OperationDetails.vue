<script setup lang="ts">
import OperationsService from "@/services/OperationsService";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const operationDetails = ref<OperationDetails>();
const comments = ref("");

interface OperationDetails {
  comments: string;
  id: number;
}

onMounted(() => {
  getOperation();
});

function getOperation() {
  let opId: string | number = route.params.id as string;
  OperationsService.getOperation(parseInt(opId)).then((response) => {
    if (response.data) {
      operationDetails.value = response.data;
    }
    comments.value =
      operationDetails.value?.comments === undefined
        ? ""
        : operationDetails.value.comments;
  });
}

function goToAddOperation() {
  router.push({
    path: "/operations",
  });
}
</script>

<template>
  <div class="card margin-row asd">
    <h3 class="fw-bold card-title mt-4 mb-4 d-flex justify-content-center">
      Dettaglio operazione
    </h3>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <h3>Commenti operazione</h3>
          <label>{{ comments }}</label>
        </div>
        <div class="col-md-6">
          <h3>Screen operazione</h3>
          <div class="limit">
            <img src="../assets/back_img_2.png" />
          </div>
        </div>
        <div class="mt-0 pt-3 d-flex justify-content-center">
          <button
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
</template>
<style scoped>
.card-title-center {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 30px;
}
.margin-row {
  margin-top: 100px;
  margin-bottom: 20px;
}
.limit {
  width: 300px;
  height: 500px;
  max-height: 500px;
  overflow: hidden;
}
.asd {
  margin-top: 125px !important;
  /* margin-bottom: 75px !important; */
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}
/* .limit img {
  width: 100%;
  height: 100%;
} */
</style>
