import pagesConfig from 'src/setup/pages'

class LocalRoutes {
  constructor() {
    this.pages = pagesConfig
    this.routes = [];
  }

  getRoutes() {
    this.loadRoutes()
    this.addExtraRoutes()
    return this.routes;
  }

  loadRoutes() {
    for (const [nameGroupPage, groupPages] of Object.entries(this.pages)) {
      if (Object.keys(groupPages).length === 0) {
        continue;
      }

      for (const [namePage, page] of Object.entries(groupPages)) {
        if (page.activated) {
          this.createAndAddRoute(page);
        }
      }
    }
  }

  createAndAddRoute(page) {
    const pagePath = { default: page.path[this.defaultLanguage] || page.path };
    const route = {
      path: pagePath.default,
      component: page.layout,
      children: [
        {
          path: '',
          component: page.page,
          ...this.getOptionsPage(page),
        },
      ],
    };

    this.routes.push(route);
  }

  getOptionsPage(page, locale = false) {
    let middlewares = page.middleware || [];

    return {
      name: page.name,
      meta: {
        ...page,
        permission: page.permission || null,
        activated: page.activated,
        path: page.path,
        title: page.title,
        headerTitle: page.headerTitle || false,
        icon: page.icon,
        authenticated: page.authenticated,
        subHeader: page.subHeader || {},
      },
      props: page.props || true,
      beforeEnter: middlewares,
    };
  }

  addExtraRoutes() {
    const notFound = '/:catchAll(.*)';
    if (process.env.MODE !== 'ssr') {
      const notFoundRoute = {
        path: notFound,
        component: () => import('layouts/blank.vue'),
        children: [
          {
            path: '',
            component: () => import('src/pages/404'),
            name: 'app.not.found',
            meta: {
              permission: null,
              activated: true,
              path: notFound,
              name: 'app.not.found',
              title: 'sidebar.pageNotFound',
              headerTitle: false,
              icon: 'fas fa-chart-bar',
              authenticated: false,
              subHeader: {},
            },
            props: true,
            beforeEnter: [],
          },
        ],
      };

      this.routes.push(notFoundRoute);
    }
  }
}

const localRoutes = new LocalRoutes();

export default localRoutes;
