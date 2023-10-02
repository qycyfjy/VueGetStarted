<script setup lang="ts">
import { computed, ref, Ref } from 'vue';

const emit = defineEmits<{
    (e: 'add-tag', tagText: string): void
    (e: 'remove-tag', tagIndex: number): void
}>();

const props = defineProps({
    sourceUrl: {
        type: String,
        required: true
    },
    tagsText: {
        type: Array<String>,
        required: true,
    }
});

let tagsText = ref(props.tagsText);
let isRemoveIconsVisible: Ref<Array<boolean>> = ref(new Array(props.tagsText!.length).fill(false));
let showRemoveIcon = (idx: number) => {
    isRemoveIconsVisible.value[idx] = true;
}
let hideRemoveIcon = (index: number) => {
    isRemoveIconsVisible.value[index] = false;
}

let removeTag = (index: number) => {
    // tagsText.value.splice(index, 1);
    isRemoveIconsVisible.value.splice(index, 1);
    emit('remove-tag', index);
}

let tagText = ref("");
let addTag = () => {
    if (tagText.value.length != 0) {
        // tagsText.value.push(tagText.value);
        isRemoveIconsVisible.value.push(false);
        emit('add-tag', tagText.value);
        tagText.value = "";
    }
}

</script>

<template>
    <div class="image-container">
        <img :src="sourceUrl" alt="Image" class="image" />
        <div class="tags">
            <span v-for="(tag, index) in tagsText" :key="index" class="tag" @mouseover="showRemoveIcon(index)"
                @mouseleave="hideRemoveIcon(index)">
                {{ tag }}
                <span v-if="isRemoveIconsVisible[index]" class="remove-icon" @click="removeTag(index)"></span>
            </span>
        </div>
        <input type="text" v-model="tagText" @keypress.enter="addTag">
    </div>
</template>

<style scoped>
.image-container {
    position: relative;
    display: inline-block;
}

.image {
    width: 100px;
    height: 100px;
    object-fit: contain;
}

.tags {
    position: inherit;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 10px;
    display: flex;
}

.tag {
    display: inline-block;
    margin: 5px;
    background-color: #eee;
}

.remove-icon:before {
    content: 'x';
}

.remove-icon {
    position: relative;
    top: 0px;
    right: 0px;
    cursor: pointer;
}
</style>