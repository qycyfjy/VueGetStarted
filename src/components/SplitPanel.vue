<script setup lang="ts">
import { ref, reactive, computed, Ref } from "vue";

const props = defineProps<{ orientation?: "horizontal" | "vertical" }>();
const isVertical = computed(() => props.orientation === "vertical");
const container: Ref<HTMLElement | null> = ref(null);

const state = reactive({
    dragging: false,
    split: 30,
});

const boundSplit = computed(() => {
    const { split } = state;
    return split < 20 ? 20 : split > 80 ? 80 : split;
});

let startPosition = 0;
let startSplit = 0;

const dragStart = (e: MouseEvent) => {
    state.dragging = true;
    startPosition = isVertical.value ? e.pageY : e.pageX;
    startSplit = boundSplit.value;
};

const dragMove = (e: MouseEvent) => {
    if (state.dragging) {
        const position = isVertical.value ? e.pageY : e.pageX;
        const dposition = position - startPosition;
        const size = isVertical.value ? container.value!.offsetHeight : container.value!.offsetWidth;
        state.split = startSplit + Math.floor((dposition / size) * 100);
    }
};

const dragEnd = () => {
    state.dragging = false;
};

</script>

<template>
    <div ref="container" class="split-panel" :class="{ dragging: state.dragging, vertical: isVertical }"
        @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd">
        <div class="left" :style="{ [isVertical ? 'height' : 'width']: boundSplit + '%' }">
            <slot name="left" />
            <div class="dragger diagbg" @mousedown.prevent="dragStart"></div>
        </div>
        <div class="right" :style="{ [isVertical ? 'height' : 'width']: 100 - boundSplit + '%' }">
            <slot name="right" />
        </div>
    </div>
</template>

<style scoped>
.split-panel {
    display: flex;
    height: 100%;
    position: relative;
}

.split-panel.dragging {
    cursor: ew-resize;
}

.dragging .left,
.dragging .right {
    pointer-events: none;
}

.left,
.right {
    position: relative;
    height: 100%;
}

.left {
    border-right: 1px solid var(--border);
}

.dragger {
    position: absolute;
    z-index: 3;
    top: 0;
    bottom: 0;
    right: -5px;
    width: 2px;
    margin: 0 2px 0 2px;
    cursor: ew-resize;
}

.diagbg {
    background:
        linear-gradient(45deg, transparent 49%, black 49%, black 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, black 49%, black 51%, transparent 51%);
    background-size: 2px 2px;
}

.densebg {
    background:
        repeating-linear-gradient(45deg, transparent, transparent 2px, black 2px, black 4px),
        repeating-linear-gradient(-45deg, transparent, transparent 2px, black 2px, black 4px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
    background-position: 0 0, 0 0, 0 0;
    background-size: 2px 2px, 2px 2px, 100% 100%;
}

/* vertical */
@media (min-width: 721px) {
    .split-panel.vertical {
        display: block;
    }

    .split-panel.vertical.dragging {
        cursor: ns-resize;
    }

    .vertical .dragger {
        top: auto;
        height: 10px;
        width: 100%;
        left: 0;
        right: 0;
        bottom: -5px;
        cursor: ns-resize;
    }

    .vertical .left,
    .vertical .right {
        width: 100%;
    }

    .vertical .left {
        border-right: none;
        border-bottom: 1px solid var(--border);
    }
}
</style>