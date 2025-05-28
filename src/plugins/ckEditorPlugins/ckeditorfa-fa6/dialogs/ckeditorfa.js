import proIcons from './fa6ProIcons.js';

const allIcons = [
  ...proIcons['solid'],
  ...proIcons['regular'],
  ...proIcons['light'],
  ...proIcons['thin'],
  ...proIcons['duotone'],
  ...proIcons['brands'],
];

const SOLID = 'fa-solid fa-';
const REGULAR = 'fa-regular fa-';
const LIGHT = 'fa-light fa-';
const THIN = 'fa-thin fa-';
const DUOTONE = 'fa-duotone fa-';
const BRANDS = 'fa-brands fa-';

let selectedColor = '#000000';
let selectedStyle = SOLID;
let query = '';
let selectedSize = 28;
let selectedClassName = false;

const PAGE_SIZE = 100;
let currentPage = 1;
let currentIcons = allIcons;

class PluginFaModal {
  load(CKEDITOR) {
    function setPreview() {
      if (selectedClassName) {
        const preview =
          '<span data-toggle="tooltip" data-placement="right" title="' +
          selectedClassName +
          '" style="color:' +
          selectedColor +
          ';font-size: ' +
          selectedSize +
          'px" class="' +
          selectedClassName +
          '"></span>';
        document.getElementById('ckeditor-fa-preview').innerHTML = preview;
      }
    }

    function searchIcon(val) {
      let fas = allIcons.filter((icon) => icon.includes(val));

      currentIcons = fas;
      currentPage = 1;

      if (fas.length > 0) {
        buildIcons(fas, false, currentPage);
      } else {
        document.getElementById('ckeditor-fa-icons').innerHTML =
          '<p><span style="font-size:34px" class="fa-regular fa-face-thinking"></span><br/>No Icons Found.</p>';
      }
    }

    function clear() {
      let icons = document.getElementById('ckeditor-fa-icons');
      let activeIcon = icons.getElementsByClassName('active');
      let icon = icons.getElementsByTagName('button');
      for (let i = 0; i < activeIcon.length; ++i) {
        activeIcon[i].className = activeIcon[i].className.replace('active', '');
      }
      for (let j = 0; j < icon.length; ++j) {
        icon[j].className = '';
        icon[j].style.display = '';
        //element no found
        //icon[j].getElementsByTagName('span')[0].style.color = '';
      }
    }

    function buildIcons(fas, key, page = 1) {
      document.getElementById('ckeditor-fa-icons').innerHTML = '';
      const limit = fas.length;
      const fragment = document.createDocumentFragment();

      // pagination
      const start = (page - 1) * PAGE_SIZE;
      const end = Math.min(start + PAGE_SIZE, limit);

      for (let i = start; i < end; i++) {
        const icon = fas[i];
        const s = key || selectedStyle;
        const name = icon.replace(s, '');

        const b = document.createElement('button');
        b.addEventListener('click', function () {
          let className = this.childNodes[0].getAttribute('class');
          selectedClassName = className;
          setPreview();
        });

        const span = document.createElement('span');
        span.className = icon;

        const p = document.createElement('p');
        p.innerText = name;
        b.append(span);
        b.append(p);
        fragment.append(b);
      }
      document.getElementById('ckeditor-fa-icons').append(fragment);

      // buttons pagination
      const pagination = document.createElement('div');
      pagination.style = 'text-align:center;margin:10px 0;';
      if (page > 1) {
        const prev = document.createElement('button');
        prev.innerText = 'Anterior';
        prev.onclick = () => {
          currentPage--;
          buildIcons(currentIcons, key, currentPage);
        };
        pagination.appendChild(prev);
      }
      if (end < limit) {
        const next = document.createElement('button');
        next.innerText = 'Siguiente';
        next.onclick = () => {
          currentPage++;
          buildIcons(currentIcons, key, currentPage);
        };
        pagination.appendChild(next);
      }
      document.getElementById('ckeditor-fa-icons').append(pagination);
    }

    CKEDITOR.dialog.add('ckeditorFaDialog', function (editor) {
      function faProIcons() {
        if (selectedStyle == SOLID) currentIcons = proIcons['solid'];
        if (selectedStyle == REGULAR) currentIcons = proIcons['regular'];
        if (selectedStyle == LIGHT) currentIcons = proIcons['light'];
        if (selectedStyle == THIN) currentIcons = proIcons['thin'];
        if (selectedStyle == DUOTONE) currentIcons = proIcons['duotone'];
        if (selectedStyle == BRANDS) currentIcons = proIcons['brands'];
        currentPage = 1;
        buildIcons(currentIcons, selectedStyle, currentPage);
      }

      return {
        title: 'FontAwesome6 Icons',
        minWidth: 400,
        minHeight: 480,
        resizable: false,
        contents: [
          {
            id: 'font-awesome',
            label: 'Add icon',
            elements: [
              {
                type: 'hbox',
                widths: ['50%', '50%'],
                children: [
                  {
                    type: 'text',
                    id: 'faSearch',
                    className: 'faSearch',
                    label: 'Search',
                    onKeyUp: function (e) {
                      query = e.sender.$.value;

                      if (query.length == 0) {
                        faProIcons();
                      }

                      if (query.length >= 2) {
                        searchIcon(query.toLowerCase());
                      }
                    },
                  },
                ],
              },
              {
                type: 'hbox',
                widths: ['25%', '15%', '20%', '45%'],
                children: [
                  {
                    type: 'text',
                    id: 'colorChooser',
                    className: 'colorChooser',
                    label: 'Color',
                    setup: function (widget) {
                      let color =
                        widget.data.color != '' ? widget.data.color : '';
                      this.setValue(color);
                    },
                    commit: function (widget) {
                      widget.setData('color', this.getValue());
                    },
                  },
                  {
                    type: 'button',
                    label: 'Color',
                    style: 'margin-top: 28px !important',
                    onClick: function () {
                      editor.getColorFromDialog(function (color) {
                        document
                          .getElementsByClassName('colorChooser')[0]
                          .getElementsByTagName('input')[0].value = color;
                        selectedColor = color;
                        setPreview();
                        //faProIcons();
                      }, this);
                    },
                  },
                  {
                    type: 'select',
                    id: 'size',
                    className: 'size',
                    label: 'Size (px)',
                    items: [
                      ['8'],
                      ['9'],
                      ['10'],
                      ['11'],
                      ['12'],
                      ['14'],
                      ['16'],
                      ['18'],
                      ['20'],
                      ['22'],
                      ['24'],
                      ['26'],
                      ['28'],
                      ['36'],
                      ['48'],
                      ['72'],
                      ['96'],
                    ],
                    default: '28',
                    onChange: function (api) {
                      selectedSize = this.getValue();
                      setPreview();
                    },
                  },
                  {
                    type: 'html',
                    html: '<div id="ckeditor-fa-preview"></div>',
                  },
                ],
              },
              {
                type: 'hbox',
                widths: ['14%', '14%', '14%', '14%', '14%', '14%'],
                children: [
                  {
                    type: 'button',
                    className: 'ckeditor-fa-select',
                    label: 'Solid',
                    onClick: function () {
                      if (selectedStyle != SOLID) {
                        selectedStyle = SOLID;
                        faProIcons();
                      }
                    },
                  },
                  {
                    type: 'button',
                    className: 'ckeditor-fa-select',
                    label: 'Regular',
                    onClick: function () {
                      if (selectedStyle != REGULAR) {
                        selectedStyle = REGULAR;
                        faProIcons();
                      }
                    },
                  },
                  {
                    type: 'button',
                    className: 'ckeditor-fa-select',
                    label: 'Light',
                    onClick: function () {
                      if (selectedStyle != LIGHT) {
                        selectedStyle = LIGHT;
                        faProIcons();
                      }
                    },
                  },
                  {
                    type: 'button',
                    className: 'ckeditor-fa-select',
                    label: 'Thin',
                    onClick: function () {
                      if (selectedStyle != THIN) {
                        selectedStyle = THIN;
                        faProIcons();
                      }
                    },
                  },
                  {
                    type: 'button',
                    className: 'ckeditor-fa-select',
                    label: 'Duotone',
                    onClick: function () {
                      if (selectedStyle != DUOTONE) {
                        selectedStyle = DUOTONE;
                        faProIcons();
                      }
                    },
                  },
                  {
                    type: 'button',
                    className: 'ckeditor-fa-select',
                    label: 'Brands',
                    style: 'margin-top: 0px !important',
                    onClick: function () {
                      if (selectedStyle != BRANDS) {
                        document.getElementById(
                          'ckeditor-fa-icons'
                        ).scrollTop = 0;
                        selectedStyle = BRANDS;
                        faProIcons();
                      }
                    },
                  },
                ],
              },
              { type: 'html', html: '<div id="ckeditor-fa-icons"></div>' },
            ],
          },
        ],
        onOk: function () {
          clear();
          if (selectedClassName) {
            let dialog = this,
              icon = editor.document.createElement('span');
            icon.setAttribute('class', selectedClassName);
            let style = '';
            if (dialog.getValueOf('font-awesome', 'colorChooser') != '')
              style += 'color:' + selectedColor + ';';
            if (dialog.getValueOf('font-awesome', 'size') != '')
              style += 'font-size:' + selectedSize + 'px';
            if (style) icon.setAttribute('style', style);
            icon.setAttribute('aria-hidden', 'true');
            editor.insertElement(icon);
          }
        },
        onCancel: function () {
          clear();
        },
        onLoad: function () {
          document
            .getElementsByClassName('cke_dialog_container ')[0]
            .classList.remove('cke_reset_all');
          faProIcons();
        },
        onShow: function () {
          //remove reset class
          selectedColor = '#000000';
          selectedStyle = SOLID;
          selectedSize = 28;
          selectedClassName = false;
        },
      };
    });
  }
}

//Export
const pluginFaModal = new PluginFaModal();
export default pluginFaModal;
export { pluginFaModal };
