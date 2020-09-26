export default ({app, router, store, Vue}) => {
  //Components
  let components = [
    //{name: 'name-component', component: Component}
  ]

  //Register components
  components.forEach(item => {
    Vue.use(item.component)
    Vue.component(item.name, item.component)
  })
}
