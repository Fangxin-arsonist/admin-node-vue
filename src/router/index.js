import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {title: '首页', icon: 'home', affix: true}
      }
    ]
  }
];

export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    meta: {title: '用户管理', icon: 'peoples',permission: '/user'},
    children: [
      {
        name:'userList',
        path: '/user/index',
        component: () => import('@/views/user/index'),
        meta: {title: '用户管理', icon: 'peoples',permission: '/user/index'},
      },
      {
        name:'userCreate',
        path: '/user/create',
        hidden:true,
        component: () => import('@/views/user/create'),
        meta: {title: '添加用户', activeMenu:'/user/index',permission: '/user/create'},
      },
      {
        name:'userEdit',
        path: '/user/edit/:id',
        component: () => import('@/views/user/edit'),
        hidden:true,
        meta: {title: '编辑用户',activeMenu:'/user/index',permission: '/user/edit'},

      }
    ]
  },
  {
    path: '/company',
    component: Layout,
    meta: {title: '单位管理', icon: 'company',roles:['admin','companyManage'],permission: '/company'},
    children: [
      {
        name:'companyList',
        path: '/company/index',
        component: () => import('@/views/company/index'),
        meta: {title: '单位管理', icon: 'company',roles:['admin','companyList'],permission: '/company/index'},
      },
      {
        name:'companyCreate',
        path: '/company/create',
        hidden:true,
        component: () => import('@/views/company/create'),
        meta: {title: '添加单位', roles:['admin','companyCreate'],activeMenu:'/company/index',permission: '/company/create'},
      },
      {
        name:'companyEdit',
        path: '/company/edit/:id',
        component: () => import('@/views/company/edit'),
        hidden:true,
        meta: {title: '编辑单位', roles:['admin','companyEdit'],activeMenu:'/company/index',permission: '/company/edit'},

      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    meta: {title: '角色管理', icon: 'user',permission: '/role'},
    children: [
      {
        name:'roleList',
        path: '/role/index',
        component: () => import('@/views/role/index'),
        meta: {title: '角色管理', icon: 'user',permission: '/role/index'},
      },
      {
        name:'roleCreate',
        path: '/role/create',
        hidden:true,
        component: () => import('@/views/role/create'),
        meta: {title: '添加角色',activeMenu:'/role/index',permission: '/role/create'},
      },
      {
        name:'roleEdit',
        path: '/role/edit/:id',
        component: () => import('@/views/role/edit'),
        hidden:true,
        meta: {title: '编辑角色',activeMenu:'/role/index',permission: '/role/edit'},

      }
    ]
  },
  {
    path: '/machine',
    component: Layout,
    meta: {title: '设备管理', icon: 'machine',permission: '/machine'},
    children: [
      {
        name:'machineList',
        path: '/machine/index',
        component: () => import('@/views/machine/index'),
        meta: {title: '设备管理', icon: 'machine',permission: '/machine/index'},
      },
      {
        name:'machineCreate',
        path: '/machine/create',
        hidden:true,
        component: () => import('@/views/machine/create'),
        meta: {title: '添加设备',activeMenu:'/machine/index',permission: '/machine/create'},
      },
      {
        name:'machineEdit',
        path: '/machine/edit/:id',
        component: () => import('@/views/machine/edit'),
        hidden:true,
        meta: {title: '编辑设备',activeMenu:'/machine/index',permission: '/machine/edit'},
      }
    ]
  },
  {
    path: '/queryRecord',
    component: Layout,
    meta: {title: '查询记录管理', icon: 'record', permission: '/queryRecord'},
    children: [
      {
        name: 'queryRecordList',
        path: '/queryRecord/index',
        component: () => import('@/views/queryRecord/index'),
        meta: {title: '查询记录', icon: 'list', permission: '/queryRecord/index'},
      },
      {
        name:'queryRecordDetail',
        path: '/queryRecord/detail/:id',
        component: () => import('@/views/queryRecord/detail'),
        hidden:true,
        meta: {title: '记录详情',activeMenu:'/queryRecord/detail',permission: '/queryRecord/detail'},
      },
      {
        name:'queryRecordStatistics',
        path: '/queryRecord/statistics',
        component: () => import('@/views/queryRecord/statistics'),
        meta: {title: '记录统计', icon: 'statistics', activeMenu:'/queryRecord/Statistics',permission: '/queryRecord/statistics'},
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
];

const createRouter = () => new Router({
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
