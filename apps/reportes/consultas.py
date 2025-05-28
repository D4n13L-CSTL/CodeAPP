import sqlite3
from pathlib import Path

base_dir  = Path().resolve()
db_path = base_dir / "DATABASE.db"


def get_db():
    conexion = sqlite3.connect(str(db_path))
    return conexion


def ver_contenedores():
    conexion = get_db()
    cursor = conexion.cursor()
    cursor.execute('SELECT id, nombre FROM MesaTrabajo')
    contenedores = cursor.fetchall()
    cursor.close()
    conexion.close()
    return contenedores


def conteneo_de_codigo(id):
    conexion = get_db()
    cursor = conexion.cursor()
    cursor.execute(f"""
                    SELECT
                    count(CODIFICACION.CODIGO_TIO) as Cantidad_codigos,
                    MesaTrabajo.nombre as Container
                    FROM Codificacion
                    JOIN MesaTrabajo ON Codificacion.mesa_id = MesaTrabajo.id
                    WHERE MesaTrabajo.id = {id}
                   """)
    columns = [column[0] for column in cursor.description]
    contenedores = cursor.fetchall()
    data = [dict(zip(columns, row)) for row in contenedores]
    cursor.close()
    conexion.close()
    return data


def codigos_x_contenedor(id):
    conexion = get_db()
    cursor = conexion.cursor()
    cursor.execute(f"""
                    SELECT 
                    CODIFICACION.CODIGO_TIO as CODIGO_TIO,
                    MesaTrabajo.nombre as Container
                    FROM Codificacion
                    JOIN MesaTrabajo ON Codificacion.mesa_id = MesaTrabajo.id
                    WHERE MesaTrabajo.id = {id}
                   """)
    columns = [column[0] for column in cursor.description]
    contenedores = cursor.fetchall()
    data = [dict(zip(columns, row)) for row in contenedores]
    cursor.close()
    conexion.close()
    return data




