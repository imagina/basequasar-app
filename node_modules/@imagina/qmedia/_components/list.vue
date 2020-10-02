<template>
  <div id="mediaList" class="row">
    <!--== Table ==-->
    <div class="col-12 backend-page relative-position">
      <!--== Table ==-->
      <q-table
        :data="dataTable"
        :columns="columnsTable"
        :pagination.sync="pagination"
        selection="multiple"
        :selected.sync="rowsSelected"
        row-key="filename"
        @request="getData"
        class="box-table"
      >
        <!--Header-->
        <template slot="top">
          <q-no-ssr>
            <div class="row table-top col-12">
              <!--Table slot left-->
              <div class="table-top-left col-12 col-md-5 col-lg-4 col-xl-3">
                <!---Search-->
                <q-input clearable v-model="filter.search" dense outlined debounce="800" style="max-width: 250px"
                         :placeholder="`${$tr('ui.label.search',{capitalize : true})}...`"
                         @input="getData({pagination:pagination,search:filter.search})">
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                </q-input>
              </div>
              <!--Table slot Right-->
              <div class="table-top-right col-12 col-md-7 col-lg-8 col-xl-9 text-right">
                <div class="row justify-end items-center full-width">
                  <!--Button Move file -->
                  <q-btn color="teal" icon="fas fa-arrows-alt"
                         @click="getFolders(); dialogMove=true"
                         :label="$tr('ui.label.move')"
                         v-if="rowsSelected.length"/>
                  <!--Button delete file -->
                  <q-btn color="red-14" icon="fas fa-trash" class="q-ml-xs"
                         @click="dialogDeleteGlobal.handler()"
                         :label="$tr('ui.label.delete')"
                         v-if="rowsSelected.length"/>
                  <!--Button add folder -->
                  <q-btn color="positive" icon="fas fa-folder-plus" class="q-ml-xs"
                         @click="dialogCreateFolder=true"
                         :label="$tr('qmedia.layout.newFolder')"
                         v-if="$auth.hasAccess('media.folders.create')"
                  />
                  <!--Button add file -->
                  <q-btn color="blue" icon="add_photo_alternate" class="q-ml-xs"
                         @click="uploadFile = !uploadFile" :loading="loadingUploadFile"
                         :label="$tr('qmedia.layout.uploadFile')"
                         v-if="$auth.hasAccess('media.medias.create')">
                    <div slot="loading">
                      <q-spinner class="on-left"/>
                      <span class="q-hide q-md-show">{{$tr('ui.label.loading')}}...</span>
                    </div>
                  </q-btn>
                  <!---Uploader Files-->
                  <q-uploader
                    :key="uploaderID"
                    multiple v-show="false"
                    auto-expand
                    field-name="file"
                    :factory="files => factoryUploader(files)"
                    @fail="$alert.error({message: `${this.$tr('ui.message.recordNoCreated')}`})"
                    @finish="finishUploadFiles(); loadingUploadFile = false"
                    hide-upload-button
                    ref="uploadComponent"
                    @added="()=>{$refs.uploadComponent.upload(); loadingUploadFile = true}"/>
                  <!--Button refresh -->
                  <q-btn color="info" icon="fas fa-sync" class="q-ml-xs"
                         @click="getData({pagination:pagination,search:filter.search},true)">
                    <q-tooltip>{{$tr('ui.label.refresh')}}</q-tooltip>
                  </q-btn>
                </div>
              </div>
              <!--Breadcrumb-->
              <div class="table-top-filters col-12 q-pt-md">
                <q-breadcrumbs>
                  <q-breadcrumbs-el v-for="(breadcrumb,index) in breadcrumbs" :key="index" :label="breadcrumb.name"
                                    color="primary" @click.native="getDataByFolder(breadcrumb)" style="cursor: pointer"/>
                </q-breadcrumbs>
              </div>
            </div>
          </q-no-ssr>
        </template>

        <!--= Small Thumb or Icon =-->
        <q-td slot="body-cell-small_thumb" style="width: 30%" slot-scope="props" :props="props">
          <q-btn v-if="props.row.isFolder" icon="far fa-folder" flat @click="getDataByFolder(props.row)"/>
          <div v-else-if="props.row.isImage">
            <div class="image" :style="'background-image: url('+props.value+')'" alt="">
            </div>
          </div>
          <div v-else>
            <q-icon name="far fa-file-alt"/>
          </div>
        </q-td>

        <!--= File or Folder Name =-->
        <q-td slot="body-cell-filename" style="width: 10%" slot-scope="props" :props="props">
          <span class="q-caption">
            {{props.value}}
          </span>
        </q-td>

        <!--= Actions =-->
        <q-td slot="body-cell-actions" slot-scope="props" :props="props">
          <div v-if="embebed && !props.row.isFolder">
            <q-btn color="blue" :label="$tr('ui.label.select')" size="sm"
                   @click="$emit('data', props.row)"/>
          </div>
          <div v-else-if="!embebed">
            <q-btn icon="fas fa-pen" color="positive" size="sm" class="q-mx-xs"
                   @click="props.row.isFolder ? editFolder(props.row.filename,true,props.row.id) : editFile(true,props.row)">
              <q-tooltip>{{$tr('ui.label.edit')}}</q-tooltip>
            </q-btn>
            <q-btn icon="far fa-trash-alt" color="negative" size="sm" class="q-mx-xs"
                   @click="dialogDeleteItem.handler(props.row.id,props.row.isFolder)">
              <q-tooltip>{{$tr('ui.label.delete')}}</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </q-table>
      <!--Loading-->
      <inner-loading :visible="loading"/>
    </div>

    <!--= Create Folder Dialog =-->
    <q-dialog v-model="dialogCreateFolder">
      <q-card class="backend-page">
        <!--Header-->
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            <q-icon name="fa fa-folder" class="q-mr-sm"/>
            <label>{{$tr('qmedia.layout.newFolder')}}</label>
          </q-toolbar-title>
          <q-btn flat v-close-popup icon="fas fa-times"/>
        </q-toolbar>

        <!--Content-->
        <div class="relative-position q-pa-md">
          <q-form @submit="newFolder()"
                  @validation-error="$alert.error($tr('ui.message.formInvalid'))">
            <q-input :label="$tr('qmedia.layout.form.folderName')"
                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                     v-model="folderName" outlined dense/>

            <div class="text-right">
              <q-btn color="positive" :label="$tr('ui.label.save')" type="submit"
                     icon="fas fa-save" v-close-popup/>
            </div>

            <inner-loading :visible="loadingCreateFolder"/>
          </q-form>
        </div>
      </q-card>
    </q-dialog>

    <!--= update Folder Dialog =-->
    <q-dialog v-model="dialogRenameFolder">
      <q-card class="backend-page">
        <!--Header-->
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            <q-icon name="fa fa-folder" class="q-mr-sm"/>
            <label>{{$tr('qmedia.layout.renameFolder')}}</label>
          </q-toolbar-title>
          <q-btn flat v-close-popup icon="fas fa-times"/>
        </q-toolbar>

        <!--Content-->
        <div class="relative-position q-pa-md">
          <q-form @submit="editFolder('',false,false)"
                  @validation-error="$alert.error($tr('ui.message.formInvalid'))">
            <q-input :label="$tr('qmedia.layout.form.folderName')"
                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                     v-model="folderName" outlined dense/>

            <div class="text-right">
              <q-btn color="positive" :label="$tr('ui.label.save')" type="submit"
                     icon="fas fa-save" v-close-popup/>
            </div>

            <inner-loading :visible="loadingRenameFolder"/>
          </q-form>
        </div>
      </q-card>
    </q-dialog>

    <!--= Edit File Dialog =-->
    <q-dialog v-model="dialogEditFile">
      <q-card class="backend-page">
        <!--Header-->
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            <q-icon name="fa fa-folder" class="q-mr-sm"/>
            <label>{{$tr('qmedia.layout.editFile')}}</label>
          </q-toolbar-title>
          <q-btn flat v-close-popup icon="fas fa-times"/>
        </q-toolbar>

        <!--Content-->
        <div class="relative-position q-pa-md">
          <q-form @submit="editFile()" ref="formEditFile"
                  @validation-error="$alert.error($tr('ui.message.formInvalid'))">

            <locales v-model="locale" class="q-mb-md"/>

            <!--Form-->
            <div v-if="locale.success">
              <div class="text-center">
                <img class="img-fluid" style="max-width: 200px"
                     :src="fileForm.path ? fileForm.path : ''" alt="">
              </div>
              <q-input :label="$tr('qmedia.layout.form.altAttribute')"
                       v-model="locale.formTemplate.alt_attribute" outlined dense/>
              <q-input :label="$tr('ui.label.description')"
                       v-model="locale.formTemplate.description" outlined dense/>
              <q-input :label="$tr('qmedia.layout.form.keyWords')"
                       v-model="locale.formTemplate.keywords" outlined dense/>
              <q-select :label="$trp('ui.label.tag',{capitalize:true})" bg-color="white"
                        v-model="locale.formTemplate.tags" use-input use-chips multiple
                        hide-dropdown-icon input-debounce="0" new-value-mode="add-unique"
                        style="width: 100%" outlined dense/>
            </div>

            <div class="text-right">
              <q-btn color="positive" :label="$tr('ui.label.save')" type="submit"
                     icon="fas fa-save" v-close-popup/>
            </div>

            <inner-loading :visible="loadingRenameFolder"/>
          </q-form>
        </div>
      </q-card>
    </q-dialog>

    <!--= Move Elements Dialog =-->
    <q-dialog v-model="dialogMove">
      <q-card class="backend-page">
        <!--Header-->
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            <q-icon name="fa fa-folder" class="q-mr-sm"/>
            <label>{{$tr('qmedia.layout.moveMedia')}}</label>
          </q-toolbar-title>
          <q-btn flat v-close-popup icon="fas fa-times"/>
        </q-toolbar>

        <!--Content-->
        <div class="relative-position q-pa-md">
          <q-form @submit="moveElements()"
                  @validation-error="$alert.error($tr('ui.message.formInvalid'))">

            <q-select :label="$tr('qmedia.layout.form.moveTo')" v-model="folderSelected"
                      :options="selectFolders" outlined dense emit-value map-options/>

            <div class="text-right">
              <q-btn color="positive" :label="$tr('ui.label.confirm')" type="submit"
                     icon="fas fa-save" v-close-popup/>
            </div>

            <inner-loading :visible="loadingRenameFolder"/>
          </q-form>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
  /*Plugins*/
  import axios from 'axios'
  import { uid } from 'quasar'
  import _cloneDeep from 'lodash.clonedeep'

  /*Services*/
  import mediaService from '@imagina/qmedia/_services/index'

  export default {
    props: {
      embebed: {
        type: Boolean,
        default: false
      }
    },
    components: { },
    watch: {
      uploadFile (newValue) {
        if (newValue) this.$refs.uploadComponent.pickFiles()
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.breadcrumbs = this.defaultBreadCrum
        this.getData({ pagination: this.pagination, search: this.filter.search }, this.embebed)
      })
    },
    data () {
      return {
        locale: {
          fields: {
            tags: []
          },
          fieldsTranslatable: {
            alt_attribute: '',
            description: '',
            keywords: '',
          }
        },
        folderSelected: null,
        selectFolders: [{
          label: 'Home',
          value: 0
        }],
        uploaderID: uid(),
        uploaderUrl: this.$axios.defaults.baseURL.replace('/api', config('apiRoutes.qmedia.files')),
        folderName: '',
        idFolderToEdit: '',
        idFileToEdit: '',
        dialogEditFile: false,
        dialogCreateFolder: false,
        dialogRenameFolder: false,
        dialogMove: false,
        fileForm: {},
        rowsSelected: [],
        uploadFile: false,
        breadcrumbs: [],
        headers: [{
          name: 'Authorization',
          value: this.$store.state.quserAuth.userToken
        }],
        filter: {
          search: '',
          folderId: 0
        },
        show: false,
        loading: false,
        loadingCreateFolder: false,
        loadingEditFile: false,
        loadingUploadFile: false,
        loadingRenameFolder: false,
        loadingMove: false,
        loadingDelete: false,
        dataTable: [],
        pagination: {
          page: 1,
          rowsPerPage: 15,
          rowsNumber: 1
        },
      }
    },
    computed: {
      /**
       * Additional fields for uploader http request
       * @returns {*[]}
       */
      additionalFields () {
        return [
          {
            name: 'parent_id',
            value: this.filter.folderId
          }
        ]
      },
      columnsTable () {
        return [
          {
            name: 'small_thumb', label: '',
            field: 'smallThumb', align: 'center'
          },
          {
            name: 'filename', label: this.$tr('ui.form.name'),
            field: 'filename', align: 'left'
          },
          {
            name: 'createdAt', label: this.$tr('ui.form.createdAt'),
            field: 'createdAt',
            format: val => val ? this.$trd(val) : '-',
            align: 'right', sortable: true
          },
          {
            name: 'actions', label: this.$tr('ui.form.actions'), align: 'center'
          },

        ]
      },
      dialogDeleteGlobal () {
        return {
          handler: () => {
            this.$q.dialog({
              title: this.$tr('ui.label.confirm'),
              ok: this.$tr('ui.label.delete'),
              message: this.$tr('ui.message.deleteRecord'),
              cancel: this.$tr('ui.label.cancel'),
              color: 'negative'
            }).onOk(() => {
              this.deleteElements()
            }).onCancel(() => {
            })
          }
        }
      },
      dialogDeleteItem () {
        return {
          handler: (id, isFolder) => {
            this.$q.dialog({
              title: this.$tr('ui.label.confirm'),
              ok: this.$tr('ui.label.delete'),
              message: this.$tr('ui.message.deleteRecord'),
              cancel: this.$tr('ui.label.cancel'),
            }).onOk(() => {
              this.deleteElement(id, isFolder)
            }).onCancel(() => {
            })
          }
        }
      },
      defaultBreadCrum () {
        return [{ id: 0, name: this.$tr('ui.label.home') }]
      }
    },
    methods: {
      async getData ({ pagination, search }, refresh = false) {
        this.loading = true
        // clear storage cache
        if (refresh) {
          this.$cache.remove('apiRoutes.qmedia.files')
        }

        let params = {
          params: {
            page: pagination.page,
            take: pagination.rowsPerPage,
            filter: {
              ...this.filter
            },
          },
          refresh: refresh
        }
       
        // if folderId is not root path
        if (this.filter.folderId != 0) {
          let breacrumb = await this.$crud.show('apiRoutes.qmedia.breadcrumb', this.filter.folderName, params)
          this.breadcrumbs = breacrumb.data
        } else
        // reseting breadcrumb
        {
          this.breadcrumbs = this.defaultBreadCrum
        }

        // index all media by params
        this.$crud.index('apiRoutes.qmedia.files', params).then(response => {
          this.dataTable = response.data
          this.pagination.rowsPerPage = pagination.rowsPerPage
          this.pagination.page = pagination.page
          this.pagination.rowsNumber = response.meta.page.total
          this.loading = false
        }).catch(error => {
          this.$alert.error({ message: this.$tr('ui.message.errorRequest'), pos: 'bottom' })
          this.loading = false
        })
      },
      /**
       * changing data by folderId
       * @param folderId
       * @param refresh
       */
      getDataByFolder(folder, refresh = false) {
        this.filter.search = ''
        this.filter.folderId = folder.id
        this.filter.folderName = folder.filename || folder.name
        this.getData({ pagination: this.pagination, search: this.filter.search }, refresh)
      },

      /**
       * creating new folder
       * @param okFn
       */
      newFolder () {
        this.loadingFolder = true
        let data = {
          name: this.folderName,
          parent_id: this.filter.folderId
        }

        mediaService.crud.create('apiRoutes.qmedia.folders', data).then(reponse => {
          this.loadingFolder = false
          this.$alert.success({ message: `${this.$tr('ui.message.recordCreated')}` })
          this.getData({ pagination: this.pagination, search: this.filter.search }, true)
        }).catch(error => {
          this.loadingFolder = false
          this.$alert.error({ message: `${this.$tr('ui.message.recordNoCreated')}` })
        })
      },
      /**
       * move elements selected on q-table component
       * @param okFn
       */
      moveElements () {
        this.loadingMove = true
        let data = {

          destinationFolder: this.folderSelected,
          files: this.rowsSelected

        }

        mediaService.crud.create('apiRoutes.qmedia.batchMove', data).then(reponse => {
          this.loadingMove = false
          this.rowsSelected = []
          this.$alert.success({ message: this.$tr('ui.message.recordUpdated') })
          this.getData({ pagination: this.pagination, search: this.filter.search }, true)
        }).catch(error => {
          this.loadingMove = false
          this.$alert.error({ message: this.$tr('ui.message.recordNoUpdated') })
        })
      },

      /**
       * finish upload files event from q-uploader component
       */
      finishUploadFiles () {
        this.uploadFile = false
        this.uploaderID = uid()
        this.$alert.success({ message: `${this.$tr('ui.message.recordCreated')}` })
        this.getDataByFolder({id:this.filter.folderId, name: this.filter.folderName}, true)
      },
      getFolders () {
        let params = {
          params: {
            filter: {
              isFolder: true
            }
          }
        }

        mediaService.crud.index('apiRoutes.qmedia.files', params).then(response => {
          this.selectFolders = [{
            label: 'Home',
            value: 0
          }]
          response.data.forEach( (folder) => {
            this.selectFolders.push({
              label: folder.filename,
              value: folder.id
            })
          })
        }).catch(error => {
          this.$alert.error({ message: this.$tr('ui.message.errorRequest'), pos: 'bottom' })
        })
      },

      /**
       * delete element on media by id
       * @param id
       * @param isFolder
       */
      deleteElement (id, isFolder) {
        let configRoute = 'apiRoutes.qmedia.files'

        // if is Folder replace configRoute and successMessage
        if (isFolder) {
          configRoute = 'apiRoutes.qmedia.folders'
        }

        mediaService.crud.delete(configRoute, id).then(response => {
          this.$alert.success({ message: `${this.$tr('ui.message.recordDeleted')}` })
          this.getData({ pagination: this.pagination, search: this.filter.search }, true)
        }).catch(error => {
          this.$alert.error({ message: `${this.$tr('ui.message.recordNoDeleted')}` })
        })
      },

      /**
       * deleting multiple elements on media by selected rows on q-table component
       */
      deleteElements () {
        this.loading = true
        let data = {
          files: this.rowsSelected
        }

        mediaService.crud.create('apiRoutes.qmedia.batchDestroy', data).then(response => {
          this.$alert.success({ message: `${this.$tr('ui.message.recordDeleted')}` })
          this.loading = false
          this.rowsSelected = []
          this.getData({ pagination: this.pagination, search: this.filter.search }, true)
        }).catch(error => {
          this.$alert.error({ message: `${this.$tr('ui.message.recordNoDeleted')}` })
        })
      },
      /**
       * edit folder name
       * @param name
       * @param openDialog
       * @param id
       * @param okFn
       */
      editFolder (name, openDialog, id = false) {
        // if openDialog its true, just opened
        if (openDialog) {
          this.idFolderToEdit = id
          this.folderName = name
          this.dialogRenameFolder = true
        } else { // else: send folder data to the service
          this.loadingRenameFolder = true
          let data = {
            id: this.idFolderToEdit,
            name: this.folderName,
            parent_id: this.filter.folderId
          }

          mediaService.editItem('apiRoutes.qmedia.folders', this.idFolderToEdit, data, { params: {} }).then(response => {
            this.loadingRenameFolder = false
            this.rowsSelected = []
            this.$alert.success({ message: this.$tr('ui.message.recordUpdated') })
            this.getData({ pagination: this.pagination, search: this.filter.search }, true)
          }).catch(error => {
            this.loadingRenameFolder = false
            this.$alert.error({ message: this.$tr('ui.message.recordNoUpdated') })
          })
        }
      },

      /**
       * this function is not finished, will be finish on next version
       * @param openDialog
       * @param row
       */
      editFile (openDialog = false, row = false) {
        if (openDialog) {
          this.locale.form = row
          this.fileForm = row
          this.dialogEditFile = true
        } else {
          this.loadingEditFile = true
          let data = _cloneDeep(this.locale.form)
          data['id'] = this.fileForm.id

          mediaService.createItem('apiRoutes.qmedia.files', data.id, data, { params: {} }).then(response => {
            this.loadingEditFile = false
            this.rowsSelected = []
            this.fileForm = {}
            this.dialogEditFile = false
            this.$alert.success({ message: this.$tr('ui.message.recordUpdated') })
            this.getData({ pagination: this.pagination, search: this.filter.search }, true)
          }).catch(error => {
            this.loadingEditFile = false
            this.$alert.error({ message: this.$tr('ui.message.recordNoUpdated') })
          })
        }
      },

      //Factory uploader
      factoryUploader (files) {
        return {
          url: `${this.$axios.defaults.baseURL}${config('apiRoutes.qmedia.files')}`,
          method: 'POST',
          extensions: '.gif,.jpg,.jpeg,.png,.pdf',
          formFields: [
            { name: 'parent_id', value: this.filter.folderId },
            { name: 'Content-Type', value: files[0].type },
          ],
          headers: [
            { name: 'Authorization', value: this.$store.state.quserAuth.userToken }
          ]
        }
      }
    }
  }
</script>
<style lang="stylus">
  #mediaList
    .table-top
      .table-top-right
        .q-btn
          @media screen and (max-width: $breakpoint-sm)
            margin-top 10px
          @media screen and (max-width: $breakpoint-md)
            .q-btn-inner
              i
                margin 0px

              div
                display none

            .absolute-full
              svg
                margin 0px

    .image
      background-repeat no-repeat
      background-size 100% cover
      background-position center center
      height 50px
      overflow hidden

    table td
      word-wrap break-word !important
      overflow-wrap break-word !important
      white-space inherit !important

  #mediaEditFileModal
    .img-fluid
      width 50%

</style>
