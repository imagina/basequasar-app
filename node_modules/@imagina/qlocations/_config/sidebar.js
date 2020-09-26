const pages = config('pages') // Get Pages from config

//E-commerce
export default [
  {
    title: 'qlocations.sidebar.adminGroup',
    icon: 'fas fa-atlas',
    children: [
      pages.qlocations.countries,
      pages.qlocations.provinces,
      pages.qlocations.cities,
      pages.qlocations.neighborhoods,
      pages.qlocations.polygons,
      pages.qlocations.geozones,
    ]
  }
]
