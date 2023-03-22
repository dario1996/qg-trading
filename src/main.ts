import "bootstrap/dist/css/bootstrap.min.css";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import TradingDiaryLogin from "./components/tradingDiaryUsers/TradingDiaryLogin.vue";
import TradingDiaryRegister from "./components/tradingDiaryUsers/TradingDiaryRegister.vue";
import OperationsSummary from "./components/tradingOperationStandard/OperationsSummary.vue";
import AddOperation from "./components/tradingOperationStandard/AddOperation.vue";
import OperationDetails from "./components/tradingOperationStandard/OperationDetails.vue";
import HomeDashboard from "./components/tradingOperationStandard/HomeDashboard.vue";
import EditOperation from "./components/tradingOperationStandard/EditOperation.vue";
import AddOperationNews from "./components/tradingOperationNews/AddOperationNews.vue";
import OperationsSummaryNews from "./components/tradingOperationNews/OperationSummaryNews.vue";
import EditOperationNews from "./components/tradingOperationNews/EditOperationNews.vue";
import OperationDetailsNews from "./components/tradingOperationNews/OperationDetailsNews.vue";
import App from "./App.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: TradingDiaryLogin },
    { path: "/register", component: TradingDiaryRegister },
    { path: "/dashboard", component: HomeDashboard },
    { path: "/operation/add", component: AddOperation },
    { path: "/operation/add/news", component: AddOperationNews },
    { path: "/operations/news", component: OperationsSummaryNews },
    { path: "/operations", component: OperationsSummary },
    {
      path: "/operation/details/:id",
      name: "Detail",
      component: OperationDetails,
      props: true,
    },
    {
      path: "/operation/edit/:id",
      name: "Edit",
      component: EditOperation,
      props: true,
    },
    {
      path: "/operation/edit/news/:id",
      name: "EditNews",
      component: EditOperationNews,
      props: true,
    },
    {
      path: "/operation/details/news/:id",
      name: "DetailNews",
      component: OperationDetailsNews,
      props: true,
    },
  ],
});
const app = createApp(App);

app.use(router);

app.mount("#app");
