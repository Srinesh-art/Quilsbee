from pathlib import Path
p=Path(r"D:\quantum-world\src\components\CurriculumPath.jsx")
s=p.read_text(encoding="utf-8")
s=s.replace(chr(92)+"’","’")
p.write_text(s,encoding="utf-8")
print("fixed")
