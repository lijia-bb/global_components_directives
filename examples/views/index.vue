<template>
  <div>
    <div style="width: 500px; height: 300px">
      <CommonTable :tableLabel="tableLabel"></CommonTable>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableLabel: [
        {
          label: "x",
          prop: "x",
        },
        {
          label: "xx",
          prop: "xx",
        },
        {
          label: "xxx",
          prop: "xxx",
        },
        {
          label: "xxxx",
          prop: "xxxx",
        },
        {
          label: "xxxx",
          prop: "xxxx",
        },
      ],
    };
  },
};
</script>