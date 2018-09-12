/**
 * Config for items in Menu
 */

/*
*{
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
    can: 'iprofile.api.user.permission',
    children: [
      {
        title: 'Create',
        icon: 'fas fa-user-plus',
        to: 'user.users.create',
        can: 'iprofile.api.user.create'
      },
      {
        title: 'List/Search',
        icon: 'fas fa-list-alt',
        to: 'user.users.index',
        can: 'iprofile.api.user.index'
      },
      {
        title: 'My profile',
        icon: 'fas fa-user-tie',
        to: 'user.profile.me',
      },
      /*
      {
        title: 'Departments',
        icon: 'fas fa-cubes',
        to: 'user.department',
        can: 'iprofile.api.user.deparment'
      }
      */
    ]
  },
  /*logout*/
  logout: {
    title: 'Sign out',
    icon: 'fas fa-sign-out-alt',
    to: 'auth.logout'
  }
}
