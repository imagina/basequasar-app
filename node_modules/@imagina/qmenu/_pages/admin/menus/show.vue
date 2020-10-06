<template>
  <div class="backend-page row q-col-gutter-x-md">
    <div class="col-md-5">
      <div class="box">
        <formMenu/>
      </div>
    </div>
    <div class="col-md-7">
      <div class="box">
        <indexItemsByMenu/>
      </div>
    </div>
  </div>
</template>

<script>
  // Components
  import formMenu from '@imagina/qmenu/_components/admin/menus/form'
  import indexItemsByMenu from '@imagina/qmenu/_components/admin/menuitems/indexItemsByMenu'

  export default {
    components: {
      formMenu,
      indexItemsByMenu
    }
  }
</script>
