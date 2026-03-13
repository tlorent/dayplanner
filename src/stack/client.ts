import { StackClientApp } from '@stackframe/react'

// Add type declaration for Vite's import.meta.env
declare global {
  interface ImportMeta {
    env: {
      VITE_STACK_PROJECT_ID: string
      VITE_ADMIN_EMAIL: string
    }
  }
}

export const stackClientApp = new StackClientApp({
  tokenStore: 'cookie',
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  redirectMethod: 'window',
  urls: {
    afterSignIn: '/app',
    afterSignUp: '/app',
    afterSignOut: '/',
    signIn: '/login',
    signUp: '/signup',
    accountSettings: '/handler/account-settings',
  },
})
