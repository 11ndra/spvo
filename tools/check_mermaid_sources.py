#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
MKDOCS = ROOT / "mkdocs.yml"
errors = []
count = 0

fence_re = re.compile(r"```mermaid\s*\n(.*?)\n```", re.S)
for path in sorted(DOCS.rglob("*.md")):
    text = path.read_text(encoding="utf-8")
    opens = text.count("```mermaid")
    blocks = fence_re.findall(text)
    if opens != len(blocks):
        errors.append(f"{path.relative_to(ROOT)}: unclosed or malformed Mermaid fence")
    for idx, code in enumerate(blocks, 1):
        count += 1
        if "\\n" in code:
            errors.append(
                f"{path.relative_to(ROOT)} Mermaid #{idx}: literal \\n in label; use <br/> inside a quoted label"
            )
        if not re.search(r"(?m)^\s*(flowchart|graph|sequenceDiagram|stateDiagram|classDiagram|erDiagram)\b", code):
            errors.append(f"{path.relative_to(ROOT)} Mermaid #{idx}: missing supported diagram declaration")
        # Unquoted slash-leading [labels] are ambiguous with Mermaid shape syntax.
        if re.search(r"\[\s*/[^\]\n]*\]", code):
            errors.append(f"{path.relative_to(ROOT)} Mermaid #{idx}: slash-leading node label must be quoted")

mk = MKDOCS.read_text(encoding="utf-8")
if "mermaid@11.17.2/dist/mermaid.min.js" not in mk:
    errors.append("mkdocs.yml: pinned Mermaid 11.17.2 runtime is missing")
if "assets/javascripts/mermaid-init.js" not in mk:
    errors.append("mkdocs.yml: mermaid-init.js is missing")

if errors:
    for err in errors:
        print(f"[FAIL] {err}")
    print(f"[FAIL] Mermaid source QA errors: {len(errors)}")
    sys.exit(1)

print(f"[PASS] Mermaid source QA: {count} diagram(s)")
