from flask import Blueprint, render_template, request,redirect,url_for,jsonify, session,flash, send_file, abort
from ..costo.costo import Tabla_Costo, conteo_codigo, contenedores, update_mesas
from ..database.dpto import departamentos
from flask import Flask, request, jsonify
import os
import sqlite3
from . update_excel import update_excel, update_tabla_upload

app_costo = Blueprint('app_costo', __name__)

from pathlib import Path
import os

base_dir  = Path().resolve()
db_path = base_dir / "DATABASE.db"

def get_db():
    conexion = sqlite3.connect(str(db_path))
    return conexion

# Ir un nivel arriba para encontrar "archivos"
DIRECTORIO_ARCHIVOS = os.path.join(base_dir, "archivos")
 # Convertir a ruta absoluta

# Crear la carpeta si no existe
os.makedirs(DIRECTORIO_ARCHIVOS, exist_ok=True)

# Ruta del archivo


ARCHIVO_NOMBRE = os.path.join(DIRECTORIO_ARCHIVOS, f"datos.txt")
    



@app_costo.route('/')
def costo():


    conteo  = conteo_codigo()
    return render_template('costo.html', conteo_txt = conteo)


@app_costo.route('/opciones')
def costo_opciones():

    containers = contenedores()
    return render_template('opciones_costo.html', containers = containers)



@app_costo.route('/actualizador' , methods=['PUT'])
def update():
    try:
        data = request.json
        costo = data['costo']
        utilida = data['utilida']
        iva  = data['iva']
        tipo  = 0
        status  = 'PROCESADO'
        codigo = data['codigo']
        txt = "CARGA"

        update_table = Tabla_Costo()
        update_table.update(costo,utilida,iva,tipo,status, txt,codigo)
        return jsonify(data)
    except Exception as e:
        return jsonify({"Error":e}) , 500


@app_costo.route('/actualizardescarga' , methods=['PUT'])
def update_descarga():
    try:
        status  = 'DESCARGA'
        update_table = Tabla_Costo()
        update_table.update_descarga(status)
        return jsonify({"UPDATE":"Actualizado"})
    except Exception as e:
        return jsonify({"Error":e}) , 500

#carganuevamente


@app_costo.route('/carganew',  methods=['PUT'])
def carga_again():
    try:
        data = request.json
        mesa  = data['mesa']
        status  = 'CARGA'
        update_table = Tabla_Costo()
        update_table.update_carga_again(status, mesa)
        return jsonify({"UPDATE":"Actualizado"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app_costo.route('/datosagain',  methods=['PUT'])
def carga_datos_nuevamente():
    try:
        data = request.json
        mesa  = data['mesa']
        status  = 'PENDIENTE'
        txt = ''
        update_table = Tabla_Costo()
        update_table.update_datos_again(status,txt, mesa)
        return jsonify({"UPDATE":"Actualizado"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



#DESCARGA

@app_costo.route('/descarga', methods=['POST', "GET"])
def descargar_archivo():

    coneccion = get_db()
    pointer = coneccion.cursor()
    pointer.execute("SELECT * FROM CODIFICACION WHERE TXT = 'CARGA'" )
    rows = pointer.fetchall()
    coneccion.close()
    
  
    with open(ARCHIVO_NOMBRE, "w", encoding="utf-8") as file:
        for fila in rows:
            nueva_fila = fila[1:-4]  # Excluye el primer elemento, la penúltima y la última posición
            file.write("|".join(map(str, nueva_fila)) + "\n")
    
    return send_file(ARCHIVO_NOMBRE, as_attachment=True)






@app_costo.route('/consulta' , methods=['POST'])
def consulta():
    try:
        
        data = request.json

        id = data['id']

        consulta = Tabla_Costo()
        response  = consulta.consultar(id)

        return jsonify(response)

        
    except Exception as e:
        return jsonify({"Error":e}) , 500
    
    
    
@app_costo.route('/updateworktable',  methods=['PUT'])
def cerrar_mesas():
    try:
        data =request.json

        estado_costo = 'CERRADA'
        response  =update_mesas(estado_costo,data['id'])
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    

@app_costo.route('/updateload',  methods=['POST'])
def upload_excel():
    try:
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in request'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400


        df_seleccionado = update_excel(file)

        valores = [
            (row['COSTO TOTAL UNITARIO'], row['RENTABILIDAD ESTIMADA POR ARTÍCULO'], row['IVA.1'], row['CÓDIGO TÍO']) 
            for _, row in df_seleccionado.iterrows() if row['CÓDIGO TÍO']
        ]
        
        update_tabla_upload(valores)

        return jsonify({'message': 'Data inserted successfully'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
