// Renders Markdown typed in the admin panel. Content comes only from the repo
// (written by site editors), so the HTML is trusted.
import { marked } from 'marked';

export const md = (text: string) => marked.parse(text, { async: false });
export const mdInline = (text: string) => marked.parseInline(text, { async: false });
