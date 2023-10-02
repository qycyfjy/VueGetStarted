<script setup lang="ts">
import Home from './components/Home.vue';
import NoisePage from './components/NoisePage.vue';
import TodoList from './components/TodoList.vue';
import EmoticonPage from './components/EmoticonPage.vue';
import Modal from './components/Modal.vue';
import { computed, ref } from 'vue';

const routes = {
  "/": Home,
  "/emoticon": EmoticonPage,
  "/noise": NoisePage,
  "/todo": TodoList,
};

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
  }
  return {};
})

const showModal = ref(false);
</script>

<template>
  <div class="main">
    <div class="container">
      <div class="row">
        <button @click="showModal = true">?</button>
        <Teleport to="body">
          <Modal :show="showModal">
            <template #body>
              <p>Exploring the Following Demos</p>
            </template>
            <template #footer>
              <button style="float: right;" @click="showModal = false">close</button>
            </template>
          </Modal>
        </Teleport>
      </div>

      <div class="row">
        <a class="three columns" href="#/">Home</a>
        <a class="three columns" href="#/emoticon">Emoticon</a>
        <a class="three columns" href="#/noise">Noise</a>
        <a class="three columns" href="#/todo">Todo</a>
      </div>
      <div class="row">
        <div class="row">
          <h1>KeepAlive</h1>
          <br>
          <KeepAlive>
            <component :is="currentView" v-bind="currentProps" />
          </KeepAlive>
        </div>
        <div class="row">
          <h3>Not KeepAlive</h3>
          <br>
          <component :is="currentView" v-bind="currentProps" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row {
  margin: 20px auto;
  text-align: center;
}
</style>
