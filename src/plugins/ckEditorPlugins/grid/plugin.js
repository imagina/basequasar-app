import gridModal from 'src/plugins/ckEditorPlugins/grid/dialog'

class PluginGrid {
  load(CKEDITOR) {
    CKEDITOR.plugins.add('btgrid', {
      requires: 'widget,dialog',
      //icons: 'btgrid',
      init: function (editor) {
        var maxGridColumns = 12;

        //Load Modal
        gridModal.load(CKEDITOR)

        // Add widget
        editor.widgets.add('btgrid',
          {
            button: 'Insert Grid',
            allowedContent: 'div(!btgrid);div(!row,!row-*);div(!col-*-*);div(!content)',
            requiredContent: 'div(btgrid)',
            parts: {
              btgrid: 'div.btgrid',
            },
            editables: {
              content: '',
            },
            template:
              '<div class="btgrid">' +
              '</div>',
            dialog: 'btgrid',
            defaults: {
              //colCount: 2,
              rowCount: 1
            },
            // Before init.
            upcast: function (element) {
              return element.name == 'div' && element.hasClass('btgrid');
            },
            // initialize
            // Init function is useful after copy paste rebuild.
            init: function () {
              var rowNumber = 1;
              var rowCount = this.element.getChildCount();
              for (rowNumber; rowNumber <= rowCount; rowNumber++) {
                this.createEditable(maxGridColumns, rowNumber);
              }
            },
            // Prepare data
            data: function () {
              if (this.data.colCount && this.element.getChildCount() < 1) {
                var colCount = this.data.colCount;
                var rowCount = this.data.rowCount;
                var row = this.parts['btgrid'];
                for (var i = 1; i <= rowCount; i++) {
                  this.createGrid(colCount, row, i);
                }
              }
            },
            // Create grid
            createGrid: function (colCount, row, rowNumber) {
              var content = '<div class="grid grid-cols-1 md:grid-cols-'+colCount+'">';
              for (var i = 1; i <= colCount; i++) {
                content = content + '  <div class="content">' +
                '<p>Col ' + i + ' content area</p>' +
                '</div>'
              }
              content = content + '</div>';
              row.appendHtml(content);
              this.createEditable(colCount, rowNumber);
            },
            // Create editable.
            createEditable: function (colCount, rowNumber) {
              for (var i = 1; i <= colCount; i++) {
                this.initEditable('content' + rowNumber + i, {
                  selector: '.md\\:grid-cols-'+colCount+ ' > div:nth-child('+i+')'
                });
              }
            }
          }
        );
      },
      onLoad: function (event) {
        /* tailwind */
        let gridCols = '.grid{display:grid;gap:2rem}'
        for (var i = 1; i <= 13; i++) {
          gridCols = gridCols + `.md\\:grid-cols-${i}{grid-template-columns: repeat(${i}, 1fr)}` + 
          `.grid-cols-${i}{grid-template-columns: repeat(${i}, 1fr)}`
        }
        //Add styles
        CKEDITOR.addCss(
          '*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}' +
          '.btgrid{padding:5px;margin:10px auto;background:#eee;border-radius:8px;border:1px solid #ddd;box-shadow:0 1px 1px #fff inset,0 -1px 0 #ccc inset}' +
          '.content{box-shadow:0 1px 1px #ddd inset;border:1px solid #ccc;padding:0 5px;border-radius:5px;background:#fff;min-height:5em}' +
          ':after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}' +
          gridCols
        )
        //Add content to icon
        CKEDITOR.on("instanceReady", function (event) {
          var this_instance = document.getElementById(event.editor.id + '_toolbox');
          var this_button = this_instance.querySelector('.cke_button__btgrid');
          if (typeof this_button != 'undefined') {
            this_button.innerHTML = '<div id="iconToolbarGrid" class="btn-content-toolbar"></div>';
          }
        });
      },
    });
  }
}

//Export
const pluginGrid = new PluginGrid()
export default pluginGrid
export {pluginGrid}
