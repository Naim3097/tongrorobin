import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: ['.next/', 'src/payload-types.ts', 'src/migrations/', 'src/app/(payload)/'],
  },
]

export default eslintConfig
