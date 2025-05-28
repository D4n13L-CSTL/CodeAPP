import sqlite3
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, Color
from openpyxl.styles import Border, Side
from openpyxl.styles import Font, PatternFill, Border, Side


base_dir  = Path().resolve()
db_path = base_dir / "DATABASE.db"


def get_db():
    conexion = sqlite3.connect(str(db_path))
    return conexion 


class Insertar():

    def insertar(self, *args):
        self.conexion = get_db()
        self.cursor = self.conexion.cursor()
        self.cursor.execute(f"""INSERT INTO Ctrl_Etiquetado ("CODIGO", "PROVEEDOR","CONTADOR", "CANTIDAD_ETI", "CANTIDAD_UNIB","ETIQUETADO_POR","FECHA","container_nombre")
                            VALUES (?,?,?,?,?,?,?,?)""", args)    
        self.conexion.commit()
        self.conexion.close()



class Buscar ():
    def buscar(self, nombre,codigo):
        self.conexion = get_db()
        self.cursor = self.conexion.cursor()
        self.cursor.execute(f"""SELECT * from Ctrl_Etiquetado where CODIGO = ? OR container_nombre = ?""", (nombre,codigo))
        columns = [column[0] for column in self.cursor.description]
        rows = self.cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        self.conexion.close()
        return data

#SELECT * from Ctrl_Etiquetado where CODIGO = ? OR container_nombre = ?


