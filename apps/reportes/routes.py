from flask import Blueprint, render_template, request,redirect,url_for,jsonify, session, flash
from ..database.dpto import get_db_connection,departamentos, get_db_connection_importadora
from datetime import datetime
from .consultas import ver_contenedores, conteneo_de_codigo, codigos_x_contenedor

app_reportes = Blueprint('reportes',__name__)

#FUNCION PARA GENERAR LA BUSQUEDA DE DETALLES DE BULTO 
#LA FUNCION CODIGO ES LLAMADA DESDE LA FUNCION CONSULTA_CODIGO

@app_reportes.route('/')
def reportes():
    if 'username' not in session:
        flash('Debes iniciar sesión para acceder a esta página')
        return redirect(url_for('loggin.sigin'))
    contenenedores = ver_contenedores()
    return render_template('opciones_de_reporte.html', contenenedores = contenenedores)


@app_reportes.route('/check')
def reportes_check():
    if 'username' not in session:
        flash('Debes iniciar sesión para acceder a esta página')
        return redirect(url_for('loggin.sigin'))
    return render_template('reportes.html')




@app_reportes.route('/containers', methods=['POST'])
def containers():
    try:
        contenedores = codigos_x_contenedor(38)
        return jsonify(contenedores)
    except Exception as e: 
        return jsonify({'error':str(e)}), 500
