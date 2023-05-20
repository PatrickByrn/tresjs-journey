<template>
  <div>
    <div class="webgl" ref="threeScene">
      <TresCanvas v-bind="gl">
        <TresDirectionalLight
          :position="[0, 2, 4]"
          :intensity="2"
          cast-shadow
        />
        <TresGroup ref="cameraGroup">
          <TresPerspectiveCamera ref="camera" :position="[0, 0, 6]" />
        </TresGroup>
        <TresMesh :ref="setSectionMeshes">
          <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
          <TresMeshToonMaterial
            :color="meshColor"
            :gradient-map="textureGradient"
          />
        </TresMesh>
        <TresMesh :ref="setSectionMeshes">
          <TresTorusKnotGeometry :args="[0.8, 0.35, 100, 16]" />
          <TresMeshToonMaterial
            :color="meshColor"
            :gradientMap="textureGradient"
          />
        </TresMesh>
        <TresMesh :ref="setSectionMeshes">
          <TresConeGeometry :args="[1, 2, 32]" />
          <TresMeshToonMaterial
            :color="meshColor"
            :gradientMap="textureGradient"
          />
        </TresMesh>
        <TresPoints>
          <TresBufferGeometry :position="[positions, 3]"> </TresBufferGeometry>
          <TresPointsMaterial
            :color="meshColor"
            :sizeAttenuation="true"
            :size="0.03"
          ></TresPointsMaterial>
        </TresPoints>
      </TresCanvas>
    </div>

    <section class="section">
      <h1>My Portfolio</h1>
    </section>
    <section class="section">
      <h2>My projects</h2>
    </section>
    <section class="section">
      <h2>Contact me</h2>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useTweakPane } from "@tresjs/cientos";
import { TresCanvas, useLoader, useRenderLoop } from "@tresjs/core";
import { useParallax, useWindowSize } from "@vueuse/core";
import {
  BasicShadowMap,
  Group,
  NearestFilter,
  Object3D,
  PerspectiveCamera,
  TextureLoader,
} from "three";
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

// ref of all meshes
const sectionMeshes = ref<Object3D[]>([]);
const setSectionMeshes = (el: any) => {
  if (el && !sectionMeshes.value.includes(el)) {
    sectionMeshes.value.push(el);
    console.log("added" + el);
  }
};

// Texture gradient
const textureGradient = ref();
textureGradient.value = await useLoader(TextureLoader, "3.jpg").then(function (
  response
) {
  response.magFilter = NearestFilter;
  return response;
});

// object placement logic
const objectsDistance = ref(4);
pane.addInput(objectsDistance, "value");
const generateMeshDistance = (index: number) => {
  return -objectsDistance.value * index;
};
const placeObjects = (i: number) => {
  sectionMeshes.value[i].position.setY(generateMeshDistance(i));
  if (i % 2 == 0) {
    sectionMeshes.value[i].position.setX(2);
  } else {
    sectionMeshes.value[i].position.setX(-2);
  }
};
watch(objectsDistance, async (newDistance, oldDistance) => {
  for (let i = 0; i < sectionMeshes.value?.length!; i++) {
    placeObjects(i);
  }
});

const meshColor = ref("#ffeded");
pane.addInput(meshColor, "value");

//particles
const particlesCount = ref(200);
pane.addInput(particlesCount, "value");

const positions = ref<Float32Array>();
const generateParticles = (count: number) => {
  let positions = new Float32Array(particlesCount.value * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] =
      objectsDistance.value * 0.5 -
      Math.random() * objectsDistance.value * sectionMeshes.value.length;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  return positions;
};
watch(particlesCount, (newCount, oldCount) => {
  positions.value = generateParticles(newCount);
});

onLoop(({ delta, elapsed, clock }) => {
  // I will run at every frame ~ 60FPS (depending of your monitor)
  if (sectionMeshes.value?.length) {
    for (let i = 0; i < sectionMeshes.value?.length!; i++) {
      sectionMeshes.value[i].rotation.x += delta * 0.5;
    }

    const parallaxX = tilt.value;
    const parallaxY = roll.value;

    if (
      typeof camera.value != "undefined" &&
      typeof scrollY.value != "undefined"
    ) {
      camera.value.position.y =
        -(scrollY.value / height.value) * objectsDistance.value;
    }

    if (typeof cameraGroup.value != "undefined") {
      cameraGroup.value.position.x = parallaxX;
      cameraGroup.value.position.y = parallaxY;
    }
  }
});

onMounted(() => {
  for (let i = 0; i < sectionMeshes.value?.length!; i++) {
    placeObjects(i);
  }
  positions.value = generateParticles(particlesCount.value);
  window.addEventListener("scroll", () => {
    scrollY.value = window.scrollY;
  });
});
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
