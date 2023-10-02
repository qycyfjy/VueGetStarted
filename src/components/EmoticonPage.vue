<script setup lang="ts">
import EmoticonDetail from './EmoticonDetail.vue';
import { computed, ref } from 'vue';
class Emoticon {
    sourceUrl: string;
    tagsText: Array<string>;

    constructor(source: string, tags: Array<string>) {
        this.sourceUrl = source;
        this.tagsText = tags;
    }

    removeTag(index: number) {
        this.tagsText.splice(index, 1);
    }

    addTag(tag: string) {
        this.tagsText.push(tag);
    }
}

let emoticons = [
    new Emoticon('imgs/a.jpg', ['惊讶', '啊']),
    new Emoticon('imgs/b.jpg', ['你', '你小子']),
];
const removeEmoticonTag = (emoticonIndex: number, tagIndex: number) => {
    if (emoticonIndex < 0 || emoticonIndex >= emoticons.length) {
        return;
    }
    emoticons[emoticonIndex].removeTag(tagIndex);
}

const addEmoticonTag = (emoticonIndex: number, tagText: string) => {
    if (emoticonIndex < 0 || emoticonIndex >= emoticons.length) {
        return;
    }
    emoticons[emoticonIndex].addTag(tagText);
}

</script>

<template>
    <template v-for="(emoticon, index) in emoticons">
        <EmoticonDetail :id="index" :source-url="emoticon.sourceUrl" :tags-text="emoticon.tagsText" @remove-tag="(tagIndex: number) => {
            removeEmoticonTag(index, tagIndex);
        }" @add-tag="(tagText: string) => {
    addEmoticonTag(index, tagText);
}" />
    </template>
</template>

<style></style>