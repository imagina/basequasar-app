class PluginEmbedModal {
    load(CKEDITOR) {
        CKEDITOR.dialog.add('simplebox', function (editor) {
            return {
                title: 'Mostrar video o publicación embebida',
                minWidth: 400,
                minHeight: 100,
                contents: [
                    {
                        id: 'info',
                        elements: [
                            {
                                id: 'value',
                                type: 'text',
                                label: 'Link',
                                width: '100%',
                                setup: function (widget) {
                                    this.setValue(widget.data.value);
                                },
                                commit: function (widget) {
                                    widget.setData('value', this.getValue());
                                }
                            }
                        ]
                    }
                ]
            };
        });
    };
};

//Export
const pluginEmbedModal = new PluginEmbedModal()
export default pluginEmbedModal
export {pluginEmbedModal}