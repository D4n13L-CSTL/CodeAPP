from flask import Blueprint, render_template, request,redirect,url_for,jsonify, session,flash


app_inicio = Blueprint('inicio', __name__)

@app_inicio.route('/')
def inicio():
      host = session.get('host', "10.21.5.100")
      if 'username' not in session:
        flash('Debes iniciar sesión para acceder a esta página')
        return redirect(url_for('loggin.sigin'))
      
      user = session.get('username')

      return render_template('inicio.html', usuaio = user, 
                             hosts = host)