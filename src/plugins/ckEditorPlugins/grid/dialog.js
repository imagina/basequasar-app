class PluginGridModal {
  load(CKEDITOR) {
    CKEDITOR.dialog.add('btgrid', function (editor) {
      return {
        title: 'Insert grid',
        minWidth: 200,
        minHeight: 80,
        onShow: function () {
          // Detect if there's a selected table.
          var selection = editor.getSelection()
          var ranges = selection.getRanges();
          var command = this.getName();

          var rowsInput = this.getContentElement('info', 'rowCount')
          var colsInput = this.getContentElement('info', 'colCount');

          if (command == 'btgrid') {
            var grid = selection.getSelectedElement();
            // Enable or disable row and cols.
            if (grid) {
              this.setupContent(grid);
              rowsInput && rowsInput.disable();
              colsInput && colsInput.disable();
            }
          }
        },
        contents: [
          {
            id: 'info',
            label: 'Info',
            accessKey: 'I',
            elements: [
              {
                id: 'colCount',
                type: 'select',
                required: true,
                label: 'Select number of columns',
                width: '80px',
                items: [
                  ['2', 2],
                  ['3', 3],
                  ['4', 4],
                  ['6', 6]
                ],
                setup: function (widget) {
                  this.setValue(widget.data.colCount);
                },
                commit: function (widget) {
                  widget.setData('colCount', this.getValue());
                }
              }
            ]
          }
        ],
      };
    });
  }
}

//Export
const pluginGridModal = new PluginGridModal()
export default pluginGridModal
export {pluginGridModal}
