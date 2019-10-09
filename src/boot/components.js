import treeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import crud from '@imagina/qcrud/_components/crud'
import innerLoading from 'src/components/master/innerLoading'
import notFound from 'src/components/master/404'
import notResult from 'src/components/master/notResults'
import uploadImg from 'src/components/master/uploadImage'
import dynamicField from 'src/components/master/dynamicField'

export default ({app, router, store, Vue}) => {
  //Components
  let components = [
    {name: 'crud', component: crud},
    {name: 'tree-select', component: treeSelect},
    {name: 'inner-loading', component: innerLoading},
    {name: 'not-found', component: notFound},
    {name: 'not-result', component: notResult},
    {name: 'upload-image', component: uploadImg},
    {name: 'dynamic-field', component: dynamicField}
  ]

  //Register components
  components.forEach(item => {
    Vue.use(item.component)
    Vue.component(item.name, item.component)
  })
}
