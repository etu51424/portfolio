import { defineCollection, z } from 'astro:content';
import { notesLoader } from './lib/notes-loader.mjs';
export const collections = { notes: defineCollection({ loader: notesLoader(), schema: z.object({ title: z.string(), domain: z.string(), kind: z.enum(['Essai','Projet','Manifeste']), summary: z.string(), related: z.array(z.string()).default([]), tags: z.array(z.string()).default([]), thumbnailTags: z.array(z.string()).default([]), thumbnail: z.string().optional(), video: z.string().url().optional(), duration: z.string().optional() }) }) };
