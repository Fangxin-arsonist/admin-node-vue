<template>
  <detail :is-edit="false"/>
</template>

<script>
  import Detail from '../machine/components/Detail'

  export default {
    components: {
      Detail
    },
    name: "index",
    data() {
      return {
        loading: false
      }
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>
