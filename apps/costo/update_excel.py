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
def update_excel(nombre):
    archivo = "libro.xlsx"
    df = pd.read_excel(BytesIO(nombre.read()), skiprows=5, dtype={'IVA': str})
    df.fillna("", inplace=True)
    #columnas = ['CÓDIGO TÍO','COSTO TOTAL UNITARIO','RENTABILIDAD ESTIMADA POR ARTÍCULO' , 'IVA']  # Nombres de las columnas que deseas


    
    df_seleccionado = df.iloc[:, [df.columns.get_loc("CÓDIGO TÍO"), df.columns.get_loc("COSTO TOTAL UNITARIO"), df.columns.get_loc("RENTABILIDAD ESTIMADA POR ARTÍCULO"), df.columns.get_loc("IVA") + 13]]

    return df_seleccionado



   
def update_tabla_upload(args):
    coneccion = get_db()
    pointer = coneccion.cursor() 
    
    for i in args:
        insert  = " UPDATE CODIFICACION SET COSTO = ? , UTILIDAD = ? , IVA = ?, TIPO = 0 , ESTATUS = 'PROCESADO', TXT = 'CARGA' WHERE CODIGO_TIO = ?"
        pointer.execute(insert, i)


    coneccion.commit()
    coneccion.close()

