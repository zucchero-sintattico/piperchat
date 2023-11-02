<template>
  <q-page-container padding>
    <q-page>
      <div class="empty-state">
        <p>Ops, looks like there is nothing here yet 😅</p>
      </div>
    </q-page>
  </q-page-container>
</template>

<style scoped>
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Use 100vh instead of 100% to ensure it's 100% of the viewport height */
}

.empty-state p {
  text-align: center;
  font-size: 18px;
  color: #777; /* Adjust color as needed */
}
</style>
