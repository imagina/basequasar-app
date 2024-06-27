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
              var content = '<div class="row row-' + rowNumber + '">';
              for (var i = 1; i <= colCount; i++) {
                content = content + '<div class="col-xs-12 col-md-' + maxGridColumns / colCount + '">' +
                  '  <div class="content">' +
                  '    <p>Col ' + i + ' content area</p>' +
                  '  </div>' +
                  '</div>';
              }
              content = content + '</div>';
              row.appendHtml(content);
              this.createEditable(colCount, rowNumber);
            },
            // Create editable.
            createEditable: function (colCount, rowNumber) {
              for (var i = 1; i <= colCount; i++) {
                this.initEditable('content' + rowNumber + i, {
                  selector: '.row-' + rowNumber + ' > div:nth-child(' + i + ') div.content'
                });
              }
            }
          }
        );
      },
      onLoad: function (event) {
        //Add styles
        CKEDITOR.addCss(
          '*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}' +
          '.btgrid{padding:5px;margin:10px auto;background:#eee;border-radius:8px;border:1px solid #ddd;box-shadow:0 1px 1px #fff inset,0 -1px 0 #ccc inset}' +
          '.content{box-shadow:0 1px 1px #ddd inset;border:1px solid #ccc;padding:0 5px;border-radius:5px;background:#fff;min-height:5em}' +
          '.row{margin-right:-15px;margin-left:-15px;padding-bottom:5px}' +
          '.row:last-child{padding-bottom:0}' +
          '.row:after,.row:before,.btgrid:before,.btgrid:after{display:table;content:" "}' +
          '.row:after{clear:both}' +
          ':after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}' +
          '.col-md-1{width:8.33333333%}' +
          '.col-md-2{width:16.66666667%}' +
          '.col-md-3{width:25%}' +
          '.col-md-4{width:33.33333333%}' +
          '.col-md-5{width:41.66666667%}' +
          '.col-md-6{width:50%}' +
          '.col-md-7{width:58.33333333%}' +
          '.col-md-8{width:66.66666667%}' +
          '.col-md-9{width:75%}' +
          '.col-md-10{width:83.33333333%}' +
          '.col-md-11{width:91.66666667%}' +
          '.col-md-12{width:100%}' +
          '.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9{float:left;position:relative;min-height:1px;padding-right:15px;padding-left:15px}'
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
