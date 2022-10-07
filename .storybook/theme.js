import { create } from '@storybook/theming';

export const Themes = {
  manager: create({
    base: 'light',
    brandTitle: 'Gov Standard UI - Universal UI Library',
    brandUrl: 'https://github.com/strelok2012/gov-standard-ui',
    brandImage: 'https://raw.githubusercontent.com/strelok2012/gov-standard-ui/main/docs/resources/logo-github.svg'
  }),
  docs: create({
    base: 'light',
    fontBase: 'Work Sans, sans-serif'
  })
};
