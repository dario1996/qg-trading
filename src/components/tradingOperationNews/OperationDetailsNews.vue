<script setup lang="ts">
import OperationsNewsService from "@/services/OperationsNewsService";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const operationDetails = ref<OperationDetails>();
const comments = ref("");
const image = ref("");

interface OperationDetails {
  comments: string;
  image: string;
  id: number;
}

onMounted(() => {
  getOperation();
});

function getOperation() {
  let opId: string | number = route.params.id as string;
  OperationsNewsService.getOperation(parseInt(opId)).then((response) => {
    if (response.data) {
      operationDetails.value = response.data;
    }
    comments.value =
      operationDetails.value?.comments === undefined
        ? ""
        : operationDetails.value.comments;
    image.value =
      operationDetails.value?.image === undefined
        ? ""
        : operationDetails.value.image;
    console.log(operationDetails.value?.image);
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
    <h3 class="fw-bold card-title mt-4 mb-5 d-flex justify-content-center">
      Dettaglio operazione
    </h3>
    <div class="card-body">
      <div class="row">
        <div class="col-md-4">
          <h3>Commenti operazione</h3>
          <div class="pt-5">{{ comments }}</div>
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-7">
          <h3>Screen operazione</h3>
          <div class="pt-5">
            <img :src="image" class="img-fluid" />
          </div>
        </div>
        <div class="mt-0 pt-5 d-flex justify-content-center">
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
  width: 550px;
  height: 300px;
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
