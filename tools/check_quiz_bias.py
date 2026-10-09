#!/usr/bin/env python3
"""Static psychometric anti-cue check for a JSON bank embedded in test-bank.js.

Checks mechanical cues only. Passing is not equivalent to pedagogical validity.
"""
from pathlib import Path
import argparse, json, re, statistics, sys

def bank_from_js(p):
    raw=Path(p).read_text(encoding='utf-8')
    m=re.search(r'const BANK\s*=\s*(\[.*?\]);\s*\n',raw,re.S)
    if not m:
        raise ValueError('Could not locate BANK array')
    return json.loads(m.group(1))

def assess(bank):
    detail=[]
    for q in bank:
        options=q['options']; correct=q['answer']
        if len(options)!=4 or not 0<=correct<4:
            raise ValueError('Malformed question '+str(q.get('n')))
        lens=[len(x.strip()) for x in options]
        c=lens[correct];others=[v for i,v in enumerate(lens) if i!=correct]
        detail.append(dict(number=q['n'],correct_position=correct,correct_length=c,lengths=lens,
          longest=c>max(others),shortest=c<min(others),
          margin_longest=c-max(others),ratio=max(lens)/max(1,min(lens)),
          mean_wrong_length=round(statistics.mean(others),1)))
    n=len(detail)
    return {'count':n,'longest_count':sum(x['longest'] for x in detail),
       'shortest_count':sum(x['shortest'] for x in detail),
       'longest_share':sum(x['longest'] for x in detail)/n,
       'shortest_share':sum(x['shortest'] for x in detail)/n,
       'high_spread':sum(x['ratio']>1.6 for x in detail),
       'answer_positions':[sum(x['correct_position']==j for x in detail) for j in range(4)],
       'detail':detail}

def main():
    parser=argparse.ArgumentParser();parser.add_argument('bank_js');parser.add_argument('--report',default=None)
    a=parser.parse_args();v=assess(bank_from_js(a.bank_js))
    print(f"Questions: {v['count']}")
    print(f"Unique correct longest: {v['longest_count']}/{v['count']} = {100*v['longest_share']:.1f}%")
    print(f"Unique correct shortest: {v['shortest_count']}/{v['count']} = {100*v['shortest_share']:.1f}%")
    print(f"Max/min text length > 1.6: {v['high_spread']}/{v['count']}")
    print(f"Correct-position counts: {v['answer_positions']}")
    if a.report: Path(a.report).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    # An alarm threshold for cueing: 35% rather than the ideal 25% for a four-option item.
    if v['longest_share']>0.35 or v['shortest_share']>0.35:
        print('FAIL: Correct-answer length is a predictable cue (threshold 35%).')
        return 1
    print('Length-only gate passed; subject-matter review is still required.')
    return 0
if __name__=='__main__':sys.exit(main())
