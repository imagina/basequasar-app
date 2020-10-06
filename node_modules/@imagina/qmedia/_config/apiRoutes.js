const moduleName = 'imedia';
const moduleVersion = 'v1';
const urlBase = ''
const urlNewBase = `${moduleName}/${moduleVersion}`


export default {
  urlBase : urlBase,
  allMedia: `media/all-vue`,
  //breadcrumb: `${urlBase}/folder/breadcrumb`,
  file: `file`,
  folder: `folder`,
  move: `media/move`,
  //batchDestroy: `${urlBase}/batch-destroy`,
  findFirst: `media/find-first-by-zone-and-entity`,
  find: `media/get-by-zone-and-entity`,

  //Media with standard
  files : `/${urlNewBase}/files`,
  folders : `/${urlNewBase}/folders`,
  breadcrumb : `/${urlNewBase}/folders/breadcrumb`,
  batchMove : `/${urlNewBase}/batchs/move`,
  batchDestroy : `/${urlNewBase}/batchs/destroy`,
}
