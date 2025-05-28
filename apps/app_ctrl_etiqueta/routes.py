from flask import Blueprint, render_template, request,redirect,url_for,jsonify, session,flash, send_file, abort
from flask import Flask, request, jsonify
from .modelos import Insertar, Buscar
import os
import sqlite3
from datetime import datetime
from . excel import generar_excel, Buscar_fecha



app_ctrol_etiqueta = Blueprint('app_ctrol_etiqueta', __name__)

fecha = datetime.now()
fecha_diaria = fecha.date()


@app_ctrol_etiqueta.route('/', methods=['POST'])
def etiqueta():
    insertar = Insertar()
    data = request.json
    cantidad = data['cantidad']
    codigo_tio = data['codigotio']
    provedor = data['provedor'].upper()
    nombre = data['nombre'].upper()
    cantidad_eti  = data['cantidad_eti']
    container = data.get('container').upper()
    responsable = data.get('responsable').upper()
    insertar.insertar(codigo_tio, provedor, nombre, cantidad_eti,cantidad,responsable,str(fecha_diaria),container)
    return jsonify({"message":"Hello World"}) 



@app_ctrol_etiqueta.route('/buscar', methods=['POST'])
def buscar_ctrl():
    buscar = Buscar()
    data = request.json
    nombre = data.get('nombre')
    codigo = data.get('codigo')
    data = buscar.buscar(nombre,codigo)
    return jsonify(data)




@app_ctrol_etiqueta.route('/download', methods=['GET', 'POST'])
def descargar():
    buscar = Buscar_fecha()
    data = request.json
    fecha_init = data.get('fecha_init')
    fecha_end = data.get('fecha_end')

    prueba = buscar.buscar(fecha_init,fecha_end)
    archivo = generar_excel(prueba)  # Llamamos a la función que crea el Excel
    return send_file(archivo, as_attachment=True, download_name="mi_archivo.xlsx", mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
