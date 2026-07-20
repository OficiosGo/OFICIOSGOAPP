/**
 * Migración: imágenes base64 (data URI) guardadas en la DB → Vercel Blob.
 *
 * Motivo: algunas fotos viejas están embebidas como base64 dentro de la base
 * (una llega a 2.1MB), inflan el payload y rompen el caché de la home.
 * Este script las sube a Blob y reemplaza la URL en la DB.
 *
 * Requisitos:
 *   - BLOB_READ_WRITE_TOKEN en el entorno (Vercel → Settings → Env, o `vercel env pull`).
 *
 * Uso:
 *   BLOB_READ_WRITE_TOKEN=xxx npx tsx scripts/migrate-base64-to-blob.ts          (dry-run: solo lista)
 *   BLOB_READ_WRITE_TOKEN=xxx npx tsx scripts/migrate-base64-to-blob.ts --apply  (ejecuta la migración)
 *
 * Antes de tocar la DB genera un backup en scripts/.backups/base64-<timestamp>.json
 */
import { db } from "@/db/client";
import { put } from "@vercel/blob";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const APPLY = process.argv.includes("--apply");
const isInline = (u?: string | null): u is string => !!u && u.startsWith("data:");

// data:image/jpeg;base64,XXXX  →  { ext, buffer }
function decodeDataUri(uri: string) {
  const match = uri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/s);
  if (!match) return null;
  const mime = match[1];
  const ext = mime.split("/")[1].replace("jpeg", "jpg").replace("svg+xml", "svg");
  return { ext, contentType: mime, buffer: Buffer.from(match[2], "base64") };
}

async function uploadInline(uri: string, name: string): Promise<string> {
  const decoded = decodeDataUri(uri);
  if (!decoded) throw new Error(`data URI no soportado en ${name}`);
  const blob = await put(`migrated/${name}.${decoded.ext}`, decoded.buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: decoded.contentType,
  });
  return blob.url;
}

(async () => {
  if (APPLY && !process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ Falta BLOB_READ_WRITE_TOKEN. Corré `vercel env pull` o exportalo antes de --apply.");
    process.exit(1);
  }

  const profiles = await db.profile.findMany({ select: { id: true, slug: true, profileImage: true } });
  const photos = await db.workPhoto.findMany({ select: { id: true, profileId: true, url: true } });

  const inlineProfiles = profiles.filter((p) => isInline(p.profileImage));
  const inlinePhotos = photos.filter((p) => isInline(p.url));

  const totalKB = [
    ...inlineProfiles.map((p) => p.profileImage!.length),
    ...inlinePhotos.map((p) => p.url.length),
  ].reduce((a, b) => a + b, 0) / 1024;

  console.log(`Perfiles con imagen base64:  ${inlineProfiles.length}`);
  console.log(`Fotos de trabajo base64:     ${inlinePhotos.length}`);
  console.log(`Peso total inline:           ${(totalKB / 1024).toFixed(1)} MB\n`);

  if (!APPLY) {
    console.log("DRY-RUN (no se modificó nada). Volvé a correr con --apply para migrar.");
    inlineProfiles.forEach((p) => console.log(`  perfil  ${p.slug} (${(p.profileImage!.length / 1024).toFixed(0)} KB)`));
    inlinePhotos.forEach((p) => console.log(`  foto    ${p.id} (${(p.url.length / 1024).toFixed(0)} KB)`));
    process.exit(0);
  }

  // Backup antes de tocar nada
  const dir = join(process.cwd(), "scripts", ".backups");
  mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = join(dir, `base64-${stamp}.json`);
  writeFileSync(backupPath, JSON.stringify({ profiles: inlineProfiles, photos: inlinePhotos }, null, 2));
  console.log(`🗄️  Backup: ${backupPath}\n`);

  let ok = 0, fail = 0;
  for (const p of inlineProfiles) {
    try {
      const url = await uploadInline(p.profileImage!, `profile-${p.id}`);
      await db.profile.update({ where: { id: p.id }, data: { profileImage: url } });
      console.log(`✅ perfil ${p.slug} → ${url}`);
      ok++;
    } catch (e) { console.error(`❌ perfil ${p.slug}:`, (e as Error).message); fail++; }
  }
  for (const ph of inlinePhotos) {
    try {
      const url = await uploadInline(ph.url, `photo-${ph.id}`);
      await db.workPhoto.update({ where: { id: ph.id }, data: { url } });
      console.log(`✅ foto ${ph.id} → ${url}`);
      ok++;
    } catch (e) { console.error(`❌ foto ${ph.id}:`, (e as Error).message); fail++; }
  }

  console.log(`\nMigradas: ${ok} · Fallidas: ${fail}`);
  process.exit(fail > 0 ? 1 : 0);
})();
