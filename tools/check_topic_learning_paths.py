#!/usr/bin/env python3
"""Fail when a syllabus topic regresses into a link-only landing page.

Mechanical structural gate only: it does not certify accuracy, relevance or UX.
"""
from pathlib import Path
import re,sys
ROOT=Path(__file__).resolve().parents[1]
TOPICS=sorted((ROOT/'docs/topics').glob('*.md'))
errors=[]
if len(TOPICS)!=15:errors.append(f'Expected 15 topic pages; got {len(TOPICS)}')
for i,p in enumerate(TOPICS,1):
 data=p.read_text(encoding='utf-8')
 if not p.name.startswith(f'{i:02d}-'):errors.append(f'Unexpected order/file {p.name}')
 if len(data)<7000:errors.append(f'{p.name}: insufficient lesson content ({len(data)} chars)')
 if '## Основной материал' in data:errors.append(f'{p.name}: link-only landing-page heading returned')
 if not re.search(r'^## Проверьте себя\s*$',data,re.M):errors.append(f'{p.name}: no self-check')
 blocks=re.findall(r'<div class="quiz"\s+data-question-id="([^"]+)">(.*?)</div>',data,re.S)
 if len(blocks)<3:errors.append(f'{p.name}: found only {len(blocks)} interactive questions')
 ids=[q[0] for q in blocks]
 if len(ids)!=len(set(ids)):errors.append(f'{p.name}: duplicate question IDs')
 for qid,block in blocks:
  if len(re.findall(r'<button\b',block))!=4:errors.append(f'{p.name}: {qid} does not have four answers')
  if len(re.findall(r'data-correct="true"',block))!=1:errors.append(f'{p.name}: {qid} does not have one correct option')
  if 'data-explanation=' not in block:errors.append(f'{p.name}: {qid} lacks explanatory feedback')
 if data.count('## Навигация')!=1:errors.append(f'{p.name}: missing/duplicate navigation')
print(f'Topics: {len(TOPICS)}, interactive checks: {sum(len(re.findall(r"<div class=\"quiz\"",p.read_text())) for p in TOPICS)}')
if errors:
 for e in errors:print('[FAIL]',e)
 sys.exit(1)
print('[PASS] 15 full topics and inline quiz structural checks')
