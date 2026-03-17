import re
import os
import json
root = r"c:\Users\kevoh\Documents\personal-website"
pattern = re.compile(r"img/[^\"' )>]+")
allowed = {
    "img/ATS resume.png",
    "img/coding-image.jpg",
    "img/diary.png",
    "img/hero-bg.jpg",
    "img/icon-512x512.png",
    "img/logo.png",
    "img/profile.jpg",
}
extra = {}
for dirpath, _, filenames in os.walk(root):
    for fname in filenames:
        if not fname.lower().endswith((
            ".html",
            ".css",
            ".js",
            ".json",
            ".xml",
            ".webmanifest",
            ".md",
            ".txt",
            ".svg",
        )):
            continue
        path = os.path.join(dirpath, fname)
        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
        except UnicodeDecodeError:
            continue
        for match in pattern.findall(content):
            if match not in allowed:
                extra.setdefault(match, []).append(os.path.relpath(path, root))
for key in sorted(extra):
    print(f"{key}: {sorted(set(extra[key]))}")
if not extra:
    print("No mismatched references found")
