from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
EXCLUDED = {".git", ".github", "dist", "docs", "node_modules", "scripts", "tests"}

if DIST.exists():
    shutil.rmtree(DIST)
DIST.mkdir(parents=True)

for item in ROOT.iterdir():
    if item.name in EXCLUDED or item.name == "vercel.json":
        continue
    target = DIST / item.name
    if item.is_dir():
        shutil.copytree(item, target)
    else:
        shutil.copy2(item, target)

runtime_scripts = DIST / "scripts"
runtime_scripts.mkdir()
shutil.copy2(ROOT / "scripts" / "apply_two_founder_about.py", runtime_scripts / "apply_two_founder_about.py")
shutil.copy2(ROOT / "scripts" / "subash-thapa-founder-web.b64", runtime_scripts / "subash-thapa-founder-web.b64")

subprocess.run([sys.executable, str(runtime_scripts / "apply_two_founder_about.py")], check=True)
shutil.rmtree(runtime_scripts)

print("Static two-founder site generated in dist/")
