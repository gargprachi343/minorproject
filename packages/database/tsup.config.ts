import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/connection.ts', 'src/models/**/*.ts'],
    format: ['esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
})
