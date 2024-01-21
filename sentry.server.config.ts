import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://3407e4c2442bb0d11bf57de6b5d5c50d@o4506601138225152.ingest.sentry.io/4506601139863552',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
})
