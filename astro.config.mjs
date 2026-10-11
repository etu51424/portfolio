import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { remarkTags } from './src/lib/tags.mjs';
export default defineConfig({ output: 'static', markdown: { processor: unified({ remarkPlugins: [remarkTags] }) } });
