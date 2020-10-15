<template>
  <q-list
    class="q-mt-md">
    <q-item-section>
      Options
      <q-btn @click="add()" icon="add" dense flat color="primary"/>
    </q-item-section>
    <q-item v-for="(item, index) in model.selectable" :key="index" :id="'optionSelect'+index">
      <q-item-section main>
        <q-input outlined dense v-model="item.name" placeholder="Name Option"/>
      </q-item-section>
      <q-item-section right>
        <q-btn @click="remove(item)" icon="close" dense flat color="primary"/>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
  export default {
    props: {
      model: {
        type: Object,
        default: () => {
          return {
            selectable: []
          }
        }
      }
    },
    data() {
      return {}
    },
    methods: {
      add() {
        let item = {
          name: ''
        }
        this.model.selectable.push(item)
      },
      remove(element) {
        let index = this.model.selectable.findIndex(item => item === element)
        this.model.selectable.splice(index, 1)
      }
    }
  }
</script>
