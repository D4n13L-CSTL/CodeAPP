from flask import Blueprint, render_template, request,redirect,url_for,jsonify, session,flash, send_file, abort
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
import sqlite3
from . db import crear_chat, guardar_mensaje, get_db
from apps  import socketio


app_chat = Blueprint('app_chat', __name__)

usuarios_conectados = {}

@app_chat.route('/')
def chat():
    use = session.get('username')
    nombre = use
    iniciales = ''.join([palabra[:1] for palabra in nombre.split()])
    
    return render_template('chats.html', user = use, iniciales = iniciales)


@app_chat.route('/crear', methods=['POST'])
def crear():
    try:
        crear_chat()
        return jsonify({"message":"Chat creado"})
    
    except Exception as e:
        return jsonify({"message":str(e)}), 400




@app_chat.route("/guardar_mensaje", methods=["POST"])
def recibir_mensaje():
    data = request.json
    remitente = session.get('username')  
    destinatario = data.get("destinatario")
    mensaje = data.get("mensaje")

    if remitente and destinatario and mensaje:
        guardar_mensaje(remitente, destinatario, mensaje)
        return jsonify({"status": "Mensaje guardado"}), 201
    else:
        return jsonify({"error": "Faltan datos"}), 400
 
 
 
 
 
 
@app_chat.route("/obtener_mensajes/<destinatario>", methods=["GET"])
def obtener_mensajes( destinatario):
    remitente = session.get('username')
    conexion = get_db()
    cursor = conexion.cursor()
    cursor.execute('''
        SELECT remitente, destinatario, mensaje, timestamp FROM mensajes 
        WHERE (remitente = ? AND destinatario = ?) OR (remitente = ? AND destinatario = ?) 
        ORDER BY timestamp ASC
    ''', (remitente, destinatario, destinatario, remitente))
    
    mensajes = cursor.fetchall()
    conexion.close()

    return jsonify([
        {"remitente": m[0], "destinatario": m[1], "mensaje": m[2], "timestamp": m[3]} 
        for m in mensajes
    ])




 

@socketio.on("connect")
def handle_connect():
    username = session.get('username')  
    if username:
        if username not in usuarios_conectados.values():
            # Solo emitir si el usuario es nuevo
            emit("nuevo_usuario", {"usuario": username}, broadcast=True)
        
        # Registrar la conexión del usuario
        usuarios_conectados[request.sid] = username
        
        # Emitir la lista actualizada de usuarios conectados
        emit("usuarios_conectados", list(usuarios_conectados.values()), broadcast=True)
        
        # Mostrar en consola la notificación de conexión
        print(f"Nuevo usuario conectado: {username} con SID {request.sid}")
    else:
        print("Usuario no autenticado.")







@socketio.on("mensaje_privado")
def mensaje_privado(data):
    remitente = session.get('username')  
    destinatario = data.get("destinatario")  
    mensaje = data.get("mensaje")

    if remitente and destinatario:
        destinatario_sid = next((sid for sid, user in usuarios_conectados.items() if user == destinatario), None)

        if destinatario_sid:
            emit("mensaje_recibido", {"remitente": remitente, "mensaje": mensaje, "destinatario" : remitente}, room=destinatario_sid)
            print(f"Mensaje de {remitente} a {destinatario}: {mensaje}")
        else:
            print(f"{destinatario} no está en línea.")
    else:
        print("Error al enviar mensaje.")




@socketio.on("disconnect")
def handle_disconnect():
    username = usuarios_conectados.pop(request.sid, None)
    if username:
        print(f"Usuario {username} desconectado.")