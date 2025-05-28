from flask import Blueprint, render_template, request,redirect,url_for,jsonify, session, flash
from ..database.dpto import get_db_connection,get_db_connection_importadora
import socket
from datetime import datetime


app_zebra = Blueprint('zebra', __name__)



@app_zebra.route('/codigos',methods=['POST'])
def consulta_codigo():
    try:
        
        datos = request.json

        conexion = get_db_connection_importadora()
        cursor = conexion.cursor()
        cursor.execute("SELECT c_Codigo,c_Descri,c_Marca,c_Modelo FROM MA_PRODUCTOS WHERE c_Codigo = ?",
                               (datos['c_Codigo']))
        
        columns = [column[0] for column in cursor.description]

        rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]

        # Cerrar conexión
        conexion.close()
        print(datos)
        # Retornar respuesta en formato JSON
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app_zebra.route('/set_host',methods=['GET', 'POST'])
def hosts():
    host = request.json.get('host')
    if host:
        session['host'] = host
        return jsonify({"message": "Host guardado en la sesión correctamente."}), 200
    return jsonify({"error": "El valor del host es requerido."}), 400




fecha = datetime.now()
fecha_diaria = fecha.date()



@app_zebra.route('/impresion',methods=['GET', 'POST'])
def impresion():
    try:
        host = session.get('host', "10.21.5.100")
        port = 9100
        data = request.json
        cantidad = data['cantidad']
        codigo_tio = data['codigotio']
        description = data['description']
        provedor = data['provedor']
        nombre = data['nombre']
        cantidad_eti  = data['cantidad_eti']
        comentario = data.get('comentario')
        comentario2 = data.get('comentario2')
        container = data.get('container')
        responsable = data.get('responsable')
        
        if comentario is None:
            comentario = ''
        
        if container is None:
            container = ''
            
        if responsable is None:
            responsable = ''
        
        if comentario2 is None:
            comentario2 = ''
        etiqueta = f"""
                ^XA
                ^CFA,15
                ^FO80,140^GB150,150,5^FS 
                ^FO90,100^A0N,40,40^FD CANT^FS
                ^FO90,180^A0,70,65^FD {cantidad} ^FS
                ^FO225,80^A0N,80,65^FD{codigo_tio}^FS
                ^FO60,40^A0,30,30^FD {description} ^FS
                ^FO240,150^BY2^BCN,150,N,N,N^FD{codigo_tio}^FS  
                ^FO70,305S^A0N,30,30^FD COD PROV:{provedor} | {comentario} ^FS
                ^FO70,330^A0N,30,30^FD RESP: {responsable} | CONTEO : {nombre} ^FS
                ^FO70,360^A0N,30,30^FD CONTENEDOR:{container} ^FS
                ^FO70,385^A0N,30,30^FD FECHA:{str(fecha_diaria)}| {comentario2}^FS 
                ^FO70,415^A0,15,20^FD NO BOTAR EL HABLADOR ANTES DE ETIQUETAS LA MERCANCIA^FS
                ^PQ{cantidad_eti}
                ^XZ
                
            """
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.connect((host, port))
                    s.sendall(etiqueta.encode())
        
        
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500






@app_zebra.route('/',methods=['GET', 'POST'])
def index():
  
    host = session.get('host', "10.21.5.100")
    if 'username' not in session:
        flash('Debes iniciar sesión para acceder a esta página')
        return redirect(url_for('loggin.sigin'))
    
    return render_template("zebra.html",
                                                    
                            host = host
                            )


@app_zebra.route('/control',methods=['GET', 'POST'])
def control_etqieta():

    return render_template("ctrl_etiqueta.html")
                                                
                            