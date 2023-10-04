<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import Modal from './Modal.vue';
import SplitPanel from './SplitPanel.vue';
import CFB from 'cfb';

import { fixString, hexDump, a2ab } from './helper';

interface Entry {
    name: string,
    size: number,
    content: CFB.CFB$Blob,
};

let inputFileRef: Ref<HTMLInputElement | null> = ref(null);
let file: Ref<File | null> = ref(null);
let isLoading = ref(false);
let entries: Ref<Array<Entry>> = ref(new Array());
let currentSelectedEntry: Ref<Entry | null> = ref(null);
let currentBlob: Ref<Blob | null> = ref(null);
let isViewAsImage = ref(true);
const imagePreview = computed(() => {
    if (currentBlob.value !== null) {
        return URL.createObjectURL(currentBlob.value);
    }
});

const hexPreview = computed(() => {
    if (currentBlob.value !== null) {
        return hexDump(a2ab(currentSelectedEntry.value!.content));
    }
});

const processFile = (cfb: CFB.CFB$Container) => {
    let rlen = cfb.FullPaths[0].length;
    cfb.FileIndex.forEach((file, index) => {
        switch (file.type) {
            case 5:
                break;
            case 2:
                entries.value.push({
                    name: fixString(cfb.FullPaths[index].slice(rlen)),
                    size: file.size,
                    content: file.content,
                });
                break;
        }
    })
    isLoading.value = false;
};

const chooseFile = () => {
    isLoading.value = true;
    let files = inputFileRef.value?.files!;
    file.value = files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
        let data = e.target?.result!;
        let cfb = CFB.read(data as string, { type: 'binary' });
        processFile(cfb);
    };
    reader.readAsBinaryString(file.value!);
};

const downloadFile = (entry: Entry) => {
    currentSelectedEntry.value = entry;
    currentBlob.value = new Blob([a2ab(entry.content)], { type: "application/octet-stream" });
};
</script>

<template>
    <div class="cfb">
        <Teleport to="body">
            <Modal :show="isLoading">
                <template #body>
                    LOADING...
                </template>
            </Modal>
        </Teleport>
        <input type="file" name="eiffile" accept=".eif" ref="inputFileRef" @change="chooseFile">
        <span v-if="file">{{ file?.size }} kb</span>
        <SplitPanel orientation="horizontal">
            <template #left>
                <div>
                    <ul class="scrollable">
                        <li v-for="entry in entries">
                            <a style="cursor: pointer;" @click.prevent="downloadFile(entry)">{{ entry.name }}</a>
                        </li>
                    </ul>
                </div>
            </template>
            <template #right>
                <div class="preview">
                    <div class="row">
                        <div style="width: 50%;">
                            <input type="radio" name="image" :value="true" v-model="isViewAsImage">
                            <label for="image">View As Image</label>
                        </div>
                        <div style="width: 50%;">
                            <input type="radio" name="hex" :value="false" v-model="isViewAsImage">
                            <label for="hex">View As Hex</label>
                        </div>
                    </div>
                    <img v-if="isViewAsImage" :src="imagePreview" alt="">
                    <pre v-else>{{ hexPreview }}</pre>
                </div>
            </template>
        </SplitPanel>
    </div>
</template>

<style scoped>
.cfb {
    all: initial;
}

.preview {
    margin: 0 0 0 30px;
}

.row {
    display: flex;
}

.scrollable {
    overflow-y: auto;
    max-height: 100vh;
    text-align: left;
}
</style>