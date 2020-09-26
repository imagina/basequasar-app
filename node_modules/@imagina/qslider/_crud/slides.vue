<template></template>
<script>
  export default {
    data() {
      return {
        crudId: this.$uid()
      }
    },
    computed: {
      crudData() {
        return {
          crudId: this.crudId,
          apiRoute: 'apiRoutes.qslider.slides',
          permission: 'slider.slides',
          create: {
            title: this.$tr('qslider.layout.newSlide'),
          },
          read: {
            columns: [],
            requestParams: {}
          },
          update: {
            title: this.$tr('qslider.layout.updateSlide'),
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            userId: {value: this.$store.state.quserAuth.userId},
            title: {
              value: '',
              type: 'input',
              isTranslatable : true,
              props: {
                label: `${this.$tr('ui.form.title')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              },
            },
            caption: {
              value: '',
              type: 'input',
              isTranslatable : true,
              props: {label: 'caption'},
            },
            uri: {
              value: '',
              type: 'input',
              isTranslatable : true,
              props: {
                label: 'URI',
              },
            },
            url: {
              value: '',
              type: 'input',
              isTranslatable : true,
              props: {
                label: 'URL',
              },
            },
            externalImageUrl: {
              value: '',
              type: 'input',
              isTranslatable : true,
              props: {
                label: `${this.$tr('ui.form.image')}`,
              },
            },
            customHtml: {
              value: '',
              type: 'html',
              isTranslatable: true,
              props: {
                label: `${this.$tr('ui.form.description')}`,
              }
            },
          },
          formRight: {
            active: {
              value: '1',
              type: 'select',
              isTranslatable : true,
              props: {
                label: this.$tr('ui.form.status'),
                options: [
                  {label: this.$tr('ui.label.enabled'), value: '1'},
                  {label: this.$tr('ui.label.disabled'), value: '0'},
                ]
              }
            },
            targetField: {
              name : 'target',
              value: null,
              type: 'select',
              props: {
                label: this.$tr('ui.form.option'),
                options: [
                  {label: 'Same tab', value: '_self'},
                  {label: 'New tab', value: '_blank'}
                ]
              }
            },
            typeField: {
              name : 'type',
              value: null,
              type: 'select',
              props: {
                label: this.$tr('ui.form.type'),
                options: [
                  {label: 'Auto', value: 'auto'},
                  {label: '360', value: '360'},
                  {label: 'Video', value: 'video'},
                  {label: 'Image', value: 'image'}
                ]
              }
            },
            mediasSingle: {
              value: {},
              type: 'media',
              props: {
                label: this.$tr('ui.form.image'),
                zone: 'slideimage',
                entity: "Modules\\Slider\\Entities\\Slide",
                entityId: null
              }
            }
          },
        }
      },
      //Crud info
      crudInfo() {
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      }
    },
  }
</script>
