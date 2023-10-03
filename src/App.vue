<script setup lang="ts">
import Home from './components/Home.vue';
import NoisePage from './components/NoisePage.vue';
import TodoList from './components/TodoList.vue';
import EmoticonPage from './components/EmoticonPage.vue';
import NewTodo from './components/NewTodo.vue';
import TreeView from './components/TreeView.vue';
import CFB from './components/CFB.vue';
import { computed, ref } from 'vue';

const routes = {
  "/": Home,
  "/emoticon": EmoticonPage,
  "/noise": NoisePage,
  "/todo": NewTodo,
  "/treeview": TreeView,
  "/cfb": CFB,
};

const treeData = ref({
  name: "C",
  children: [
    { name: "vfcompat.dll" },
    {
      name: "ProgramData",
      children: [
        {
          name: "Microsoft",
          children: [
            { name: "VsCode" },
            { name: "Windows" }
          ]
        },
        {
          name: "NVIDIA",
          children: [
            { name: "Display.log" },
            { name: "Display.log_backup" }
          ]
        }
      ]
    },
    { name: "Users" }
  ]
});

const currentPath = ref(window.location.hash)
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash;
});
const currentView = computed(() => {
  return routes[currentPath.value.slice(1)];
});
const currentProps = computed(() => {
  let path = currentPath.value.slice(1);
  if (path === '/noise') {
    return {
      canvasWidth: 100,
      canvasHeight: 100,
      isAnimating: false,
    };
  } else if (path === '/treeview') {
    return {
      model: treeData.value
    }
  }
  return {};
})

const showModal = ref(false);
</script>

<template>
  <div class="main">
    <div class="container">
      <div class="row">
        <a class="two columns" href="#/">Home</a>
        <a class="two columns" href="#/emoticon">Emoticon</a>
        <a class="two columns" href="#/noise">Noise</a>
        <a class="two columns" href="#/todo">Todo</a>
        <a class="two columns" href="#/treeview">TreeView</a>
        <a class="two columns" href="#/cfb">CFB</a>
      </div>
      <div>
        <!-- <h3 class="row">KeepAlive</h3>
        <div class="row">
          <KeepAlive>
            <component :is="currentView" v-bind="currentProps" />
          </KeepAlive>
        </div>
        <h3 class="row">Not KeepAlive</h3> -->
        <div class="row">
          <ul v-if="currentView === TreeView">
            <component :is="currentView" v-bind="currentProps" />
          </ul>
          <component v-else :is="currentView" v-bind="currentProps" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row {
  /* margin: 20px auto; */
  text-align: center;
}
</style>
