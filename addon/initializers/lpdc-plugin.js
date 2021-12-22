import LpdcPlugin from '../lpdc-plugin';

function pluginFactory(plugin) {
  return {
    create: (initializers) => {
      const pluginInstance = new plugin();
      Object.assign(pluginInstance, initializers);
      return pluginInstance;
    },
  };
}

export function initialize(application) {
  application.register('plugin:besluit', pluginFactory(LpdcPlugin), {
    singleton: false,
  });
}

export default {
  initialize,
};
