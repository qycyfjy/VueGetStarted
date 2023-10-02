<script setup>
import { ref } from 'vue';

class TodoItem {
    static nextTodoId = 1;
    constructor(content) {
        this.id = Math.ceil(Math.random() * 10000);
        this.content = content;
    }
}

let todoItems = ref([]);
let todo = ref("");

let addNewTodo = () => {
    if (todo.value.length != 0) {
        todoItems.value.push(new TodoItem(todo.value));
        todo.value = "";
    }
}

let removeTodoAt = (idx) => {
    todoItems.value.splice(idx, 1);
}
</script>

<template>
    <div>
        <input type="text" v-model="todo" @keypress.enter="addNewTodo">
        <button @click="addNewTodo">Create</button>
    </div>
    <div>
        <ul>
            <template v-for="(todoItem, i) in todoItems" :key="todoItem.id">
                <li>
                    <span>{{ todoItem.content }}</span>
                    <button @click="removeTodoAt(i)">Delete</button>
                </li>
            </template>
        </ul>
    </div>
</template>

<style></style>