import pluginFaModal from 'src/plugins/ckEditorPlugins/ckeditorfa-fa6/dialogs/ckeditorfa.js'

class PluginFa {
	load(CKEDITOR) {
		CKEDITOR.plugins.add('ckeditorfa', {
			icons:'ckeditorfa',
			init:function(editor){
				editor.addCommand('ckeditorfa', new CKEDITOR.dialogCommand('ckeditorFaDialog', { allowedContent:'span(!fa-*)' } ));
				editor.ui.addButton('ckeditorfa', { label:'FontAwesome6 icons',command:'ckeditorfa',toolbar:'insert' });
				pluginFaModal.load(CKEDITOR)
				CKEDITOR.dialog.add('ckeditorFaDialog', pluginFaModal);
			},
		});
	}
}

const pluginFa = new PluginFa()
export default pluginFa
