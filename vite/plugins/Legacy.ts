import legacy from "@vitejs/plugin-legacy";

export default function Legacy() {
  return legacy({
    targets: ["Chrome 63"],
    additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    modernPolyfills: true
  });
}
