<template>
  <div id="testPageId">
    <div class="row">
      <div v-for="(field, keyField) in fieldsConfig" :key="keyField" class="col-12">
          <dynamic-field v-model="form[keyField]" class="q-mb-md" :field="field"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      loading: false,
      data: [],
      form: {}
    }
  },
  computed: {
    fieldsConfig() {
      let globalData = {
        help: {
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium ad amet aspernatur atque, error harum ipsa magni odit recusandae, repellat totam vitae? Impedit inventore necessitatibus reiciendis soluta! Deserunt, harum, sunt.'
        }
      }
      return {
        banner: {
          type: 'banner',
          props: {
            color: 'info',
            icon: 'fas fa-exclamation-triangle',
            message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ad aperiam cupiditate deleniti dolore, dolores explicabo, impedit labore molestiae optio pariatur placeat quis similique soluta unde? Expedita nesciunt obcaecati quia!",
            actions: [
              {
                props: {
                  label: this.$tr('isite.cms.label.home')
                },
                action: () => {
                  this.$helper.openExternalURL(this.$store.state.qsiteApp.baseUrl, true)
                }
              }
            ]
          }
        },
        crud: {
          ...globalData,
          value: null,
          type: 'crud',
          props: {
            crudType: 'select',
            imageField: 'mediaFiles.mainimage.url',
            crudData: import('modules/qblog/_crud/categories'),
            customData: {
              read: {
                requestParams: {include: 'parent', filter: {status: 1}}
              }
            },
            crudProps: {
              label: 'Type: CRUD'
            },
          },
        },
        input: {
          ...globalData,
          type: 'input',
          props: {label: 'type: input'}
        },
        search: {
          ...globalData,
          type: 'search',
          props: {label: 'type: search'}
        },
        date: {
          ...globalData,
          type: 'date',
          props: {label: 'type: date'}
        },
        hour: {
          ...globalData,
          type: 'hour',
          props: {label: 'type: hour'}
        },
        fullDate: {
          ...globalData,
          type: 'fullDate',
          props: {label: 'type: fullDate'}
        },
        dateRange: {
          ...globalData,
          value: {
            type: 'customRange',
            from: '2024-05-04 00:00:00',  //2024/05/01 00:00:00
            to: '2024-05-14 23:59:59'  //2024/05/04 23:59:59
          },
          type: 'dateRange',
          props: {
            label: 'type: Date Range',
            mask: 'YYYY-MM-DD', //YYYY/MM/DD
            field: 'blockInBlockOut',
            startOfDay: '10:00:00',
            endOfDay: '16:59:59',
          }
        },
        select: {
          ...globalData,
          type: 'select',
          props: {
            label: 'type: select',
            options: [],
            imageField: 'mainImage',
          },
          loadOptions: {
            apiRoute: 'apiRoutes.quser.users',
            select: {label: 'fullName', id: 'id'},
            filterByQuery: true
          }
        },
        treeSelect: {
          ...globalData,
          type: 'treeSelect',
          props: {
            label: 'type: treeSelect',
            imageField: 'mediaFiles.mainimage.url',
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qcommerce.categories',
            select: {label: 'title', id: 'id'},
          }
        },
        html: {
          ...globalData,
          type: 'html',
          props: {label: 'type: html'}
        },
        checkbox: {
          ...globalData,
          type: 'checkbox',
          props: {label: 'type: checkbox'}
        },
        media: {
          ...globalData,
          value: {},
          type: 'media',
          props: {
            label: 'type: media',
            zone: 'gallery',
            entity: "Modules\\Iblog\\Entities\\Post",
            entityId: null
          }
        },
        inputColor: {
          ...globalData,
          type: 'inputColor',
          props: {label: 'type: inputColor'}
        },
        toggle: {
          ...globalData,
          type: 'toggle',
          props: {label: 'type: toggle'}
        },
        signature: {
          ...globalData,
          type: 'signature',
          props: {label: 'type: signature'}
        },
        rating: {
          ...globalData,
          type: 'rating',
          props: {label: 'type: rating'}
        },
        selectIcon: {
          ...globalData,
          type: 'selectIcon',
          props: {label: 'type: selectIcon'}
        },
        optionGroup: {
          ...globalData,
          type: 'optionGroup',
          props: {
            label: 'type: optionGroup',
            options: [
              {label: 'opt1', value: 'opt1'},
              {label: 'opt2', value: 'opt2'},
              {label: 'opt3', value: 'opt3'}
            ]
          }
        },
        schedulable: {
          ...globalData,
          type: 'schedulable',
          props: {label: 'type: schedulable'}
        },
        json: {
          ...globalData,
          type: 'json',
          props: {label: 'type: json'}
        },
        expressionInput: {
          ...globalData,
          type: 'expression',
          props: {
            label: 'type: expression input',
            options: [
              {label: 'opt1', value: 'opt1'},
              {label: 'opt2', value: 'opt2'},
              {label: 'opt3', value: 'opt3'}
            ],
          }
        },
        expressionTextArea: {
          ...globalData,
          type: 'expression',
          props: {
            label: 'type: expression textarea',
            type: 'textarea',
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qrequestable.categoriesFormFields',
            select: {label: 'label', id: 'value'},
            parametersUrl: {
              categoryId: 1
            }
          }
        },
        code: {
          ...globalData,
          value: '/* Some example CSS */\n' +
            '@import url("something.css");\n' +
            '\n' +
            'body {\n' +
            '  margin: 0;\n' +
            '  padding: 3em 6em;\n' +
            '  font-family: tahoma, arial, sans-serif;\n' +
            '  color: #000;\n' +
            '}',
          type: 'code',
          props: {
            label: 'type: Code',
            options : {
              mode : 'text/css'
            }
          }
        },
        localizedPhone: {
          ...globalData,
          type: 'localizedPhone',
          props: {
            label: 'type: localizedPhone',
            mask:"###-###-####"
          },
        },
        multiDynamifield : {
            value : [],
            type : 'multiplier',
            props : {
                label : 'Multiple Dynamic Fields',
                isDraggable: true, // Default true
                maxQuantity: 7, // Default 5
                fields : {
                    localizedPhone: {
                      ...globalData,
                      type: 'localizedPhone',
                      colClass: "col-12",
                      props: {
                        label: 'type: localizedPhone',
                        mask:"###-###-####"
                      },
                    },
                    numberPhone : {
                        value : null,
                        type : 'input',
                        colClass: "col-12",
                        props : {
                          label: 'Email'
                        }
                    }
                }
            }
        },
      }
    }
  },
  methods: {
    init() {
    },
  }
}
</script>
<style lang="scss">
</style>
