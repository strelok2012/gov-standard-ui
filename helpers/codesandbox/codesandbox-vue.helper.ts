import lernaJson from '../../lerna.json';
import { generateCodeSandboxLink } from './codesandbox.helper';

export function generateVueCodeSandboxLink(options) {
  const { components, extensions, code, dependencies } = options;
  const html = `<div class="app" id="app"></div>`;

  const previewCode = `<template>${code}
</template>

<script>
import { ${components.join(', ')} ${components.length > 0 && extensions.length > 0 ? ', ' : ''}${extensions.join(
    ', '
  )} } from '@gov-standard-ui/vue';
import '@gov-standard-ui/vue/dist/gov-standard-ui.css';
${[...extensions, ''].join('(); \n')}
export default {
  name: "App",
  components: { ${components.join(', ')} }
};
</script>

`;

  const demoCode = `
import { createApp } from 'vue';
import App from './App.vue';
import './index.css';

createApp(App).mount('#app')
`.trim();

  const extraFiles = {
    'App.vue': {
      content: `${previewCode}
<style>
</style>`
    }
  };

  const projectDependencies = {
    ...dependencies,
    vue: '^3.2.33',
    '@gov-standard-ui/vue': `${lernaJson.version}`
  };

  const devDependencies = {
    '@vue/cli-plugin-babel': '~4.5.0',
    '@vue/cli-plugin-eslint': '~4.5.0',
    '@vue/cli-service': '~4.5.0',
    '@vue/compiler-sfc': '^3.0.0-0'
  };

  const packageJson = {
    scripts: {
      serve: 'vue-cli-service serve'
    },
    babel: {
      presets: ['@vue/cli-plugin-babel/preset']
    }
  };

  const { url } = generateCodeSandboxLink({
    html,
    demoCode,
    dependencies: projectDependencies,
    devDependencies,
    packageJson,
    publicFolder: 'public/',
    extraFiles
  });

  return { url, content: previewCode };
}
