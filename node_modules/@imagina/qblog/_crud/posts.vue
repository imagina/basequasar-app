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
          apiRoute: 'apiRoutes.qblog.posts',
          permission: 'iblog.posts',
          create: {
            title: this.$tr('qblog.layout.newPost'),
          },
          read: {
            columns: [
              {
                name: 'id', label: this.$tr('ui.form.id'),
                field: 'id',
                sortable: true,
              },
              {
                name: 'title', label: this.$tr('ui.form.title'),
                field: 'title',
                align: 'center',
                sortable: true,
              },
              {
                name: 'slug', label: this.$tr('ui.form.slug'),
                field: 'slug',
                align: 'center',
                sortable: true,
              },
              {
                name: 'category', label: this.$tr('ui.form.category'),
                align: 'center', field: 'category', sortable: true,
                format: val => ((val && val.title) ? val.title : '-')
              },
              {
                name: 'createdAt', label: this.$tr('ui.form.createdAt'), field: 'createdAt',
                format: val => val ? this.$trd(val) : '-',
                align: 'left', sortable: true
              },
              {
                name: 'actions', label: this.$tr('ui.form.actions'), align: 'center'
              },
            ],
            requestParams: {include: 'category'}
          },
          update: {
            title: this.$tr('qblog.layout.updatePost'),
            requestParams: {include: 'categories'}
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            title: {
              value: '',
              type: 'input',
              isTranslatable: true,
              props: {
                label: `${this.$tr('ui.form.title')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              },
            },
            slug: {
              value: '',
              type: 'input',
              isTranslatable: true,
              props: {
                label: `${this.$tr('ui.form.slug')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              },
            },
            summary: {
              value: '',
              type: 'input',
              isTranslatable: true,
              props: {
                label: `${this.$tr('ui.form.summary')}*`,
                type: 'textarea',
                rows: "3",
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              },
            },
            description: {
              value: '',
              type: 'html',
              isTranslatable: true,
              props: {
                label: `${this.$tr('ui.form.description')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            metaTitle: {
              value: '',
              type: 'input',
              isTranslatable: true,
              props: {
                label: this.$tr('ui.form.metaTitle'),
              }
            },
            metaDescription: {
              value: '',
              type: 'input',
              isTranslatable: true,
              props: {
                label: this.$tr('ui.form.metaDescription'),
                type: 'textarea',
                rows: 2,
              }
            },
            mediasMulti: {
              value: {},
              type: 'media',
              props: {
                label: this.$tr('ui.form.gallery'),
                zone: 'gallery',
                entity: "Modules\\Iblog\\Entities\\Post",
                entityId: null
              }
            },
          },
          formRight: {
            masterRecord: {
              value: '0',
              type: 'select',
              isFakeField: true,
              props: {
                label: this.$tr('ui.form.masterRecord'),
                options: [
                  {label: this.$tr('ui.label.yes'), value: '1'},
                  {label: this.$tr('ui.label.no'), value: '0'},
                ]
              }
            },
            userId: {
              value: parseInt(this.$store.state.quserAuth.userId),
              type: 'crud',
              props: {
                type: 'select',
                crudData: import('@imagina/quser/_crud/users'),
                crudProps: {
                  label: `${this.$tr('ui.form.author')}*`,
                  rules: [
                    val => !!val || this.$tr('ui.message.fieldRequired')
                  ],
                },
                config: {
                  options: {label: 'fullName', value: 'id'},
                  requestParams: {filter: {roleSlug: 'author'}}
                },
              },
            },
            categoryId: {
              value: null,
              type: 'crud',
              props: {
                crudType: 'select',
                crudData: import('@imagina/qblog/_crud/categories'),
                crudProps: {
                  label: `${this.$tr('ui.form.category')}*`,
                  rules: [
                    val => !!val || this.$tr('ui.message.fieldRequired')
                  ],
                },
              },
            },
            categories: {
              value: [],
              type: 'crud',
              props: {
                crudType: 'select',
                crudData: import('@imagina/qblog/_crud/categories'),
                crudProps: {
                  label: this.$trp('ui.form.category'),
                  multiple : true,
                  useChips : true
                },
              },
            },
            status: {
              value: '2',
              type: 'select',
              props: {
                label: this.$tr('ui.form.status'),
                options: [
                  {label: this.$tr('ui.form.publish'), value: '2'},
                  {label: this.$tr('ui.form.noPublish'), value: '3'},
                  {label: this.$tr('ui.form.draft'), value: '0'},
                  {label: this.$tr('ui.form.pending'), value: '1'}
                ]
              },
            },
            tags: {
              value: [],
              type: 'select',
              props: {
                label: this.$trp('ui.form.tag'),
                useInput: true,
                useChips: true,
                multiple: true,
                hideDropdownIcon: true,
                inputDebounce: "0",
                newValueMode: "add-unique"
              }
            },
            mediasSingle: {
              value: {},
              type: 'media',
              props: {
                label: this.$tr('ui.form.image'),
                zone: 'mainimage',
                entity: "Modules\\Iblog\\Entities\\Post",
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
