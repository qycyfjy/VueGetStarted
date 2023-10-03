<script setup lang="ts">
import { computed, ref, Ref, watchEffect } from "vue";

const LOCAL_STORAGE_KEY = "NewTodo"

interface TodoItem {
    id: number,
    text: string,
    completed: boolean
};

const filters = {
    all: (todos: TodoItem[]) => todos,
    active: (todos: TodoItem[]) => todos.filter(todo => !todo.completed),
    completed: (todos: TodoItem[]) => todos.filter(todo => todo.completed),
};
type Filter = keyof typeof filters;

const todos: Ref<Array<TodoItem>> = ref(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]"));
const currentFilter: Ref<Filter> = ref("all");
const filteredTodos = computed(() => {
    return filters[currentFilter.value](todos.value);
});
const remainingTodosCount = computed(() => {
    return filters.active(todos.value).length;
});
const currentEditedTodoItem: Ref<TodoItem | null> = ref(null);

watchEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos.value));
});

const addNewTodoItem = (e: KeyboardEvent) => {
    const element = e.target as HTMLInputElement;
    const value = element.value.trim();
    if (value.length != 0) {
        todos.value.push({
            id: Date.now(),
            text: value,
            completed: false,
        });
        element.value = "";
    }
};

const toggleComplete = (todo: TodoItem) => {
    todo.completed = !todo.completed;
}

const toggleTo = (filter: Filter) => {
    currentFilter.value = filter;
};

const removeTodoItem = (todo: TodoItem) => {
    todos.value.splice(todos.value.indexOf(todo), 1);
};


</script>

<template>
    <h1>TODO</h1>
    <input type="text" autofocus @keyup.enter="addNewTodoItem">
    <div v-show="todos.length != 0">
        <ul class="todo-list">
            <li v-for="todo in filteredTodos" :key="todo.id" :class="{ completed: todo.completed }">
                <input type="checkbox" v-model="todo.completed">
                <label>{{ todo.text }}</label>
                <button class="remove-todo" @click="removeTodoItem(todo)"></button>
            </li>
        </ul>
    </div>
    <div v-show="todos.length != 0">
        <span>
            <strong>{{ remainingTodosCount }}</strong>
            <span>{{ remainingTodosCount == 1 ? " item" : " items" }}</span>
        </span>
        <ul class="filters">
            <li><a @click.prevent="toggleTo('all')">all</a></li>
            <li><a @click.prevent="toggleTo('active')">active</a></li>
            <li><a @click.prevent="toggleTo('completed')">completed</a></li>
        </ul>
    </div>
</template>

<style>
.todo-list {
    list-style: none;
}

.todo-list li label {
    word-break: break-all;
    padding: 15px 15px 15px 60px;
    display: inline;
    line-height: 1.2;
    transition: color 0.4s;
    font-weight: 400;
    color: #484848;
}

.todo-list li.completed label {
    color: yellowgreen;
    text-decoration: line-through;
}

.todo-list li .remove-todo {
    position: relative;
    top: 0;
    left: 10px;
    bottom: 0;
    text-align: center;
    width: 40px;
    height: 40px;
    margin: auto 0;
    font-size: 30px;
    color: #949494;
    transition: color 0.2s ease-out;
}

.todo-list li .remove-todo:hover,
.todo-list li .remove-todo:focus {
    color: #C18585;
}

.todo-list li .remove-todo:after {
    content: '×';
    display: block;
    height: 100%;
    line-height: 1.1;
}

.filters {
    margin: 0;
    padding: 0;
    list-style: none;
    position: absolute;
    right: 0;
    left: 0;
}

.filters li {
    display: inline;
}

.filters li a {
    margin: 3px;
    padding: 3px 7px;
    border: 1px solid transparent;
    border-radius: 3px;
    cursor: pointer;
}

.filters li a:hover {
    border-color: cadetblue;
}
</style>