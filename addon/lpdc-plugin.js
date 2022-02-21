import InsertArticleCommand from './commands/insert-article-command';
/**
 * Entry point for BesluitPlugin
 *
 * @module ember-rdfa-editor-besluit-plugin
 * @class BesluitPlugin
 * @constructor
 * @extends EmberService
 */
export default class LpdcPlugin {
  /**
   * Handles the incoming events from the editor dispatcher.  Responsible for generating hint cards.
   *
   * @method execute
   *
   * @param {string} hrId Unique identifier of the state in the HintsRegistry.  Allows the
   * HintsRegistry to update absolute selected regions based on what a user has entered in between.
   * @param {Array} rdfaBlocks Set of logical blobs of content which may have changed.  Each blob is
   * either has a different semantic meaning, or is logically separated (eg: a separate list item).
   * @param {Object} hintsRegistry Keeps track of where hints are positioned in the editor.
   * @param {Object} editor Your public interface through which you can alter the document.
   *
   * @public
   */
  controller;

  get name() {
    return 'lpdc';
  }

  initialize(controller) {
    this.controller = controller;
    controller.registerCommand(new InsertArticleCommand());
    controller.registerWidget({
      componentName: 'lpdc-plugin-card',
      identifier: 'lpdc-plugin/card',
      desiredLocation: 'sidebar',
    });
  }
}
