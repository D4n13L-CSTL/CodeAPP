from flask import Blueprint, render_template, request,redirect,url_for,jsonify, session, flash
from ..database.dpto import consulta_user,get_db_connection_importadora

app_login = Blueprint('loggin',__name__)

@app_login.route('/', methods=['GET', 'POST'])
def sigin():

    return render_template('loggin.html')


@app_login.route('/singin', methods=['GET', 'POST'])
def inicio():
    try:
        # Verificar si el JSON recibido tiene los campos correctos
        data = request.get_json(silent=True)
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({"error": "Faltan credenciales"}), 400

        usuario = data['username']
        password = data['password']  # No se usa encode porque no se compara con hash

        # Conectar con la BD
        conexion = get_db_connection_importadora()
        cursor = conexion.cursor()

        # Buscar el usuario en la base de datos
        cursor.execute("SELECT descripcion, password,codusuario,Nivel FROM MA_USUARIOS WHERE login_name = ?", (usuario,))
        user = cursor.fetchone()  # Obtener una sola fila
        conexion.close()

        # Validar si el usuario existe
        if not user:
            return jsonify({"error": "Usuario o contraseña incorrectos"}), 401

        stored_username, stored_password,codigoUser,nivel_user = user

        # Comparar la contraseña ingresada con la almacenada en la BD (texto plano)
        if password != stored_password:
            return jsonify({"error": "Usuario o contraseña incorrectos"}), 401
        session['username'] = stored_username
        session['coduser'] = codigoUser
        user_int = int(nivel_user)
        session['nivel'] = user_int
        print(type(session['nivel']))
 
        
        return jsonify({"message": "WELCOME"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#buscar usuarios
@app_login.route('/prueba',methods=['POST', 'GET'])
def verificacion_de_codigo():
    try:
        data = request.json
    
        conexion = get_db_connection_importadora()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM MA_USUARIOS ")
      
        columns = [column[0] for column in cursor.description]

        rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]

        conexion.close()

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app_login.route('/logout')
def logout():
    session.pop('username', None)
    flash('Sesión cerrada')
    return redirect(url_for('loggin.sigin'))

