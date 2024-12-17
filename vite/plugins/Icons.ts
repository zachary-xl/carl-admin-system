import Icons from "unplugin-icons/vite";

export default function createViteIcons() {
  return Icons({
    autoInstall: true,
    compiler: "vue3"
  });
}
