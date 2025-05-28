import sqlite3
from pathlib import Path

base_dir  = Path().resolve()
db_path = base_dir / "DATABASE.db"


def get_db():
    conexion = sqlite3.connect(str(db_path))
    return conexion

def crear_mesa(nombre,estado):
    conexion = get_db()
    cursor = conexion.cursor()
    cursor.execute('INSERT INTO MesaTrabajo (nombre, Estado) VALUES (?,?)',(nombre,estado))
    conexion.commit()
    cursor.close()
    conexion.close()
    


def insertar(*args):
            try:
                coneccion = get_db()
                pointer = coneccion.cursor()
                pointer.execute("""INSERT INTO CODIFICACION ("BARRA","PRODUCTO","EMPAQUE","COSTO","DEPARTAMENTO","GRUPO","SUBGRUPO","UTILIDAD","IVA","PROVEEDOR","TIPO","MODELO","MONEDA","CODIGO_TIO","MARCA", "ESTATUS", "MESA_ID")
                                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                                """, args)
                coneccion.commit()
            except sqlite3.InternalError as r:
                coneccion.rollback()
                return r
            finally:
                coneccion.close()
                

def update_mesas(*args):
            try:
                coneccion = get_db()
                pointer = coneccion.cursor()
                pointer.execute(""" UPDATE MesaTrabajo SET Estado = ? , Estado_Costo = ? WHERE id = ?""", args)
                coneccion.commit()
                coneccion.close()
            except sqlite3.ProgrammingError as e:
                 return e


def borar_mesa(*args):
            try:
                coneccion = get_db()
                pointer = coneccion.cursor()
                pointer.execute(""" DELETE FROM MesaTrabajo WHERE nombre = ?""", args)
                coneccion.commit()
                coneccion.close()
            except sqlite3.ProgrammingError as e:
                 return e
             
            
def consultar_mesa():
        conexion = get_db()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM MesaTrabajo WHERE ESTADO = 'ACTIVA'")              
        columns = [column[0] for column in cursor.description]
        rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        conexion.close()
        return rows


def consultar_mesa_lista_updating():
        conexion = get_db()
        cursor = conexion.cursor()
        cursor.execute("SELECT id, nombre FROM MesaTrabajo WHERE ESTADO = 'ACTIVA'")              
        columns = [column[0] for column in cursor.description]
        rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        conexion.close()
        return data



#mesa por id
def consultar_mesa_id(id):
        conexion = get_db()
        cursor = conexion.cursor()
        cursor.execute(f"""SELECT 
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
                        WHERE MesaTrabajo.id = {id};
                        """)              
        columns = [column[0] for column in cursor.description]
        rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        conexion.close()
        return rows
    


#cambiar nombre de mesa_trabajo
def update_nombre_mesa(*args):
            try:
                coneccion = get_db()
                pointer = coneccion.cursor()
                pointer.execute(""" UPDATE MesaTrabajo SET nombre = ? WHERE id = ?""", args)
                coneccion.commit()
                coneccion.close()
            except sqlite3.ProgrammingError as e:
                 return e
