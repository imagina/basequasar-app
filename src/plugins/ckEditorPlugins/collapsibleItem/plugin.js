import pluginModal from './dialogs/modal.js'

class PluginCollapsibleItem {
  //Load plugin
  load(CKEDITOR) {
    //Init method load template
    const getCollapsibleItem = this.getCollapsibleItem
    //Add plugin
    CKEDITOR.dtd.$editable.a = 1;
    CKEDITOR.plugins.add('collapsibleItem', {
      requires: 'widget',
      //icons: 'collapsibleitem',
      init: function (editor) {
        
        pluginModal.load(CKEDITOR)
        CKEDITOR.dialog.add( 'collapsibleItem', pluginModal);
        

        editor.widgets.add('collapsibleItem', {
          button: 'Insert Collapsible Item',
          template: getCollapsibleItem(),
          dialog: 'collapsibleItem',
          editables: {
            title: {
              selector: '.collapsible-item-title',
              //allowedContent: 'span strong em u;*{color}'
            },
            content: {
              selector: '.collapsible-item-body',
              //allowedContent: 'p;br;span(*)[*];ul;ol;li;strong;em;u;table(*)[*];tbody;thead;tr;td;th;hr;a;a[*];a(*)[*];img(*)[*];'
            }
          },
          //allowedContent: 'div(!collapsible-item*,panel*,collapse)[*];h4(!collapsible-item*,panel*)[*];a(!collapsible-item*,collapsed,panel*)[*];span(!glyphicon*)[*];',
          //requiredContent: 'div(collapsible-item);',
          upcast: function (element) {
            element.hasClass('collapsible-item')
          },
          init: function () {
            let title = this.element.findOne('.collapsible-item-title').getText();
            if ( title ) this.setData( 'title', title );

            let content = this.element.findOne('.collapsible-item-body').getText();				
            if ( content ) this.setData( 'content', content );
            
            let collapse = this.element.getAttribute("data-collapse");
            if ( collapse ) this.setData( 'collapse', collapse );				
          },
          data: function () {
            if (typeof this.data.title !== 'undefined') {
              this.element.findOne('.collapsible-item-title').setText(this.data.title);
            }
            if (typeof this.data.content !== 'undefined') { 
              this.element.findOne('.collapsible-item-body').setText(this.data.content)
            }

                  
            if (typeof this.data.collapse !== 'undefined') 
            {
              this.element.setAttribute("data-collapse", this.data.collapse);
              if ( this.data.collapse )
                this.element.removeAttribute( 'open' );
              else
                this.element.setAttribute( 'open' );
            }
          },
        });
      },
      onLoad: function (event) {
        //Add Styles
        CKEDITOR.addCss(
          'a.collapsible-item-title-link { display: block; }' +
          '.collapsible-item::before {font-size:10px;color:#000;content: "Tailwind collapsible element"}' +
          '.collapsible-item-heading {background-color:#f4f8ef;color:#72b73a;text-decoration:none;font-size:20px;} ' +
          '.collapsible-item-collapse {display:block;background-color:#ddd;min-height:10px;} ' +
          '.collapsible-item {padding: 8px;margin: 10px;background: #eee;border-radius: 8px;border: 1px solid #ddd;box-shadow: 0 1px 1px #fff inset, 0 -1px 0px #ccc inset;}' +
          '.collapsible-item-title, .collapsible-item-body {box-shadow: 0 1px 1px #ddd inset;border: 1px solid #cccccc;border-radius: 5px;background: #fff;}' +
          '.collapsible-item-title {margin: 0 0 8px;padding: 5px 8px;}' +
          '.collapsible-item-body {padding: 0 8px;}' +
          '.collapsible-item-title-link-text {min-width:50px;display:inline-block;min-height:20px;height:100%;}' +
          '.collapsible-item-title-link-icon {display:inline-block;float:right;}'
        );
        //Add font aweson icon
        CKEDITOR.on("instanceReady", function (event) {
          let this_instance = document.getElementById(event.editor.id + '_toolbox');
          let this_button = this_instance.querySelector('.cke_button__collapsibleitem_icon');
          if (typeof this_button != 'undefined') {
            this_button.innerHTML = '<div id="iconToolbarCollapsibleitem" class="btn-content-toolbar"></div>';
          }
        });
      }
    });
  }

  //Template
  getCollapsibleItem() {
    //style="list-style:none;cursor:pointer"
    const title = 'Title text';
    const body = 'Body Text';
    let collapsibleItem =
      '<div><details class="collapsible-item">' +
        '<summary class="collapsible-item-title" style="list-style:none;cursor:pointer" >' + 
         title +
        '</summary>' +
        '<div class="collapsible-item-body">' + body + '</div>' +
      '</details></div>'
    return collapsibleItem;
  }
}

//Export
const pluginCollapsibleItem = new PluginCollapsibleItem()
export default pluginCollapsibleItem
export {pluginCollapsibleItem}
