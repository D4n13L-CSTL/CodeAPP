from openpyxl import Workbook
import pandas as pd
import sqlite3
from pathlib import Path

base_dir  = Path().resolve()
db_path = base_dir / "DATABASE.db"


def get_db():
    conexion = sqlite3.connect(str(db_path))
    return conexion


# Cargar el archivo Excel
archivo = "libro.xlsx"
df = pd.read_excel(archivo, skiprows=5)
df.fillna("", inplace=True)
columnas = ['CÓDIGO TÍO','COSTO TOTAL UNITARIO','RENTABILIDAD ESTIMADA POR ARTÍCULO' , 'IVA']  # Nombres de las columnas que deseas

df_seleccionado = df[columnas]
df_seleccionado = df.iloc[:, [df.columns.get_loc("CÓDIGO TÍO"), df.columns.get_loc("COSTO TOTAL UNITARIO"), df.columns.get_loc("RENTABILIDAD ESTIMADA POR ARTÍCULO"), df.columns.get_loc("IVA") + 13]]

print(df_seleccionado)

