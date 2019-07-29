<template>
  <div>
    <!--=== Content Footer ===-->
    <div class="bg-primary desktop-only">
      <div class="row q-container full-height gutter-x-xl">
        <div class="col-12 col-md-4">
          <div class="text-center desktop-only q-my-xl" >
            <img :src="$store.getters['qsiteSettings/getSettingMediaByName']('isite::logo1').path" width="80%">
          </div>
          <p class="q-my-lg text-white" align="justify">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci
            assumenda atque, dolore illo illum laborum maxime natus nesciunt officia
            officiis placeat, quod ut, voluptatibus! Autem ducimus illum magnam nulla similique?
          </p>
        </div>

        <div class="col-12 col-md-4">
          <menu-list :menu="menu" class="q-mt-xl text-white"/>
        </div>

        <div class="col-12 col-md-4 text-white">
          <p class="q-mt-xl" align="justify">
            Contacto
          </p>
          <div class="block">
            <q-icon name="fas fa-home"></q-icon>
            Calle 29 #7-54, Belalcazar
            <p>Ibagué - Colombia</p>
          </div>
          <div class="block">
            <q-icon name="fas fa-phone"></q-icon>
            2664999 <span class="mobile-only">-</span>
            <p>300 782 63 87 - 316 396 12 95</p>
          </div>
          <div class="block">
            <p>
              <q-icon name="fas fa-envelope"></q-icon>
              soporte@imaginacolombia.com
            </p>
          </div>
          <div class="block flex flex-center">
            <a target="_blank"
               href="https://www.facebook.com/imaginacol">
              <q-icon name="fab fa-facebook" color="white" class="q-px-md"></q-icon>
            </a>
            <a target="_blank"
               href="https://twitter.com/imaginacolombia">
              <q-icon name="fab fa-twitter" color="white" class="q-px-md"></q-icon>
            </a>
            <a target="_blank"
               href="https://www.instagram.com/imagina_colombia/">
              <q-icon name="fab fa-instagram" color="white" class="q-px-md"></q-icon>
            </a>
            <a target="_blank"
               href="https://www.youtube.com/channel/UCZA9gQP6lt2b5Qg3d8XQD1A">
              <q-icon name="fab fa-youtube" color="white" class="q-px-md"></q-icon>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!--=== Copyright ===-->
    <div class="bg-dark">
      <div class="row flex flex-center gutter-x-sm q-py-sm">
        <div>
          <logo-imagina></logo-imagina>
        </div>
        <div class="text-white q-caption">
          Copyright {{ new Date().getFullYear() }} © Imagina Derechos Reservados.
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import logoImagina from 'src/components/master/imaginaSVG'
  import menuFooter from '@imagina/qmenu/_components/menu-footer'
  import menuList from "../recursiveItem";

  export default {
    props: {},
    components: {
      logoImagina,
      menuFooter,
      menuList
    },
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
        menu: (this.$store.getters['qmenuMaster/menu'](9)).items,
      }
    },
    methods: {}
  }
</script>
