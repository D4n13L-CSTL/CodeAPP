import sqlite3
from pathlib import Path

base_dir  = Path().resolve()
db_path = base_dir / "DATABASE.db"


def get_db():
    conexion = sqlite3.connect(str(db_path))
    return conexion


class Tabla_Costo:

    def consultar(self):
        coneccion = get_db()
        pointer = coneccion.cursor()
        pointer.execute("SELECT * FROM CODIFICACION WHERE ESTATUS = 'PENDIENTE'")
        columns = [column[0] for column in pointer.description]
        rows = pointer.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        pointer.close()
        return rows


    def insertar(self, *args):
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
            
    def insertar_costo(self, *args):
            try:
                coneccion = get_db()
                pointer = coneccion.cursor()
                pointer.execute("""INSERT INTO COSTO ("BARRA","PRODUCTO","EMPAQUE","COSTO","DEPARTAMENTO","GRUPO","SUBGRUPO","UTILIDAD","IVA","PROVEEDOR","TIPO","MODELO","MONEDA","CODIGO_TIO","MARCA", "ESTATUS")
                                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                                """, args)
                coneccion.commit()
            except sqlite3.InternalError as r:
                coneccion.rollback()
                return r
            finally:
                coneccion.close()  # Cerrar la conexión para evitar bloqueos
    
    def update_valor(self, *args):
            try:
                coneccion = get_db()
                pointer = coneccion.cursor()
                pointer.execute(""" UPDATE 
                                CODIFICACION SET BARRA = ? , PRODUCTO = ? ,EMPAQUE = ? , PROVEEDOR = ? , MODELO = ? , CODIGO_TIO=? , MARCA = ? WHERE CODIGO_TIO = ?""", args)
                coneccion.commit()
                coneccion.close()
            except sqlite3.ProgrammingError as e:
                 return e
        

