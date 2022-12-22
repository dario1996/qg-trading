<template>
  <nav class="navbar navbar-dark navbar-expand-lg bg-dark fixed-top">
    <div class="container-fluid">
      <!-- <a class="navbar-brand" href="#">Trading Diary</a> -->
      <img src="../assets/logo_app.png" width="150px" height="65px"/>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active fw-bold" aria-current="page" href="/dashboard"
              >Dashboard</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link active fw-bold" aria-current="page" href="/operation/add"
              >Home</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link active fw-bold" aria-current="page" href="/operations"
              >Operazioni</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
