// Chiffre les billets avant de les publier.
//
//   JAPON_MDP='le mot de passe' node outils/chiffrer-billets.mjs
//
// Lit billets-clair/*.jpg (dossier ignoré par git, jamais publié) et écrit
// billets/<nom>.jpg.enc. L'app fait l'inverse dans le téléphone, avec le même
// mot de passe (PBKDF2-SHA256 200 000 tours → AES-256-GCM). Format d'un .enc :
// « JB1 » + IV de 12 octets + données chiffrées. Un fichier déjà à jour n'est
// pas réécrit (l'IV change à chaque chiffrement, ce qui ferait du bruit dans git).
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { webcrypto as crypto } from 'node:crypto';

const SRC = 'billets-clair', DST = 'billets', SEL = 'japon-2026-billets';
const mdp = process.env.JAPON_MDP;
if (!mdp) { console.error('Donnez le mot de passe dans JAPON_MDP.'); process.exit(1); }

const enc = new TextEncoder();
const base = await crypto.subtle.importKey('raw', enc.encode(mdp), 'PBKDF2', false, ['deriveKey']);
const cle = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: enc.encode(SEL), iterations: 200000, hash: 'SHA-256' },
  base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);

await mkdir(DST, { recursive: true });
const fichiers = (await readdir(SRC)).filter(f => /\.(jpe?g|png)$/i.test(f)).sort();
for (const f of fichiers) {
  const cible = `${DST}/${f}.enc`;
  const dejaFait = await Promise.all([stat(`${SRC}/${f}`), stat(cible)]).then(([a, b]) => b.mtimeMs >= a.mtimeMs).catch(() => false);
  if (dejaFait) { console.log('inchangé  ', cible); continue; }
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const donnees = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cle, await readFile(`${SRC}/${f}`));
  await writeFile(cible, Buffer.concat([Buffer.from('JB1'), Buffer.from(iv), Buffer.from(donnees)]));
  console.log('chiffré   ', cible);
}
console.log(fichiers.length + ' fichier(s). Pensez à les lister dans data.js (fichiers) et sw.js (FILES).');
