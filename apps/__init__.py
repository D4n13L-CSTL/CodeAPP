from flask import Flask
from flask_socketio import SocketIO

socketio = SocketIO()
def create_app():
    app = Flask(__name__)
    app.config['SESSION_COOKIE_NAME'] = 'session_codificaion'
    app.secret_key = '040601deiker'
    
    from .formulario.routes import app_codificacion
    from .consulta.routes import app_consulta
    from .inicio.routes import app_inicio
    from .zebra.routes import app_zebra
    from .verificacion.routes import app_verificacion
    from .loggin.routes import app_login
    from .email.routes import app_email
    from .reportes.routes import app_reportes
    from .form_codificacion.routes import app_excel
    from .costo.routes import app_costo
    from .app_ctrl_etiqueta.routes import app_ctrol_etiqueta
    from .app_chat.routes import app_chat
    
    app.register_blueprint(app_inicio, url_prefix = "/")
    app.register_blueprint(app_consulta, url_prefix = "/consulta")
    app.register_blueprint(app_codificacion, url_prefix = "/code")
    app.register_blueprint(app_zebra, url_prefix = "/izebra")
    app.register_blueprint(app_verificacion, url_prefix = "/verificacion")
    app.register_blueprint(app_login, url_prefix = "/loggin")
    app.register_blueprint(app_email, url_prefix = "/email")
    app.register_blueprint(app_reportes, url_prefix = "/reportes")
    app.register_blueprint(app_excel, url_prefix = "/form")
    app.register_blueprint(app_costo, url_prefix = "/costo")
    app.register_blueprint(app_ctrol_etiqueta, url_prefix = "/ctrl_etiqueta")
    app.register_blueprint(app_chat, url_prefix = "/chat")

    socketio.init_app(app, cors_allowed_origins="*")  

    return app