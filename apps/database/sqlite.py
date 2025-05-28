import sqlite3

def insertar_codigo(c_tio,c_alterno,marca,modelo,fecha_creacion):
    conexion = sqlite3.connect('DATABASE.db')
    curson = conexion.cursor()
    curson.execute('INSERT INTO productos (codigo_tio,  ,marca,modelo,fecha_creacion) VALUES (?,?,?,?,?)',(c_tio,c_alterno,marca,modelo,fecha_creacion))
    conexion.commit()
    conexion.close()
    
def provedor(c_provedor,n_provedor,c_tio_id):
    conexion = sqlite3.connect('DATABASE.db')
    curson = conexion.cursor()
    curson.execute('INSERT INTO PROVEDORES (c_provedor,n_provedor,c_tio_id) VALUES (?,?,?)',(c_provedor,n_provedor,c_tio_id))
    conexion.commit()
    conexion.close()

def consulta_codigo_tio():
    conexion = sqlite3.connect('DATABASE.db')
    curson = conexion.cursor()
    curson.execute('SELECT * FROM PROVEDORES')
    data = curson.fetchall()
    conexion.close()
    return data






