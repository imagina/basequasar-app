<template>
  <div id="siteField" class="q-my-xs">
    <q-input
      v-if="['select', 'select-multi',
        'text-multi','text-multi-with-options',
        'file','color','checkbox',
        'checkbox-multi-with-options','checkbox-multi'].indexOf(setting.type) < 0 && !setting.custom"
      autocomplete="false"
      outlined dense
      @input="emitValue()"
      v-model="vModel"
      :type="setting.type"
      :label="label"
      :rows="setting.type=='textarea' ? 3 : ''"/>

    <text-multi
      v-if="['text-multi', 'text-multi-with-options'].indexOf(setting.type) >= 0"
      class="q-my-sm"
      @input="emitValue()"
      v-model="vModel"
      :label="label"
      :type="setting.type"
      :input="setting.input"
      :options="setting.type == 'text-multi-with-options' ? setting.options : []"
    />

    <checkbox-multi
      v-if="['checkbox-multi', 'checkbox-multi-with-options'].indexOf(setting.type) >= 0"
      class="q-my-sm"
      @input="emitValue()"
      v-model="vModel"
      :label="label"
      :type="setting.type"
      :checkboxLabel="setting.checkboxLabel"
      :input="setting.input"
      :options="setting.type == 'checkbox-multi-with-options' ? setting.options : []"
    />

    <register-extra-fields
      v-if="setting.type === 'register-extra-fields'"
      class="q-my-sm"
      @input="emitValue()"
      v-model="vModel"
      :label="label"
      :type="setting.type"
      :input="setting.input"
      :setting="setting"
    />

    <address-extra-fields
      v-if="setting.type === 'address-extra-fields'"
      class="q-my-sm"
      @input="emitValue()"
      v-model="vModel"
      :label="label"
      :type="setting.type"
      :input="setting.input"
      :setting="setting"
    />

    <div class="q-caption text-grey"
         v-if="['select', 'select-multi'].indexOf(setting.type) >= 0">
      {{label}}
    </div>

    <tree-select
      v-if="['select', 'select-multi'].indexOf(setting.type) >= 0"
      :multiple="setting.type === 'select-multi'"
      :append-to-body="true"
      :options="options"
      :value-consists-of="setting.valueCconsistsOf ? setting.valueCconsistsOf : 'LEAF_PRIORITY'"
      @input="emitValue()"
      v-model="vModel"
      :placeholder="label"
    />

    <q-input v-if="setting.type == 'color'" outlined dense v-model="vModel"
             :label="label" @input="emitValue()">
      <template v-slot:append>
        <q-icon name="colorize" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-color v-model="vModel"/>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <media-form
      v-if="setting.type == 'file'"
      entity="Modules\Setting\Entities\Setting"
      :zone="setting.name"
      @input="emitValue()"
      v-model="vModel.medias_single"
      :entity-id="setting.id ? setting.id : ''"
      :label="label"
    />

    <q-editor
      v-if="setting.type == 'wysiwyg'"
      :label="label"
      v-model="vModel"
      @input="emitValue()"
    />

    <q-checkbox
      v-if="setting.type == 'checkbox'"
      @input="emitValue()"
      v-model="vModel"
      :label="label" class="q-my-sm"/>
  </div>
</template>
<script>
  import alert from '@imagina/qsite/_plugins/alert'

  /*Components*/
  import mediaForm from '@imagina/qmedia/_components/form'
  import textMulti from '@imagina/qsite/_components/customFields/textMulti'
  import checkboxMulti from '@imagina/qsite/_components/customFields/checkboxMulti'
  import registerExtraFields from '@imagina/qsite/_components/customFields/registerExtraFields'
  import addressExtraFields from '@imagina/qsite/_components/customFields/addressExtraFields'

  export default {
    props: ['setting', 'label'],
    components: {
      mediaForm,
      textMulti,
      checkboxMulti,
      registerExtraFields,
      addressExtraFields

    },
    computed: {
      options () {
        let name = this.setting.name.split('::')[1]
        let options = []
        switch (name) {
          case 'template':
            options = this.$store.getters['qsiteApp/availableThemesTreeSelect']
            break
          case 'locales':
            options = this.$store.getters['qsiteApp/availableLocalesTreeSelect']
            break
          default:
            if (this.setting.options) {
              options = this.setting.options
            }
            break
        }

        return options
      }
    },
    watch: {
      '$attrs.value' () {
        this.vModel = JSON.parse(JSON.stringify(this.$attrs.value))
      }
    },
    created () {
      this.$nextTick(function () {

      })
    },
    data () {
      return {
        vModel: this.$attrs.value
      }
    },
    methods: {
      emitValue () {
        this.$emit('input', this.vModel)
      },

    }

  }
</script>
<style lang="stylus">
</style>
