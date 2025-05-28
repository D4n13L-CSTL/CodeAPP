from openpyxl import Workbook
import pandas as pd
import sqlite3
from pathlib import Path
from io import BytesIO


base_dir  = Path().resolve()
db_path = base_dir / "DATABASE.db"


def get_db():
    conexion = sqlite3.connect(str(db_path))
    return conexion


# Cargar el archivo Excel
def excel_upload(nombre):
    archivo = f"{nombre}.xlsx"
    df = pd.read_excel(BytesIO(nombre.read()), dtype={'SUBGRUPO': str},engine='openpyxl')

    columnas = ['BARRA', 'PRODUCTO','EMPAQUE','COSTO','DEPARTAMENTO','GRUPO','SUBGRUPO','UTILIDAD','IVA','PROVEEDOR','TIPO','MODELO','MONEDA','CODIGO TIO','MARCA']  # Nombres de las columnas que deseas

    df_seleccionado = df[columnas]





    return df_seleccionado



def insertar_datos_from_Excel(*args):
            try:
                coneccion = get_db()
                pointer = coneccion.cursor()
                pointer.execute("""INSERT INTO CODIFICACION ("BARRA","PRODUCTO","EMPAQUE","COSTO","DEPARTAMENTO","GRUPO","SUBGRUPO","UTILIDAD","IVA","PROVEEDOR","TIPO","MODELO","MONEDA","CODIGO_TIO","MARCA", "ESTATUS", "FECHA","MESA_ID")
                                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                                """, args)
                coneccion.commit()
            except sqlite3.InternalError as r:
                coneccion.rollback()
                return r
            finally:
                coneccion.close()
