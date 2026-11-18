from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
with ZipFile(root / 'public/labs/model-lab-cpp.zip', 'w', ZIP_DEFLATED) as bundle:
    for source in sorted((root / 'labs').iterdir()):
        if source.is_file():
            bundle.write(source, 'model-lab-labs/' + source.name)
print('Packaged C++ lab sources')
