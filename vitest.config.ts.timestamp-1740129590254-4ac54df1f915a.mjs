// vitest.config.ts
import { fileURLToPath as fileURLToPath2 } from "node:url";
import { mergeConfig, defineConfig as defineConfig2, configDefaults } from "file:///C:/Users/%E9%99%88%E5%BA%86%E8%89%B3/Desktop/code/Generate-Based-On-JSON/node_modules/vitest/dist/config.js";

// vite.config.ts
import { fileURLToPath, URL as URL2 } from "node:url";
import AutoImport from "file:///C:/Users/%E9%99%88%E5%BA%86%E8%89%B3/Desktop/code/Generate-Based-On-JSON/node_modules/unplugin-auto-import/dist/vite.js";
import { NaiveUiResolver } from "file:///C:/Users/%E9%99%88%E5%BA%86%E8%89%B3/Desktop/code/Generate-Based-On-JSON/node_modules/unplugin-vue-components/dist/resolvers.js";
import Components from "file:///C:/Users/%E9%99%88%E5%BA%86%E8%89%B3/Desktop/code/Generate-Based-On-JSON/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig } from "file:///C:/Users/%E9%99%88%E5%BA%86%E8%89%B3/Desktop/code/Generate-Based-On-JSON/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/%E9%99%88%E5%BA%86%E8%89%B3/Desktop/code/Generate-Based-On-JSON/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/%E9%99%88%E5%BA%86%E8%89%B3/Desktop/code/Generate-Based-On-JSON/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import vueDevTools from "file:///C:/Users/%E9%99%88%E5%BA%86%E8%89%B3/Desktop/code/Generate-Based-On-JSON/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/%E9%99%88%E5%BA%86%E8%89%B3/Desktop/code/Generate-Based-On-JSON/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    // 自动引入naive ui
    AutoImport({
      imports: ["vue"],
      dts: "src/auto-imports.d.ts"
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      extensions: ["vue", "tsx", "ts"],
      include: [/\.vue$/, /\.vue\?vue/, /\.tsx?$/]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL2("./src", __vite_injected_original_import_meta_url)),
      "naive-ui-es": "node_modules/naive-ui/es"
    }
  },
  optimizeDeps: {
    include: ["naive-ui"]
  }
});

// vitest.config.ts
var __vite_injected_original_import_meta_url2 = "file:///C:/Users/%E9%99%88%E5%BA%86%E8%89%B3/Desktop/code/Generate-Based-On-JSON/vitest.config.ts";
var vitest_config_default = mergeConfig(
  vite_config_default,
  defineConfig2({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      root: fileURLToPath2(new URL("./", __vite_injected_original_import_meta_url2))
    }
  })
);
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFx1OTY0OFx1NUU4Nlx1ODI3M1xcXFxEZXNrdG9wXFxcXGNvZGVcXFxcR2VuZXJhdGUtQmFzZWQtT24tSlNPTlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcXHU5NjQ4XHU1RTg2XHU4MjczXFxcXERlc2t0b3BcXFxcY29kZVxcXFxHZW5lcmF0ZS1CYXNlZC1Pbi1KU09OXFxcXHZpdGVzdC5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzLyVFOSU5OSU4OCVFNSVCQSU4NiVFOCU4OSVCMy9EZXNrdG9wL2NvZGUvR2VuZXJhdGUtQmFzZWQtT24tSlNPTi92aXRlc3QuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJ1xuaW1wb3J0IHsgbWVyZ2VDb25maWcsIGRlZmluZUNvbmZpZywgY29uZmlnRGVmYXVsdHMgfSBmcm9tICd2aXRlc3QvY29uZmlnJ1xuaW1wb3J0IHZpdGVDb25maWcgZnJvbSAnLi92aXRlLmNvbmZpZydcblxuZXhwb3J0IGRlZmF1bHQgbWVyZ2VDb25maWcoXG4gIHZpdGVDb25maWcsXG4gIGRlZmluZUNvbmZpZyh7XG4gICAgdGVzdDoge1xuICAgICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgICBleGNsdWRlOiBbLi4uY29uZmlnRGVmYXVsdHMuZXhjbHVkZSwgJ2UyZS8qKiddLFxuICAgICAgcm9vdDogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuLycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgIH0sXG4gIH0pLFxuKVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxcdTk2NDhcdTVFODZcdTgyNzNcXFxcRGVza3RvcFxcXFxjb2RlXFxcXEdlbmVyYXRlLUJhc2VkLU9uLUpTT05cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFx1OTY0OFx1NUU4Nlx1ODI3M1xcXFxEZXNrdG9wXFxcXGNvZGVcXFxcR2VuZXJhdGUtQmFzZWQtT24tSlNPTlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvJUU5JTk5JTg4JUU1JUJBJTg2JUU4JTg5JUIzL0Rlc2t0b3AvY29kZS9HZW5lcmF0ZS1CYXNlZC1Pbi1KU09OL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IHsgTmFpdmVVaVJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuaW1wb3J0IHZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgdnVlSnN4KCksXG4gICAgdnVlRGV2VG9vbHMoKSxcbiAgICAvLyBcdTgxRUFcdTUyQThcdTVGMTVcdTUxNjVuYWl2ZSB1aVxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgaW1wb3J0czogWyd2dWUnXSxcbiAgICAgIGR0czogJ3NyYy9hdXRvLWltcG9ydHMuZC50cycsXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtOYWl2ZVVpUmVzb2x2ZXIoKV0sXG4gICAgICBleHRlbnNpb25zOiBbJ3Z1ZScsICd0c3gnLCAndHMnXSxcbiAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwudHN4PyQvXSxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICduYWl2ZS11aS1lcyc6ICdub2RlX21vZHVsZXMvbmFpdmUtdWkvZXMnLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsnbmFpdmUtdWknXSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBXLFNBQVMsaUJBQUFBLHNCQUFxQjtBQUN4WSxTQUFTLGFBQWEsZ0JBQUFDLGVBQWMsc0JBQXNCOzs7QUNENFMsU0FBUyxlQUFlLE9BQUFDLFlBQVc7QUFDelksT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyx1QkFBdUI7QUFDaEMsT0FBTyxnQkFBZ0I7QUFFdkIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGlCQUFpQjtBQVIyTCxJQUFNLDJDQUEyQztBQVdwUSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxZQUFZO0FBQUE7QUFBQSxJQUVaLFdBQVc7QUFBQSxNQUNULFNBQVMsQ0FBQyxLQUFLO0FBQUEsTUFDZixLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMsZ0JBQWdCLENBQUM7QUFBQSxNQUM3QixZQUFZLENBQUMsT0FBTyxPQUFPLElBQUk7QUFBQSxNQUMvQixTQUFTLENBQUMsVUFBVSxjQUFjLFNBQVM7QUFBQSxJQUM3QyxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUlDLEtBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsTUFDcEQsZUFBZTtBQUFBLElBQ2pCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLFVBQVU7QUFBQSxFQUN0QjtBQUNGLENBQUM7OztBRHBDb04sSUFBTUMsNENBQTJDO0FBSXRRLElBQU8sd0JBQVE7QUFBQSxFQUNiO0FBQUEsRUFDQUMsY0FBYTtBQUFBLElBQ1gsTUFBTTtBQUFBLE1BQ0osYUFBYTtBQUFBLE1BQ2IsU0FBUyxDQUFDLEdBQUcsZUFBZSxTQUFTLFFBQVE7QUFBQSxNQUM3QyxNQUFNQyxlQUFjLElBQUksSUFBSSxNQUFNRix5Q0FBZSxDQUFDO0FBQUEsSUFDcEQ7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFsiZmlsZVVSTFRvUGF0aCIsICJkZWZpbmVDb25maWciLCAiVVJMIiwgIlVSTCIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsIiwgImRlZmluZUNvbmZpZyIsICJmaWxlVVJMVG9QYXRoIl0KfQo=
