import sqlite3
from pathlib import Path
import os

base_dir  = Path().resolve()
db_path = base_dir / "DATABASE.db"

def get_db():
    conexion = sqlite3.connect(str(db_path))
    return conexion

# Ir un nivel arriba para encontrar "archivos"
DIRECTORIO_ARCHIVOS = os.path.join(base_dir, "archivos")
 # Convertir a ruta absoluta

# Crear la carpeta si no existe
os.makedirs(DIRECTORIO_ARCHIVOS, exist_ok=True)

# Ruta del archivo

def nombre(nombre):
    ARCHIVO_NOMBRE = os.path.join(DIRECTORIO_ARCHIVOS, f"{nombre}.txt")
    return ARCHIVO_NOMBRE

def consultar():
        coneccion = get_db()
        pointer = coneccion.cursor()
        pointer.execute("SELECT * FROM CODIFICACION WHERE TXT = 'CARGA'" )
        columns = [column[0] for column in pointer.description]
        rows = pointer.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        pointer.close()
        return rows

datos = consultar()
print(datos)

    
"""def generar_txt(nombre_file):
    with open(nombre(nombre_file), "w", encoding="utf-8") as file:
        for fila in datos:
            nueva_fila = fila[1:-2]  # Excluye el primer elemento, la penúltima y la última posición
            file.write("|".join(map(str, nueva_fila)) + "\n")

"""