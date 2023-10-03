<script setup lang="ts">
import { computed, ref } from 'vue';

interface TreeData {
    name: string,
    children?: Array<TreeData>,
}

const props = defineProps<{
    model: TreeData
}>();

const emits = defineEmits(['changeType']);

const isExpand = ref(false);
const dataRef = ref(props.model);

const isNonLeaf = computed(() => {
    return dataRef.value.children && dataRef.value.children.length;
});

const toggle = () => {
    isExpand.value = !isExpand.value;
}

const addChild = () => {
    if (isNonLeaf.value) {
        props.model.children!.push({ name: "new item" });
    } else {
        props.model.children = [{ name: "new item" }]
        isExpand.value = true;
    }
}

</script>

<template>
    <li>
        <div :class="{ bold: isNonLeaf }" @click="toggle" @dblclick="addChild">
            {{ model.name }}
            <span v-if="isNonLeaf">[{{ isExpand ? '-' : '+' }}]</span>
        </div>
        <ul v-if="isNonLeaf" v-show="isExpand">
            <TreeView class="child" v-for="child in model.children" :model="child"></TreeView>
            <li @click="addChild">+</li>
        </ul>
    </li>
</template>

<style scoped>
li {
    text-align: left;
}

.bold {
    font-weight: bold;
}

.child {
    cursor: pointer;
}

li {
    list-style-position: outside;
}

</style>