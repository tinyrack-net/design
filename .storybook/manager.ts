import { addons, type State } from 'storybook/manager-api';

const cleanCanvasStoryIds = new Set(['foundations-colors--reference']);

addons.setConfig({
  layoutCustomisations: {
    showPanel(state: State, defaultValue: boolean) {
      if (cleanCanvasStoryIds.has(state.storyId)) {
        return false;
      }

      return defaultValue;
    },
  },
});
