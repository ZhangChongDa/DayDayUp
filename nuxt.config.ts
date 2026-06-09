import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-08',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },

  css: ['~/assets/css/tailwind.css'],

  app: {
    head: {
      title: 'DayDayUp',
      link: [
        { rel: 'icon', type: 'image/png', href: '/brand/daydayup-logo.png' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&display=swap',
        },
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        'radix-vue',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'marked',
        'nanoid',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ],
    },
  },

  modules: [
    'shadcn-nuxt',
    '@nuxtjs/supabase',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
  ],

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    types: '~/types/database.types.ts',
  },

  i18n: {
    locales: [
      { code: 'zh', file: 'zh.json', name: '中文' },
      { code: 'en', file: 'en.json', name: 'English' },
    ],
    defaultLocale: 'zh',
    langDir: '../i18n/locales',
    strategy: 'no_prefix',
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'bearkid-color-mode',
  },

  components: {
    dirs: [{ path: '~/components', pathPrefix: false }],
  },

  runtimeConfig: {
    supabaseServiceKey: process.env.NUXT_SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY,
    openrouterApiKey:
      process.env.OPENROUTER_GEMINI35_FLASH_API_KEY
      || process.env.OPENROUTER_GEMINI3_FLASH_API_KEY
      || process.env.OPENROUTER_API_KEY,
    openrouterModel: process.env.OPENROUTER_MODEL || 'google/gemini-3.5-flash',
    dashscopeApiKey: process.env.QWEN3_ASR_FLASH_API_KEY || process.env.DASHSCOPE_API_KEY,
    qwen3AsrFlashApiKey: process.env.QWEN3_ASR_FLASH_API_KEY || process.env.DASHSCOPE_API_KEY,
    qwen3AsrBaseUrl: process.env.QWEN3_ASR_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    cosyvoiceModel: process.env.COSYVOICE_MODEL || 'cosyvoice-v3.5-flash',
    cosyvoiceVoice: process.env.COSYVOICE_VOICE || 'longanyang',
    cosyvoiceInstruction: process.env.COSYVOICE_INSTRUCTION,
    resendApiKey: process.env.NUXT_RESEND_API_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      appUrl: process.env.NUXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    },
  },

  nitro: {
    routeRules: {
      '/api/chat/stream': {
        cors: true,
        headers: {
          'Cache-Control': 'no-cache, no-transform',
          'X-Accel-Buffering': 'no',
        },
      },
    },
  },
})
