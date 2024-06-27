import embedModal from 'src/plugins/ckEditorPlugins/embed/dialog'
import { getUrlParamValue, isFacebookVideo, isFacebookPost, getInstagramId, availableUrls } from 'src/plugins/ckEditorPlugins/embed/utils';
class PluginEmbed {
    load(CKEDITOR) {
        CKEDITOR.plugins.add('simplebox', {
            requires: 'widget',

            icons: 'simplebox',

            init: function (editor) {
                embedModal.load(CKEDITOR)
                editor.widgets.add('simplebox', {

                    button: 'Mostrar video o publicación embebida',

                    template:
                        '<div class="iframe">' +
                        '</div>',

                    allowedContent: 'div(!iframe*)[*];',

                    dialog: 'simplebox',

                    upcast: function (element) {
                        return element.name == 'div' && element.hasClass('iframe');
                    },

                    init: function () {

                    },

                    data: function () {
                        const iframe = this.element.$;
                        if (this.data.value && this.data.value.trim() !== '') {
                            const url = this.data.value;
                            if (url.includes(availableUrls.facebook) || url.includes(availableUrls.facebookWatch)) {
                                if (isFacebookVideo(url)) {
                                    iframe.innerHTML = `
                          <iframe
                              src="https://www.facebook.com/plugins/video.php?href=${url}&show_text=0&width=560
                              https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2F20531316728%2Fposts%2F10154009990506729%2F&width=500&show_text=true&height=292&appId"
                              width="560" height="315"
                              style="border:none;overflow:hidden"
                              scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"
                          ></iframe>
                        `;
                                    return;
                                }
                                if (isFacebookPost(url)) {
                                    iframe.innerHTML = `
                          <iframe
                              src="https://www.facebook.com/plugins/post.php?href=${url}&width=500&show_text=true&height=292&appId" width="500" height="292" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
                          </iframe>
                        `;
                                    return;
                                }
                                iframe.textContent = "Type embed is not supported";
                                return;
                            }
                            if (url.includes(availableUrls.youtube)) {
                                const videoId = getUrlParamValue(url, 'v');
                                iframe.innerHTML = `
                        <iframe width="560" height="315" src="//www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`
                                    ;
                                return;
                            }
                            if (url.includes(availableUrls.instagram)) {
                                const idInstagram = getInstagramId(url);
                                iframe.innerHTML = `
                        <iframe src="https://www.instagram.com/p/${idInstagram}/embed" width="400" height="480" frameborder="0" scrolling="no" allowtransparency="true"></iframe>
                      `;
                                return;
                            }
                            if (url.includes(availableUrls.twitter)) {
                                fetch(`https://publish.twitter.com/oembed?url=${url}`)
                                .then(response => response.json())
                                .then(data => {
                                    const html = document.createRange().createContextualFragment(data.html)
                                    iframe.appendChild(html);
                                })
                                .catch(error => {
                                    console.error(error);
                                    iframe.textContent = "Type embed is not supported";
                                });
                                return;
                            }
                            iframe.textContent = "Type embed is not supported";
                        }
                    }
                });
            },
            onLoad: function (event) {
                //Add content to icon
                CKEDITOR.on("instanceReady", function (event) {
                    var this_button = document.querySelector('.cke_button__simplebox');
                    if (typeof this_button != 'undefined') {
                        this_button.innerHTML = '<div id="iconToolbarEmbed" class="btn-content-toolbar"></div>';
                    }
                });
            },
        });
    };
};
//Export
const pluginEmbed = new PluginEmbed()
export default pluginEmbed
export { pluginEmbed }
