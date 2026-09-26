from pathlib import Path
p=Path(r"D:\quantum-world\src\components\CurriculumPath.jsx")
for i,line in enumerate(p.read_text(encoding="utf-8").splitlines(),1):
    if "'s" in line or "n't" in line:
        print(i,line)
