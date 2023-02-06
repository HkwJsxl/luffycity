import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import LightCourse from '@/views/LightCourse.vue'
import FreeCourse from '@/views/FreeCourse.vue'
import ActualCourse from '@/views/ActualCourse.vue'
import FreeCourseDetail from "@/views/FreeCourseDetail.vue";
import CourseSearch from "@/views/CourseSearch.vue";
import PaySuccess from "@/views/PaySuccess.vue";
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/free-course',
        name: 'FreeCourse',
        component: FreeCourse
    }, {
        path: '/light-course',
        name: 'LightCourse',
        component: LightCourse
    }, {
        path: '/actual-course',
        name: 'ActualCourse',
        component: ActualCourse
    },
    {
        path: '/free/detail/:pk',
        name: 'CourseDetail',
        component: FreeCourseDetail
    },
    {
        path: '/course/search',
        name: 'CourseSearch',
        component: CourseSearch,
    },
    {
        path: '/pay/success',
        name: 'PaySuccess',
        component: PaySuccess
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
