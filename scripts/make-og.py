#!/usr/bin/env python3
"""Renders public/og/og-{en,es}.png (1200x630) from src content + the site's fonts.

Not part of the build: run it by hand when the name, role or illustration changes.
Needs Python with `playwright` (Chromium) and `pyyaml`.
"""
import pathlib, re, tempfile, yaml
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
profile = yaml.safe_load((ROOT / 'src/content/profile.yaml').read_text(encoding='utf-8'))
svg = re.search(r'<svg class="ill-d".*?</svg>', (ROOT / 'src/components/Illustration.astro').read_text(), re.S).group(0)
svg = re.sub(r'<g fill="#6e6e6e".*?</g>', '', svg, flags=re.S)  # drop the text labels
svg = svg.replace('class="ill-d"', 'width="470" height="470"')
fonts = {n: (ROOT / f'public/fonts/{n}.woff2').resolve().as_uri() for n in
         ('eb-garamond-latin-400-normal', 'eb-garamond-latin-400-italic', 'inter-latin-400-normal')}
domain = 'jfcastillo.chusquisimas.com'

def page(loc):
    l1, l2 = profile['nameLines']
    return f"""<!doctype html><meta charset="utf-8"><style>
@font-face{{font-family:G;src:url({fonts['eb-garamond-latin-400-normal']})}}
@font-face{{font-family:I;src:url({fonts['inter-latin-400-normal']})}}
*{{box-sizing:border-box;margin:0}}
body{{width:1200px;height:630px;background:#f2f2f2;color:#181818;font-family:G;position:relative;overflow:hidden}}
.top,.bot{{position:absolute;left:0;right:0;display:flex;font:400 15px I;letter-spacing:.017em}}
.top{{top:0;border-bottom:1px solid #181818}} .bot{{bottom:0;border-top:1px solid #181818}}
.top div,.bot div{{padding:16px 30px;flex:1;border-left:1px solid #181818}} .top div:first-child,.bot div:first-child{{border-left:0}}
h1{{position:absolute;left:30px;top:118px;font-weight:400;font-size:100px;line-height:.95;letter-spacing:-.005em}}
p{{position:absolute;left:30px;width:640px;font-size:28px;line-height:1.2;letter-spacing:.016em}}
.k{{top:372px;font:400 17px I;letter-spacing:.017em}} .l{{top:410px}}
svg{{position:absolute;right:20px;top:110px}}
</style>
<div class="top"><div>{profile['name']}</div><div>{profile['headerRole'][loc]}</div></div>
<h1>{l1}<br>{l2}</h1>
<p class="k">{profile['tagline'][loc]}</p>
<svg-holder>{svg}</svg-holder>
<div class="bot"><div>{domain}</div><div>{'English' if loc == 'en' else 'Español'}</div></div>"""

out = ROOT / 'public/og'; out.mkdir(exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1200, 'height': 630})
    for loc in ('en', 'es'):
        with tempfile.NamedTemporaryFile('w', suffix='.html', dir=ROOT, delete=False, encoding='utf-8') as f:
            f.write(page(loc))
        pg.goto(pathlib.Path(f.name).as_uri()); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(300)
        pathlib.Path(f.name).unlink()
        pg.screenshot(path=str(out / f'og-{loc}.png'))
    b.close()
print('ok')
