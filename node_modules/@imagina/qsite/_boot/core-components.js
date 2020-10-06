import treeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import crud from '@imagina/qcrud/_components/crud'
import innerLoading from '@imagina/qsite/_components/master/innerLoading'
import notFound from '@imagina/qsite/_components/master/404'
import notResult from '@imagina/qsite/_components/master/notResults'
import uploadImg from '@imagina/qsite/_components/master/uploadImage'
import dynamicField from '@imagina/qsite/_components/master/dynamicField'
import captcha from '@imagina/qsite/_components/master/captcha'
import locales from '@imagina/qsite/_components/master/locales'
import avatarImage from '@imagina/qsite/_components/master/avatarImage'
import headerToApp from '@imagina/qsite/_components/master/headerToApp'
import subHeader from '@imagina/qsite/_components/master/subHeader'
import shareLink from '@imagina/qsite/_components/master/shareLink'

export default ({app, router, store, Vue}) => {
  //Components
  let components = [
    {name: 'crud', component: crud},
    {name: 'tree-select', component: treeSelect},
    {name: 'inner-loading', component: innerLoading},
    {name: 'not-found', component: notFound},
    {name: 'not-result', component: notResult},
    {name: 'upload-image', component: uploadImg},
    {name: 'dynamic-field', component: dynamicField},
    {name: 'captcha', component: captcha},
    {name: 'locales', component: locales},
    {name: 'avatar-image', component: avatarImage},
    {name: 'header-app', component: headerToApp},
    {name: 'sub-header', component: subHeader},
    {name: 'share-link', component: shareLink},
  ]

  //Register components
  components.forEach(item => {
    Vue.use(item.component)
    Vue.component(item.name, item.component)
  })
}
