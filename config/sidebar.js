/**
 * Config for items in Menu
 */

/*
*       {
        title: 'Assignment',
        icon: 'fas fa-users-cog',
        to: 'user.users.assignment',
        can:'user.users.index'
      },*/

export default {
  /*home*/
  home: {
    title: 'Home',
    icon: 'fas fa-home',
    to: 'home',
  },
  /*User*/
  user: {
    title: 'Users',
    icon: 'fas fa-users',
    children: [
      {
        title: 'Create',
        icon: 'fas fa-user-plus',
        to: 'user.users.create',
        can: 'user.users.create'
      },
      {
        title: 'List/Search',
        icon: 'fas fa-list-alt',
        to: 'user.users.index',
        can: 'user.users.index'
      },
      {
        title: 'My profile',
        icon: 'fas fa-user-tie',
        to: 'user.profile.me'
      },
      {
        title: 'Departments',
        icon: 'fas fa-cubes',
        to: 'user.department',
        can: 'fhia.departments.index'
      }
    ]
  },
  /*logout*/
  logout: {
    title: 'Sign out',
    icon: 'fas fa-sign-out-alt',
    to: 'auth.logout'
  }
}
