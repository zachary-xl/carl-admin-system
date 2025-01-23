import "vue-router";
import "css-vars-ponyfill";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    icon?: string;
    link?: string;
  }
}
// declare module "css-vars-ponyfill" {
//   interface cssVars {
//     watch: boolean;
//     variables: {
//       [key: string]: string | number;
//     };
//     onlyLegacy: boolean;
//   }
// }
