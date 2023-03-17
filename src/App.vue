<template>
  <TopBar />
  <div class="flex-page">
    <div class="col-md-12" style="padding-right: 20px; padding-left: 20px">
      <RouterView></RouterView>
      <!-- <a id="btn-back-to-top" @click="topFunction()">
        <i class="bi bi-arrow-up-circle-fill"></i>
      </a> -->
      <a id="btn-back-to-top" @click="backToTop()">
        <i class="bi bi-arrow-up-circle-fill fs-1 text-warning"></i>
      </a>
    </div>
    <BottomBar />
  </div>
</template>

<script setup lang="ts">
import TopBar from "./UI/TopBar.vue";
import BottomBar from "./UI/BottomBar.vue";
import { onMounted } from "vue";

onMounted(() => {
  let mybutton = document.getElementById("btn-back-to-top");

  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      if (mybutton) mybutton.style.display = "block";
    } else {
      if (mybutton) mybutton.style.display = "none";
    }
  }
});

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
</script>

<style>
.flex-page {
  display: flex;
  min-height: calc(100vh - 1px);
  flex-direction: column;
  justify-content: space-between;
}

#btn-back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: none;
  cursor: pointer;
}
</style>
