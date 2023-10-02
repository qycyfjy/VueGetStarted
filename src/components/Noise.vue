<script setup>
class Noise {
    constructor(imageData) {
        this._width = imageData.width;
        this._height = imageData.height;
        this._pixels = imageData.data;
        this._skipFrame = false;
    }

    update() {
        if (this._skipFrame) {
            this._skipFrame = false;
            return;
        }
        this._skipFrame = true;
        let n = 0;
        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                this._pixels[n++] = Math.random() * 0xFF;
                this._pixels[n++] = Math.random() * 0xFF;
                this._pixels[n++] = Math.random() * 0xFF;
                this._pixels[n++] = 0xFF;
            }
        }
    }
}

import { ref, onMounted } from 'vue';

const props = defineProps({
    isAnimating: Boolean,
    canvasWidth: {
        type: Number,
        default: 200
    },
    canvasHeight: {
        type: Number,
        default: 200
    }
});

const isAnimating = ref(props.isAnimating);
const noiseCanvasRef = ref(null);
let noiseCanvas = null;

onMounted(() => {
    noiseCanvas = noiseCanvasRef.value;
    frame();
});

let frame = () => {
    let ctx = noiseCanvas.getContext('2d');
    let imageData = ctx.createImageData(noiseCanvas.width, noiseCanvas.height);
    let noise = new Noise(imageData);
    noise.update();
    ctx.putImageData(imageData, 0, 0);
    if (isAnimating.value) {
        requestAnimationFrame(() => frame());
    }
}

let animate = () => {
    if (isAnimating.value) {
        frame();
    }
}
</script>

<template>
    <div :class="$attrs.class">
        <canvas class="noise" :width="props.canvasWidth" :height="props.canvasHeight" ref="noiseCanvasRef"></canvas>
        <br>
        <input type="checkbox" name="animating" id="is-animating" v-model="isAnimating" @change="animate">
        <label for="animating">{{ isAnimating ? "animating..." : "pause" }}</label>
    </div>
</template>

<style scoped>
.noise {
    border: 1px solid black;
}
</style>