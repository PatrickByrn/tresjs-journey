// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true,
  },
  ssr: false,
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("Tres") && tag !== "TresCanvas",
    },
  },
});
