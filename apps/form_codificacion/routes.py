from flask import Blueprint, render_template, request,redirect,url_for,jsonify, session,flash
from ..form_codificacion.creacion import Tabla_Costo
from ..form_codificacion import mesas_work
from ..database.dpto import departamentos
from flask import Flask, request, jsonify
from datetime import datetime
import os
from .upload import excel_upload, insertar_datos_from_Excel

app_excel = Blueprint('app_excel', __name__)
fecha = datetime.now()
fecha_diaria = fecha.date()





#MESAS ACTIVAS
@app_excel.route('/mesas')
def works_tables():    
    mesas = mesas_work.consultar_mesa()
    return render_template('mesas_trabajo.html', mesas_act = mesas)




@app_excel.route('/')
def excel():
    depto = departamentos()
    #depto = ["a" , "b" ,"c"] 
    consulta = Tabla_Costo()

    return render_template('formulario_excel.html', depto=depto)



@app_excel.route('/insert',  methods=['POST'])
def insertar():
    try:
        data = request.json

        barra = data['Barra'].upper()
        producto = data['Producto'].upper()    
        empaque = data['Empaque']
        costo = ""
        departamento = data['Departamento']
        grupo = data['Grupo']
        subgrupo = data['Subgrupo']        
        utilidad = ""        
        iva = ""
        proveedor = data['Proveedor'].upper()
        tipo = 0
        modelo = data['Modelo'].upper()
        moneda = "USD"
        codigo_tio = data['Codigo_tio'].upper()
        marca = data['Marca'].upper()
        mesa_trabajo  = data['Mesa_Trabajo']
    
        tabla_costo = Tabla_Costo()
        tabla_costo.insertar(barra, producto, empaque, costo, departamento, grupo, subgrupo, utilidad, iva, proveedor, tipo, modelo, moneda, codigo_tio, marca, "PENDIENTE",str(fecha_diaria),mesa_trabajo)
        tabla_costo.insertar_costo(barra, producto, empaque, costo, departamento, grupo, subgrupo, utilidad, iva, proveedor, tipo, modelo, moneda, codigo_tio, marca, "PENDIENTE")

        return jsonify({"Exito": data}) 

    except Exception as e:
        return jsonify({"error": str(e)}), 500



#crear mesas
@app_excel.route('/crearworktable',  methods=['POST'])
def crear_mesa():
    try:
        data = request.json
        nombre_mesa = data['nombre_mesa'].upper()
        estado = "ACTIVA"
        mesas_work.crear_mesa(nombre_mesa, estado)
        return jsonify({"Mesa Creada": nombre_mesa})
    except Exception as e:
        return jsonify({"Error":e}) , 500
    
    
    

#endpoind por si acaso #NO BORRAR
@app_excel.route('/consultarworktable',  methods=['POST'])
def mesas_disponibles():
    try:
        data =request.json
        
        response  = mesas_work.consultar_mesa_id(data['id'])
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
    
#UPDATE ESTADO MESAS DE TRABAJO
@app_excel.route('/updateworktable',  methods=['PUT'])
def cerrar_mesas():
    try:
        data =request.json
        estado = 'CERRADA'
        estado_costo = 'ACTIVA'
        response  = mesas_work.update_mesas(estado,estado_costo,data['id'])
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@app_excel.route('/updatename',  methods=['PUT'])
def update_name():
    try:
        data =request.json
        nombre = data['nombre_mesa'].upper()
        id = data['id']
        response  = mesas_work.update_nombre_mesa(nombre,id)
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app_excel.route('/mesasedit',  methods=['POST'])
def editistmesas():
    try:
        
        response  = mesas_work.consultar_mesa_lista_updating()
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@app_excel.route('/updatevaloregistro',  methods=['PUT'])
def update_registro():
    try:
        data =request.json
        barra = data['Barra'].upper()
        producto = data['Producto'].upper()    
        empaque = data['Empaque']
        proveedor = data['Proveedor'].upper()
        modelo = data['Modelo'].upper()
        codigo_tio = data['Codigo_tio'].upper()
        marca = data['Marca'].upper()   
        codigo_tio_para = data['Codigo_tio_p'].upper()
        instancia = Tabla_Costo()
        instancia.update_valor(barra, producto, empaque, proveedor,  modelo,  codigo_tio, marca, codigo_tio_para)

        return jsonify({"Exito": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    


@app_excel.route('/upload', methods=['POST', 'GET'])
def upload_file():
    try:
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in request'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        mesa_trabajo = request.form.get('Mesa_Trabajo')
        if not mesa_trabajo:
            return jsonify({'error': 'Missing Mesa_Trabajo field'}), 400

        df_seleccionado = excel_upload(file)


        # 📌 Insertar en la base de datos
        for index, row in df_seleccionado.iterrows():
            insertar_datos_from_Excel(
                row['BARRA'], 
                row['PRODUCTO'], 
                row['EMPAQUE'], 
                row['COSTO'], 
                row['DEPARTAMENTO'], 
                row['GRUPO'], 
                row['SUBGRUPO'], 
                row['UTILIDAD'], 
                row['IVA'], 
                row['PROVEEDOR'], 
                row['TIPO'], 
                row['MODELO'], 
                row['MONEDA'], 
                row['CODIGO TIO'], 
                row['MARCA'],
                'PENDIENTE',
                str(fecha_diaria), 
                mesa_trabajo  
            )

        return jsonify({'message': 'Data inserted successfully'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500