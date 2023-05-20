<template>
  <div>
    <div class="webgl" ref="threeScene">
      <TresCanvas>
        <TresGroup>
          <TresPerspectiveCamera :position="[0, 0, 6]" />
        </TresGroup>
      </TresCanvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTweakPane } from "@tresjs/cientos";
import { TresCanvas, useRenderLoop } from "@tresjs/core";
import { useParallax, useWindowSize } from "@vueuse/core";
import { BasicShadowMap, Group, PerspectiveCamera } from "three";
const { onLoop } = useRenderLoop();
const { width, height } = useWindowSize();
const { pane } = useTweakPane();
const threeScene = ref();
const { roll, tilt, source } = useParallax(threeScene);

// camera and scroll
const scrollY = ref<number>();
const camera = ref<PerspectiveCamera>();
const cameraGroup = ref<Group>();

const gl = {
  alpha: true,
  shadowMapType: BasicShadowMap,
};
</script>

<style scoped>
.section {
  display: flex;
  align-items: center;
  height: 100vh;
  position: relative;
  font-family: "Cabin", sans-serif;
  color: #ffeded;
  text-transform: uppercase;
  font-size: 7vmin;
  padding-left: 10%;
  padding-right: 10%;
}

section:nth-child(odd) {
  justify-content: flex-end;
}

.webgl {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  outline: none;
}
</style>
