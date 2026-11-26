// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import BlogList from '../components/BlogList.vue'
import type { Theme } from 'vitepress'
import 'virtual:uno.css'
import './style.css'

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('BlogList', BlogList)
  },
} satisfies Theme
