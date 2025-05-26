import SimpleButtonModal from 'src/plugins/ckEditorPlugins/simpleButton/dialogs/simpleButton.js';

class PluginSimpleButton {
  load(CKEDITOR) {
    // Cargar el diálogo primero
    const simpleButtonModal = new SimpleButtonModal();
    simpleButtonModal.load(CKEDITOR);

    // Registrar el plugin
    CKEDITOR.plugins.add('simplebutton', {
      requires: 'dialog',
      icons: 'simplebutton',
      init: function (editor) {
        editor.addCommand(
          'simpleButton',
          new CKEDITOR.dialogCommand('simpleButtonDialog')
        );

        editor.ui.addButton('SimpleButton', {
          label: 'Insert Button',
          command: 'simpleButton',
          icon: this.path + 'images/simplebutton.png',
          toolbar: 'insert',
        });
      },
    });
  }
}

const pluginSimpleButton = new PluginSimpleButton();
export default pluginSimpleButton;
