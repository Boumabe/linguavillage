#!/usr/bin/env python3
"""Migration de couleurs/typographies : thème « Lagon » (ancien thème marine + or).
Usage : python3 tools/rebrand.py   (idempotent : peut être relancé sans risque)"""
import re, glob, io
HEX = {
  # or -> papaye
  'ffd700':'ff8a5b','e8b84b':'ff9d75','ffd966':'ffb08f','ffcc55':'ffb08f','c87941':'e2643a','ff6b00':'e2643a',
  # accents
  '4ecf70':'37d6a5','4a9eff':'5ab8ff','c084fc':'b79cff','e040fb':'ff7eb6','aa44ff':'b79cff',
  'ff6b6b':'ff6b7f','e05555':'ff6b7f','ff7070':'ff8a99','ff5050':'ff5d73','ff9f43':'ffc15a',
  # texte
  'f0e8d0':'eaf4f0','e8e0d0':'eaf4f0','f0ead6':'eaf4f0','9b8e77':'8fb1ac',
  # fonds
  '06080e':'071417','090c15':'0a1b1f','0e1322':'10262b','131928':'163239','07090f':'071417',
  '0f1830':'10262b','0a0a14':'081a1e','0d1a2e':'0d2228','060c1a':'06161a','030a18':'04141a','1a2233':'163239',
}
RGB = {
  '255,215,0':'255,138,91','232,184,75':'255,157,117','78,207,112':'55,214,165','74,158,255':'90,184,255',
  '192,132,252':'183,156,255','224,64,251':'255,126,182','255,107,107':'255,107,127','224,85,85':'255,107,127',
  '255,80,80':'255,93,115','255,159,67':'255,193,90','240,234,214':'234,244,240','232,224,208':'234,244,240',
  '6,8,14':'7,20,23','4,6,14':'7,20,23','6,8,16':'7,20,23','7,9,15':'7,20,23','6,12,26':'6,22,26',
}
files = glob.glob('css/*.css') + glob.glob('js/*.js') + ['index.html']
total = 0
for f in files:
    s = io.open(f, encoding='utf8').read(); o = s
    s = re.sub(r'#([0-9a-fA-F]{6})\b', lambda m: '#'+HEX.get(m.group(1).lower(), m.group(1)) if m.group(1).lower() in HEX else m.group(0), s)
    s = re.sub(r'rgba\((\d+),\s*(\d+),\s*(\d+)', lambda m: 'rgba(%s'%RGB['%s,%s,%s'%m.groups()] if '%s,%s,%s'%m.groups() in RGB else m.group(0), s)
    # typographie : Cinzel (serif fantasy) -> police d'affichage du thème
    s = re.sub(r"font-family:\s*(?:'Cinzel'|Cinzel)[^;\"'}]*", 'font-family:var(--font-display)', s)
    if s != o:
        io.open(f, 'w', encoding='utf8').write(s); total += 1
        print('  modifié:', f)
print(total, 'fichiers migrés')
