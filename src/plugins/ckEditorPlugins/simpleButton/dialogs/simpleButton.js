class SimpleButtonModal {
  constructor() {
    this.defaultBtn = {
      text: 'hello world',
      url: '',
      className: 'btn btn-primary',
      style: '',
    };
  }

  load(CKEDITOR) {
    CKEDITOR.dialog.add('simpleButtonDialog', (editor) => {
      let btn = { ...this.defaultBtn };

      const createButtonElement = (withUrl = false) => {
        const element = new CKEDITOR.dom.element('a');

        if (btn.text) {
          element.setText(btn.text);
        }

        if (btn.className) {
          element.setAttribute(
            'class',
            `button-custom-ckeditor ${btn.className}`
          );
        }
        if (withUrl && btn.url) {
          element.setAttribute('href', btn.url);
        }

        if (btn.style) {
          element.setAttribute('style', btn.style);
        }

        return element;
      };

      const updatePreview = function (contextDialog) {
        const contextContainer = document.getElementById(
          'button-preview-dialog'
        );
        if (!contextContainer) return;

        contextContainer.innerHTML = '';

        const buttonPreview = createButtonElement(false);
        contextContainer.appendChild(buttonPreview.$);
      };

      return {
        title: 'Bootstrap Button',
        minWidth: 400,
        minHeight: 200,
        contents: [
          {
            id: 'bootstrap-button',
            label: 'Button Settings',
            elements: [
              {
                type: 'text',
                id: 'button-text',
                label: 'Text',
                default: this.defaultBtn.text,
                setup: function () {
                  this.setValue(btn.text);
                },
                commit: function () {
                  btn.text = this.getValue();
                },
                onChange: function () {
                  btn.text = this.getValue();
                  updatePreview(this.getDialog());
                },
              },
              {
                type: 'text',
                id: 'button-url',
                label: 'URL',
                default: this.defaultBtn.url,
                setup: function () {
                  this.setValue(btn.url);
                },
                commit: function () {
                  btn.url = this.getValue();
                },
                onChange: function () {
                  btn.url = this.getValue();
                  updatePreview(this.getDialog());
                },
              },
              {
                type: 'text',
                id: 'button-classes',
                label: 'Class',
                default: this.defaultBtn.className,
                setup: function () {
                  this.setValue(btn.className);
                },
                commit: function () {
                  btn.className = this.getValue();
                },
                onChange: function () {
                  btn.className = this.getValue();
                  updatePreview(this.getDialog());
                },
              },
              {
                type: 'textarea',
                id: 'button-style',
                label: 'Style',
                setup: function () {
                  this.setValue(btn.style);
                },
                commit: function () {
                  btn.style = this.getValue();
                },
                onChange: function () {
                  btn.style = this.getValue();
                  updatePreview(this.getDialog());
                },
              },
              {
                type: 'html',
                id: 'preview-container',
                html: `<div
                         id="button-preview-dialog"
                         style="display: inline-block;
                                text-align: center;
                                box-sizing: border-box;
                                background-color: buttonface;
                                padding-block: 1px;
                                padding-inline: 6px;
                                border-width: 2px;
                                border-style: outset;">
                      </div>`,
                onLoad: function () {
                  // Inicializar vista previa cuando esté lista
                  updatePreview(this.getDialog());
                },
              },
            ],
          },
        ],
        onOk: function () {
          this.commitContent();
          editor.insertElement(createButtonElement(true));
          btn = {
            text: 'hello world',
            url: '',
            className: 'btn btn-primary',
            style: '',
          };
        },
      };
    });
  }
}

export default SimpleButtonModal;
