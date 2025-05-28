from flask import Blueprint, render_template, request,redirect,url_for,jsonify, session, flash
import socket

from ..database.dpto import get_db_connection,departamentos,grupos, get_db_connection_importadora
from datetime import datetime

app_codificacion = Blueprint('codificacion', __name__)

@app_codificacion.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

fecha = datetime.now()
fecha_diaria = fecha.date()

@app_codificacion.route('/grupos', methods=['POST'])
def index_g():
    try:
        # Obtener parámetro 'codigo' desde la URL
        c_departamento = None

        datos = request.json

        # Conectar y ejecutar la consulta
        conexion = get_db_connection_importadora()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM MA_GRUPOS WHERE c_departamento = ?", 
                       (datos['codigo'],))
        
        # Obtener nombres de las columnas
        columns = [column[0] for column in cursor.description]

        # Recuperar y formatear los resultados
        rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]

        # Cerrar conexión
        conexion.close()
    
        # Retornar respuesta en formato JSON
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#Insercion a tabla ma_producto
@app_codificacion.route('/inser_producto',methods=['POST'])
def insertar_producto():
    try:
        data = request.json
        conexion = get_db_connection()
        cursor = conexion.cursor()
        cursor.execute("INSERT INTO MA_PRODUCTOS (c_Codigo,c_Descri,c_Departamento,c_Grupo,c_SubGrupo,c_Marca,c_Modelo,c_CodMoneda,cu_Descripcion_Corta,c_UsuarioAdd,c_UsuarioUpd, Add_Date, Update_Date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                                (data['c_Codigo'],data['c_Descri'],data['c_Departamento'],
                                 data['c_Grupo'],data['c_SubGrupo'],data['c_Marca'],data['c_Modelo'],
                                 data['c_CodMoneda'],data['cu_Descripcion_Corta'],data['codigoUser'],data['codigouserupd'], str(fecha_diaria), str(fecha_diaria)))
      
        conexion.commit()
        conexion.close()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#Inserccion a tabla ma_codigo
@app_codificacion.route('/inser_codigo',methods=['POST'])
def insertar_codigo():
    try:
        data = request.json
        conexion = get_db_connection()
        cursor = conexion.cursor()
        cursor.execute("INSERT INTO MA_CODIGOS (c_CodNasa, c_Codigo,c_Descripcion,n_Cantidad,nu_Intercambio,nu_TipoPrecio) VALUES (?,?,?,?,?,?)",
                                (data['c_CodNasa'],data['c_Codigo'],
                                 data['c_Descripcion'],data['n_Cantidad'],
                                 data['nu_Intercambio'],data['nu_TipoPrecio']))
      
        conexion.commit()
        conexion.close()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
        
#Inserccion a tabla ma_codigo codigo alterno
@app_codificacion.route('/inser_codigo_alterno',methods=['POST'])
def insertar_codigo_alterno():
    try:
        data = request.json
        conexion = get_db_connection()
        cursor = conexion.cursor()
        cursor.execute("INSERT INTO MA_CODIGOS (c_CodNasa, c_Codigo,c_Descripcion,n_Cantidad,nu_Intercambio,nu_TipoPrecio) VALUES (?,?,?,?,?,?)",
                                (data['c_CodNasa'],data['c_Codigo'],
                                 data['c_Descripcion'],data['n_Cantidad'],
                                 data['nu_Intercambio'],data['nu_TipoPrecio']))
      
        conexion.commit()
        conexion.close()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        

#Inserccion a tabla ma_producto pendiente

@app_codificacion.route('/inserpendiente',methods=['POST'])
def insertar_tablapendiente():
    try:
        data = request.json
        conexion = get_db_connection()
        cursor = conexion.cursor()
        cursor.execute("INSERT INTO TR_PENDIENTE_PROD (c_Codigo,c_Descri,c_Departamento,c_Grupo,c_SubGrupo,c_Marca,c_Modelo,c_CodMoneda,cu_Descripcion_Corta,c_UsuarioAdd,c_UsuarioUpd, Add_Date, Update_Date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                                (data['c_Codigo'],data['c_Descri'],data['c_Departamento'],
                                 data['c_Grupo'],data['c_SubGrupo'],data['c_Marca'],data['c_Modelo'],
                                 data['c_CodMoneda'],data['cu_Descripcion_Corta'],data['codigoUser'],data['codigouserupd'], str(fecha_diaria), str(fecha_diaria)))
      
        conexion.commit()
        conexion.close()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#Inserccion a tabla ma_codigo pendiente
@app_codificacion.route('/insertpendientetr',methods=['POST'])
def insertar_tablapendientetr():
    try:
        data = request.json
        conexion = get_db_connection()
        cursor = conexion.cursor()
        
        cantidad = 1
        tipo_cambio = 0
        intercambio = 1
        tipoPrecio = 0
        cursor.execute("INSERT INTO TR_PENDIENTE_CODIGO (c_CodNasa, c_Codigo,c_Descripcion,n_Cantidad,nu_Intercambio,TipoCambio,nu_TipoPrecio) VALUES (?,?,?,?,?,?,?)",
                                (data['c_CodNasa'],data['c_Codigo'],
                                 data['c_Descripcion'],cantidad,intercambio,tipo_cambio,tipoPrecio))
      
        conexion.commit()
        conexion.close()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

       

#endpoint de subgrupos
@app_codificacion.route('/r',methods=['POST'])
def index_2():
    try:
        # Obtener parámetro 'codigo' desde la URL
        
        datos = request.json

        # Conectar y ejecutar la consulta
        conexion = get_db_connection_importadora()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM MA_SUBGRUPOS WHERE c_in_grupo = ? AND c_in_departamento = ?",
                               (datos['grupo'],datos['dpto']))
        
        # Obtener nombres de las columnas
        columns = [column[0] for column in cursor.description]

        # Recuperar y formatear los resultados
        rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]

        # Cerrar conexión
        conexion.close()

        # Retornar respuesta en formato JSON
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500



#Consulta ultimo codigo disponible
@app_codificacion.route('/ucodigo',methods=['POST'])
def ultimocodigo():
    try:
        
        data = request.json
        coneccion =  get_db_connection()
        pointer = coneccion.cursor()
        pointer.execute("""DECLARE @nuevo_codigo NVARCHAR(50);  -- Declara el parámetro de salida
                            EXEC [dbo].[sp_GenerarCodigoProducto]
                                @c_departamento = ?,
                                @c_grupo = ?,
                                @subgrupo = ?,
                                @nuevo_codigo = @nuevo_codigo OUTPUT;
                            SELECT @nuevo_codigo AS nuevo_codigo;""",(data['c_departamento'],data['c_grupo'],data['subgrupo']))
        
        columns = [column[0] for column in pointer.description]
        rows = pointer.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        coneccion.close()
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500



#INSERCION DE PROVEEDORES RELACION CON EL CODIGO
@app_codificacion.route('/inserProve',methods=['POST'])
def inserProve():
    try:
        data = request.json
        conexion = get_db_connection()
        cursor = conexion.cursor()
        cursor.execute("INSERT INTO MA_PRODXPROV (c_codigo,c_codprovee) VALUES (?,?)",
                                (data['c_codigo']), data['c_codprovee'])
      
        conexion.commit()
        conexion.close()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        


#ENDPOINT DE CONSULTA PROVEEDOR general
@app_codificacion.route('/consultaProvedor',methods=['POST'])
def cprovodor():
    try:
        data = request.json
        conexion = get_db_connection_importadora()
        cursor = conexion.cursor()
        cursor.execute("SELECT c_codproveed,c_descripcio,c_rif FROM MA_PROVEEDORES ",)
                                
        columns = [column[0] for column in cursor.description]
        rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        conexion.close()
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500



#ENDPOINT DE CONSULTA PROVEEDOR especifico se usa para buscar en la interfaz 
@app_codificacion.route('/provedorxprt',methods=['POST'])
def provedorxprt():
    try:
        data = request.json
        conexion = get_db_connection_importadora()
        cursor = conexion.cursor()
        cursor.execute("SELECT c_codproveed,c_descripcio,c_rif FROM MA_PROVEEDORES WHERE c_codproveed = ? ",(data['c_codproveed']))              
        columns = [column[0] for column in cursor.description]
        rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        conexion.close()
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500









@app_codificacion.route('/',methods=['GET', 'POST'])
def index():
    
    depto = departamentos()
    
    if 'username' not in session:
        flash('Debes iniciar sesión para acceder a esta página')
        return redirect(url_for('loggin.sigin'))
    codigo_user = session.get('coduser')
    nombre_user = session.get('username')
    return render_template("formulario.html",
                           usuario = nombre_user,
                            depto = depto, codigo = codigo_user
                           
                            )
