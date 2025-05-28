from flask import Blueprint, render_template,request,jsonify, make_response, session,flash,url_for,redirect
import sqlite3
from ..database.dpto import get_db_connection_importadora, get_db_connection
app_consulta = Blueprint('consulta', __name__)

@app_consulta.route('/')
def inicio():

    return render_template ('opciones_de_verificacion.html')






#CONSULTA A TABLA DE CODIFICACION CON STATUS PENDIENTE, SE UTILIZAR PARA MOSTRAR LOS VALORES EN LA TABLA DE VERICIACION DE MERCANCIA

@app_consulta.route('/consulta')
def consulta():
    
    def database():
        conexion  = get_db_connection_importadora()
        pointer = conexion.cursor()
        pointer.execute("SELECT * FROM TablaCodificacion WHERE STATUS = 'PENDIENTE'")
        data = pointer.fetchall()
        conexion.close()
        return data

    a = database()
    if 'username' not in session:
        flash('Debes iniciar sesión para acceder a esta página')
        return redirect(url_for('loggin.sigin'))
   
    return render_template ('consulta.html', data = a)



#CONSULTA PARA LA VISTA DE VERIFICACION DE MERCANCIA, TAMBIEN PARA VERIFICAR POR SCANNER
@app_consulta.route('/vericacionxcodigo',methods=['POST', 'GET'])
def vericacionxcodigo():
    try:
       
        data = request.json
    
        conexion = get_db_connection_importadora()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM TablaCodificacion WHERE codBulto = ?",(data['codigo_bulto'],))     
        columns = [column[0] for column in cursor.description]
        rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        conexion.close()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


#ENDPOINT DE PRUEBA PARA COMPROBAR LA TABLA
@app_consulta.route('/vericacion',methods=['POST', 'GET'])
def vericacion():
    try:
       
        data = request.json
    
        conexion = get_db_connection_importadora()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM TablaCodificacion")     
        columns = [column[0] for column in cursor.description]
        rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        conexion.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    



#ACTUALIZACION DE LA TABLA DE CODIFICACION PARA PASAR A LA CREACION DE CODIGO O VERIFICACION
@app_consulta.route('/update', methods=['PUT'])
def update():
    data = request.json
    update_var = "PROCESADO"
    conexion = get_db_connection_importadora()
    pointer = conexion.cursor()
    pointer.execute("UPDATE TablaCodificacion SET Status = ? , Restante = ? ,estatus_correo = ?, Usuarios = ?, contador = ? WHERE CodBulto = ?",(update_var,data['n_diferencia'],data['reporte'],data['user'],data['contador'],data['bulto']))
    conexion.commit()
    conexion.close()
    return make_response(jsonify({
            "status": "success",
            "message": "Actualizado corecctamente.",
            "data": data 
    }), 200)




#CONSULTA CON PROVEEDOR PARA VERIFICAR LA RELACION DE CODIGO POR PROVEDOR
@app_consulta.route('/cprovedor',methods=['POST', 'GET'])
def provedor():
    try:
       
        data = request.json
    
        conexion = get_db_connection_importadora()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM MA_PRODXPROV WHERE c_codigo  = ?",(data['c_codigo'],))
      
        columns = [column[0] for column in cursor.description]

        rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]

        conexion.close()

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
