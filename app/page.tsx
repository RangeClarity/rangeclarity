/* ============================================================
   Homepage (/) — RangeClarity production landing page.

   The approved design is "Range Command V2". To keep a single source of
   truth, the homepage re-exports that page's component instead of duplicating
   it, so /designs/range-command-v2 and / stay identical.

   The previous homepage (meme-fintech) is preserved, unchanged, at
   /designs/meme-fintech — nothing was deleted, and this switch is reversible
   by pointing the re-export back at ./designs/meme-fintech/page.

   SEO/meta come from app/layout.tsx (title, description, OG, etc.).
   ============================================================ */
export { default } from "./designs/range-command-v2/page";
