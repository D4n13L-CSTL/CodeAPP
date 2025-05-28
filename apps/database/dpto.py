
import pyodbc


import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection_importadora():
    try:
        return pyodbc.connect(
            f"DRIVER={{SQL Server}};"
            f"SERVER={os.getenv('DB_SERVER')};"
            f"DATABASE={os.getenv('DB_NAME')};"
            f"UID={os.getenv('DB_USER')};"
            f"PWD={os.getenv('DB_PASSWORD')};"
            
        )
    except pyodbc.Error as e:
        raise Exception(f"Error al conectar con la base de datos: {e}")
    

def get_db_connection():
    conn_str = (
        "DRIVER={SQL Server};"
        f"SERVER={os.getenv('DB_CENTRAL_SERVER')};"
        f"DATABASE={os.getenv('DB_NAME_CENTRAL')};"
        f"UID={os.getenv('DB_USER_CENTRAL')};"
        f"PASSWORD={os.getenv('DB_PASSWORD_CENTRAL')};"
        "Trusted_Connection=no;"
    )
    
    return pyodbc.connect(conn_str)




def departamentos():
    coneccion =  get_db_connection_importadora()
    pointer = coneccion.cursor()
    pointer.execute('SELECT * FROM MA_DEPARTAMENTOS')
    data = pointer.fetchall()
    coneccion.close()
    return data



def grupos(codigo): #Grupos por parametros dl codigo del departamento
    coneccion =  get_db_connection_importadora()
    pointer = coneccion.cursor()
    pointer.execute("SELECT * FROM MA_GRUPOS WHERE c_departamento = ?",(codigo,))
    data = pointer.fetchall()
    coneccion.close()
    return data


def subgrupo(grupo, dpto):#Sub grupos por parametros de codigo de departamento y codigo de grupos
    coneccion =  get_db_connection_importadora()
    pointer = coneccion.cursor()
    pointer.execute("SELECT * FROM MA_SUBGRUPOS WHERE c_in_grupo = ? AND c_in_departamento = ?",(grupo,dpto))
    data = pointer.fetchall()
    coneccion.close()
    return data




def codigoxProvedores(provedor):
    coneccion =  get_db_connection()
    pointer = coneccion.cursor()
    pointer.execute("SELECT * FROM MA_PRODXPROV WHERE c_codprovee = ?",(provedor,))
    data = pointer.fetchall()
    coneccion.close()
    return data




#----CONSULTAS Y PRUEBAS A BBDD DE PRUEBA-------


def codigos(codigo):
    coneccion =  get_db_connection()
    pointer = coneccion.cursor()
    pointer.execute("SELECT * FROM MA_PRODUCTOS WHERE c_Codigo = ?",(codigo))
    data = pointer.fetchall()
    coneccion.close()
    return data

def codigos_ma(codigo):
    coneccion =  get_db_connection_importadora()
    pointer = coneccion.cursor()
    pointer.execute("SELECT * FROM MA_CODIGOS WHERE c_Codigo = ?",(codigo))
    data = pointer.fetchall()
    coneccion.close()
    return data






def codigos_ma(codigo):
    coneccion =  get_db_connection()
    pointer = coneccion.cursor()
    pointer.execute("SELECT * FROM MA_CODIGOS WHERE c_Codigo = ?",(codigo))
    data = pointer.fetchall()
    coneccion.close()
    return data


def sp_ultimo_codigo(dpto, grupo,subgrupo):
    coneccion =  get_db_connection()
    pointer = coneccion.cursor()
    nuevo_codigo = None
    pointer.execute("""DECLARE @nuevo_codigo NVARCHAR(50);  
                        EXEC [dbo].[sp_GenerarCodigoProducto]
                            @c_departamento = ?,
                            @c_grupo = ?,
                            @subgrupo = ?,
                            @nuevo_codigo = @nuevo_codigo OUTPUT;
                        SELECT @nuevo_codigo AS nuevo_codigo;""",(dpto, grupo,subgrupo))
    data = pointer.fetchall()
    coneccion.close()
    return data



def provedorXcodigo(provedor):
    coneccion =  get_db_connection_importadora()
    pointer = coneccion.cursor()
    pointer.execute("select * from MA_PRODXPROV WHERE c_codprovee = ?",(provedor))
    data = pointer.fetchall()
    coneccion.close()
    return data








def consulta_user():
    coneccion =  get_db_connection()
    pointer = coneccion.cursor()
    pointer.execute("select * from TR_PENDIENTE_CODIGO WHERE c_CodNasa = ?",('ACCA03300003'))
    data = pointer.fetchall()
    coneccion.close()
    return data

