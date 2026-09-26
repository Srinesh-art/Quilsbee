import os

def write(filepath, lines):
    full = os.path.abspath(filepath)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as out:
        out.write('\n'.join(lines) + '\n')
    print('WROTE:', filepath)
