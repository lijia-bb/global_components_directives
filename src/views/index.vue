<template>
  <div style="width: 500px; height: 800px">
    <div style="width: 500px; height: 300px" v-drag>
      <CommonTable
        :tableLabel="tableLabel"
        :tableData="tableData"
      ></CommonTable>
    </div>
  </div>
</template>
<script>
import CommonTable from "../packages/components/my_table.vue";
export default {
  components: { CommonTable },
  data() {
    return {
      tableLabel: [
        {
          label: "x",
          prop: "x",
          sortable: true,
          sortOrders: ["descending", "ascending", null],
        },
        {
          label: "xx",
          prop: "xx",
          sortable: true,
          sortOrders: ["descending", "ascending", null],
        },
        {
          label: "xxx",
          prop: "xxx",
          sortable: true,
          sortOrders: ["descending", "ascending", null],
        },
        {
          label: "xxxx",
          prop: "xxxx",
          sortable: true,
          sortOrders: ["descending", "ascending", null],
          render: (h, params) => {
            console.log(params);
            const vnodeAttr = {
              // 组件的类名  使用同 :class  语法
              class: {
                aaa: true,
              },
                on: {
                click() {
                  console.log("Clicked!!!");
                },
              },
            }
            // const vnodeAttr = {
            //   // 组件的类名  使用同 :class  语法
            //   class: {
            //     aaa: true,
            //   },
            //   // 组件的内联样式  使用同 :style  语法
            //   style: {
            //     color: "blue",
            //   },
            //   // 一个对象，包含组件所需的属性。这些属性将被传递给组件，并在组件内部作为props进行访问。
            //   props: {
            //     msg: "Hello, World!",
            //   },
            //   //一个对象，包含组件的非prop属性（例如，class、style等）。这些属性将被添加到组件的根元素上。
            //   attrs: {
            //     class: "my-class",
            //     style: { color: "red" },
            //   },
            //   // 一个对象，包含组件的事件处理程序。
            //   on: {
            //     click() {
            //       console.log("Clicked!!!");
            //     },
            //   },
            //   // 一个对象，包含组件的原生事件处理程序。与on类似，但用于监听原生DOM事件。
            //   nativeOn: {
            //     click() {
            //       console.log("Clicked!!!");
            //     },
            //   },
            //   // 一个对象，包含组件的DOM属性。
            //   domProps: {
            //     innerHTML: "Hello, World!",
            //   },
            //   // 一个对象，包含组件的作用域插槽。
            //   scopedSlots: {
            //     default: () => h("h1", null, "我是标题1"),
            //   },
            //   // 一个字符串或数组，表示组件的插槽内容
            //   slot: "slot container",
            //   // 一个字符串或数字，表示组件的唯一标识符。
            //   key: "unique-key",
            //   // 一个字符串，表示组件的引用标识符。
            //   ref: "myComp",
            //   // 一个函数，返回组件实例的数据对象。
            //   data() {
            //     return {
            //       name: "wft",
            //     };
            //   },
            //   // 一个对象，包含组件的指令。
            //   directives: [{ name: "my-directive", value: "Hello, World!" }],
            //   // 一个对象，包含组件的生命周期钩子。
            //   hooks: {
            //     created() {
            //       console.log("created!!");
            //     },
            //     mounted() {
            //       console.log("mounted!!");
            //     },
            //   },
            //   // 一个布尔值，表示是否将父组件的属性继承到子组件。
            //   inheritAttrs: true,
            //   // 一个字符串，表示组件的真实标签名。这在渲染组件时非常有用，因为它允许Vue跳过验证过程。
            //   is: "my-component",
            // };

            return h("div", vnodeAttr, params.row[params.column.prop]);
          },
        },
      ],
      tableData: [{ xxxx: "123" }],
    };
  },
  methods: {
    sortChange(column) {
      console.log(column);
    },
  },
};
</script>
