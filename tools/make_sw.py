#!/usr/bin/env python3
"""Génère sw.js (service worker) avec la liste des fichiers à mettre en cache et un numéro de
version calculé sur leur contenu. À relancer après CHAQUE modification :  python3 tools/make_sw.py
(Sans cela, les visiteurs qui ont déjà installé l'appli verraient d'anciens fichiers hors-ligne.)"""
import glob, hashlib, io, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
files = ['index.html', 'manifest.json'] + sorted(glob.glob('css/*.css') + glob.glob('js/*.js') + glob.glob('vendor/three/*.js') + glob.glob('icons/*.png'))
h = hashlib.sha1()
for f in files: h.update(open(f, 'rb').read())
version = h.hexdigest()[:10]
tpl = io.open('tools/sw.template.js', encoding='utf8').read()
out = tpl.replace('__VERSION__', version).replace('__PRECACHE__', ',\n  '.join('"./%s"' % f if f != 'index.html' else '"./"' for f in files))
io.open('sw.js', 'w', encoding='utf8').write(out)
print('sw.js généré — version', version, '—', len(files), 'fichiers précachés')
