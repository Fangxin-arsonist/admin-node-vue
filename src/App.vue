<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
  .app-container .filter-container .el-button--medium {
    padding: 10px 6px !important;
  }
  .app-container .filter-container .el-form-item{
    margin-bottom: 0 !important;
  }
  .app-container .filter-container .queryCon {
    text-align: left;
  }
</style>
