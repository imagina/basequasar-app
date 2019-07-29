<template>
    <ul :class="className">
      <li v-for="(item, index) in menu" :key="index" @click="redirectTo(item)" class="q-px-lg">
        <q-icon :name=" item.icon"/> {{ item.title }} <q-icon name="arrow_drop_down" v-if="item.children" />
        <menuComponent :menu="item.children" v-if="item.children" className="dropdown"/>
      </li>
    </ul>
</template>

<script>
  export default {
    name: 'menuComponent',
    props: {
      className:{
        default: 'single'
      },
      menu: {
        default:false
      }
    },
    methods:{
      redirectTo(item){
        if (item.linkType == 'external' && !item.children){
          window.open(`https://${item.url}`,item.target);
        }
        this.$router.push({name: item.name})
      }
    }
  }
</script>

<style >
  a {
    text-decoration: none;
  }
  
  nav {

  }
  
  ul {
    background: transparent;
    list-style: none;
    margin: 0;
    padding-left: 0;
  }
  
  li {
    color: #fff;
    background: #027be3;
    display: block;
    float: left;
    padding: 1rem;
    position: relative;
    text-decoration: none;
    transition-duration: 0.5s;
  }
  
  li a {
    color: #fff;
  }
  
  li:hover,
  li:focus-within {
    background: #027be3;
    cursor: pointer;
  }
  
  li:focus-within a {
    outline: none;
  }
  
  ul li ul {
    background: #027be3;
    visibility: hidden;
    opacity: 0;
    min-width: 5rem;
    position: absolute;
    transition: all 0.5s ease;
    margin-top: 1rem;
    left: 0;
    display: none;
  }
  
  ul li:hover > ul,
  ul li:focus-within > ul,
  ul li ul:hover,
  ul li ul:focus {
    visibility: visible;
    opacity: 1;
    display: block;
  }
  
  ul li ul li {
    clear: both;
    width: 100%;
  }
  
  .dropdown{
    z-index: 1000;
  }
</style>
