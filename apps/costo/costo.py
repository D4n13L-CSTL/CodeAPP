
import sqlite3
from pathlib import Path

base_dir  = Path().resolve()
db_path = base_dir / "DATABASE.db"


def get_db():
    conexion = sqlite3.connect(str(db_path))
    return conexion


class Tabla_Costo:

    def consultar(self, id):
        coneccion = get_db()
        pointer = coneccion.cursor()
        pointer.execute(f"""SELECT 
                        CODIFICACION.BARRA as BARRA,
                        CODIFICACION.PRODUCTO as PRODUCTO,
                        CODIFICACION.EMPAQUE as EMPAQUE,
                        CODIFICACION.COSTO as COSTO,
                        CODIFICACION.DEPARTAMENTO as DEPARTAMENTO,
                        CODIFICACION.GRUPO as GRUPO,
                        CODIFICACION.SUBGRUPO as SUBGRUPO,
                        CODIFICACION.UTILIDAD as UTILIDAD,
                        CODIFICACION.IVA as IVA,
                        CODIFICACION.PROVEEDOR as PROVEEDOR,
                        CODIFICACION.TIPO as TIPO,
                        CODIFICACION.MODELO as MODELO,
                        CODIFICACION.MONEDA as MONEDA,
                        CODIFICACION.CODIGO_TIO as CODIGO_TIO,
                        CODIFICACION.MARCA as MARCA

                        FROM Codificacion
                        JOIN MesaTrabajo ON Codificacion.mesa_id = MesaTrabajo.id
                        WHERE MesaTrabajo.id = {id} AND CODIFICACION.ESTATUS= 'PENDIENTE';
                        """)
        columns = [column[0] for column in pointer.description]
        rows = pointer.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        pointer.close()
        return rows

    def update(self, *args):
            try:
                coneccion = get_db()
                pointer = coneccion.cursor()
                pointer.execute(""" UPDATE CODIFICACION SET COSTO = ? , UTILIDAD = ? , IVA = ?, TIPO = ? , ESTATUS = ?, TXT = ? WHERE CODIGO_TIO = ?""", args)
                coneccion.commit()
                coneccion.close()
            except sqlite3.ProgrammingError as e:
                 return e
            
    def update_descarga(self, *args):
            try:
                coneccion = get_db()
                pointer = coneccion.cursor()
                pointer.execute(""" UPDATE CODIFICACION SET TXT = ? WHERE ESTATUS = 'PROCESADO'""", args)
                coneccion.commit()
                coneccion.close()
            except sqlite3.ProgrammingError as e:
                 return e
    
    
    def update_carga_again(self, *args):
            try:
                coneccion = get_db()
                pointer = coneccion.cursor()
                pointer.execute(""" UPDATE CODIFICACION SET TXT = ? WHERE MESA_ID = ?""", args)
                coneccion.commit()
                coneccion.close()
            except sqlite3.ProgrammingError as e:
                 return e
    
    def update_datos_again(self, *args):
            try:
                coneccion = get_db()
                pointer = coneccion.cursor()
                pointer.execute(""" UPDATE CODIFICACION SET ESTATUS = ?, TXT = ? WHERE MESA_ID = ?""", args)
                coneccion.commit()
                coneccion.close()
            except sqlite3.ProgrammingError as e:
                 return e
        
    #CODIFICACION VISTA







def conteo_codigo():
    coneccion = get_db()
    pointer = coneccion.cursor()
    pointer.execute("SELECT count(CODIGO_TIO) FROM CODIFICACION WHERE TXT = 'CARGA'" )
    rows = pointer.fetchall()
    pointer.close()
    return rows[0][0]



def contenedores():
    coneccion = get_db()
    pointer = coneccion.cursor()
    pointer.execute("SELECT * FROM MesaTrabajo WHERE Estado_Costo = 'ACTIVA'")
    rows = pointer.fetchall()
    pointer.close()
    return rows




def update_mesas(*args):
            try:
                coneccion = get_db()
                pointer = coneccion.cursor()
                pointer.execute(""" UPDATE MesaTrabajo SET Estado_Costo = ? WHERE id = ?""", args)
                coneccion.commit()
                coneccion.close()
            except sqlite3.ProgrammingError as e:
                 return e