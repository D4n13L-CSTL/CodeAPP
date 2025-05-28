
from flask import Blueprint, request, jsonify, session
import smtplib
import os
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from fpdf import FPDF
from datetime import datetime

fecha = datetime.now()
fecha_diaria = fecha.date()



app_email = Blueprint('email', __name__)

load_dotenv()



@app_email.route("/", methods=['POST'])
def enviar_email():
    correo = session.get('correo')
    try:
        # Verificar credenciales de correo
        email_user = os.getenv('USER')
        email_password = os.getenv('PASS')

        if not email_user or not email_password:
            print("Error: Credenciales de correo no configuradas")
            return jsonify({
                "success": False,
                "message": "Credenciales de correo no configuradas"
            }), 500

        # Obtener datos del request
        data = request.get_json()
        if not data:
            print("Error: No se recibieron datos en el request")
            return jsonify({
                "success": False,
                "message": "No se recibieron datos"
            }), 400

        # Extraer variables del request
        differenceData = data.get('differenceData')
        numero_cont = data.get('numero_cont')
        articulo = data.get('articulo')
        cod_produc = data.get('cod_produc')

        if differenceData is None:
            return jsonify({
                "success": False,
                "message": "No se especificó una diferencia válida"
            }), 400

        # Crear el mensaje del correo
        mensaje = f"""
        Se informa desde el Departamento de Codificacion que hubo diferencias en el siguiente Conteo:<br><br> 
        Artículo: {articulo},<br>
        Codigo producto: {cod_produc},<br> 
        Contenedor: {numero_cont},<br>
        El cual tiene una diferencia de: {differenceData} unidades.<br><br>        
        
        Se agradece proceder con las medidas correspondientes.<br><br> 
        
        Gracias.
        """

        # Configurar el correo
        msg = MIMEMultipart()
        msg['Subject'] = 'Notificación de Diferencia en Almacen'
        msg['From'] = email_user
        msg['To'] = 'deikerdcastillo@gmail.com'

        # Contenido HTML del correo
        contenido_html = f"""
        <html>
            <body>
                <h2>Reporte de Diferencia en Almacen</h2>
                <p>{mensaje}</p>
            </body>
        </html>
        """
        
        msg.attach(MIMEText(contenido_html, 'html'))

        # Enviar el correo
        try:
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(email_user, email_password)
            server.send_message(msg)
            server.quit()

            print("Correo enviado exitosamente")
            return jsonify({
                "success": True,
                "message": "Correo enviado correctamente"
            }), 200

        except smtplib.SMTPAuthenticationError:
            print("Error de autenticación SMTP")
            return jsonify({
                "success": False,
                "message": "Error de autenticación del correo"
            }), 500
        except Exception as e:
            print(f"Error al enviar el correo: {str(e)}")
            return jsonify({
                "success": False,
                "message": f"Error al enviar el correo: {str(e)}"
            }), 500

    except Exception as e:
        print(f"Error general: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error en el servidor: {str(e)}"
        }), 500





#REPORTE DE AUDITORIA ////////////////////////////////////////////

def generador_pdf(descripcion,codigo,departamento,grupo,subgrupo,bulto,
                  cantidad_bulto,cantidad_contada,restante,contada_por):
    class PDF(FPDF):
        def header(self):
            # Fuente y tamaño
            self.set_font("Arial", size=10)
            
            # Parte izquierda
            self.set_xy(10, 10)  # Posición X=10, Y=10
            self.multi_cell(100, 5, (
                "CALLE EL ALGODONAL EDIF CARADAY PISO PB LOCAL PUERTA 6\n"
                "SECTOR LA YAGUARA CARACAS DISTRITO CAPITAL\n"
                "ZONA POSTAL 1000"
            ), border=0)

            # Parte derecha
            self.set_xy(150, 10)  # Ajusta X cerca del margen derecho
            self.multi_cell(50, 5, (
                f"Correlativo 0001\n"
                f"CARACAS, {str(fecha_diaria)} "
            ), border=0, align='R')
            

    # Crear PDF
    pdf = PDF()
    pdf.add_page()

    # Información adicional en el cuerpo
    pdf.set_xy(10, 28)
    pdf.set_font("Arial", size=10)
    pdf.cell(0, 10, "CLIENTE: IMPORTADORA EL TIO AMMI II, C.A", ln=True)
    pdf.set_xy(10, 35)
    pdf.cell(0, 10, "RIF:", ln=True)
    pdf.set_xy(10, 40)
    pdf.cell(0, 10, "DOMICILIO FISCAL:", ln=True)
    pdf.multi_cell(0, 5, (
        "DIRECCION DE DESPACHO: AV SANTA TERESA C/CON CRUZ VERDE\n" 
        "EDIF S/N PISO S/N LOCAL S/N\n"
        "URB SANTA TERESA CARACAS DISTRITO\n" 
        "CAPITAL ZONA POSTAL 1020, AMMI-02011, CARACAS,"
    ))

    pdf.set_font("Arial", size=12)
    # Encabezados de tabla
    #pdf.image('LOGO_VECTOR.png',10,10, 10,10) 
    pdf.set_font("Arial", style='B', size=24) 

    pdf.set_xy(30,75) 
    pdf.cell(150, 10, "REPORTE", ln=True, align='C')

    pdf.set_line_width(0.5)
    pdf.line(10,75, 200, 75)

    pdf.set_font("Arial", style='B', size=10)
    pdf.set_xy(20,90)
    pdf.cell(20, 10, "CODIGO", border=0, ln=True)
    pdf.set_xy(20,100)
    pdf.cell(20, 10, "DESCRIPCION", border=0, ln=True)
    pdf.set_xy(20,110)
    pdf.cell(20, 10, "DEPARTAMENTO", border=0, ln=True)
    pdf.set_xy(20,120)
    pdf.cell(20, 10, "GRUPO", border=0, ln=True)
    pdf.set_xy(20,130)
    pdf.cell(20, 10, "SUBGRUPO", border=0, ln=True)
    pdf.set_xy(20,140)
    pdf.cell(20, 10, "BULTO", border=0, ln=True)
    pdf.set_xy(20,150)
    pdf.cell(20, 10, "CANTIDAD EN BULTO", border=0, ln=True)
    pdf.set_xy(20,160)
    pdf.cell(20, 10, "CANTIDAD CONTADA", border=0, ln=True)
    pdf.set_xy(20,170)
    pdf.cell(20, 10, "RESTANTE", border=0, ln=True)
    pdf.set_xy(20,180)
    pdf.cell(20, 10, "CONTADA POR", border=0, ln=True)

    pdf.set_line_width(0.5)
    pdf.line(10,200, 200, 200)

    firma = session.get('username')
    
    firma_pdf = firma
    pdf.set_xy(150,230)
    pdf.multi_cell(0, 5, (
    "Elaborado por:\n"
    f"{firma}"
    ))




    pdf.set_xy(140,90)  # Ajusta X para mover el texto hacia la derecha
    pdf.cell(50, 10, f"{codigo}", border=0, ln=True)

    pdf.set_xy(140,100)
    pdf.cell(50, 10, f"{descripcion}", border=0, ln=True)

    pdf.set_xy(140,110)
    pdf.cell(50, 10, f"{departamento}", border=0, ln=True)

    pdf.set_xy(140,120)
    pdf.cell(50, 10, f"{grupo}", border=0, ln=True)

    pdf.set_xy(140,130)
    pdf.cell(50, 10, f"{subgrupo}", border=0, ln=True)

    pdf.set_xy(140,140)
    pdf.cell(50, 10, f"{bulto}", border=0, ln=True)

    pdf.set_xy(140,150)
    pdf.cell(50, 10, f"{cantidad_bulto}", border=0, ln=True)

    pdf.set_xy(140,160)
    pdf.cell(50, 10, f"{cantidad_contada}", border=0, ln=True)

    pdf.set_xy(140,170)
    pdf.cell(50, 10, f"{restante}", border=0, ln=True)

    pdf.set_xy(140,180)
    pdf.cell(50, 10, f"{contada_por}", border=0, ln=True)

    # Primera fila

    # Guardar el PDF
    pdf.output("reporte.pdf")








@app_email.route("/reporte", methods=['POST'])
def email_reporte():
        
        email_user = os.getenv('USER')
        email_password = os.getenv('PASS')

        if not email_user or not email_password:
            print("Error: Credenciales de correo no configuradas")
            return jsonify({
                "success": False,
                "message": "Credenciales de correo no configuradas"
            }), 500

        # Obtener datos del request
        data = request.get_json()
        if not data:
            print("Error: No se recibieron datos en el request")
            return jsonify({
                "success": False,
                "message": "No se recibieron datos"
            }), 400

        # Extraer variables del request
        
        numero_cont = data.get('prueba')
        
        data = request.json
        codigo = data['codigo']
        descripcion = data['descripcion']
        departamento = data['departamento']
        grupo = data['grupo']
        subgrupo = data['subgrupo']
        bulto = data['bulto']
        cantidad_bulto = data['cantidad_bulto']
        cantidad_contada = data['cantidad_contada']
        restante = data['restante']
        contada_por = data['contada_por']
        generador_pdf(descripcion,codigo,departamento,grupo,subgrupo,bulto
                      ,cantidad_bulto,cantidad_contada,restante, contada_por)


        # Crear el mensaje del correo
        mensaje = f"""
            Reporte con detallado de 
            Bulto: {bulto}
        """

        # Configurar el correo
        msg = MIMEMultipart()
        msg['Subject'] = 'Notificación de Diferencia en Almacen'
        msg['From'] = email_user
        msg['To'] = 'deikerdcastillo@gmail.com'

        # Contenido HTML del correo
        contenido_html = f"""
        <html>
            <body>
                <h2>Reporte de Diferencia en Almacen</h2>
                <p>{mensaje}</p>
            </body>
        </html>
        """
         
         
         
        msg.attach(MIMEText(contenido_html, 'html'))
        
        
        archivo_adjuntar = r"C:/Users/Windows 11/Documents/APP_Codificacion/reporte.pdf"
        
        if os.path.exists(archivo_adjuntar):  # Verifica que el archivo existe
            with open(archivo_adjuntar, "rb") as archivo:
                adjunto = MIMEBase("application", "octet-stream")
                adjunto.set_payload(archivo.read())
                encoders.encode_base64(adjunto)
                adjunto.add_header("Content-Disposition", f"attachment; filename={os.path.basename(archivo_adjuntar)}")
                msg.attach(adjunto)
        else:
            print("⚠️ El archivo no existe")

        # Enviar el correo
        try:
            server = smtplib.SMTP('smtp.gmail.com', 587) 
            server.starttls()
            server.login(email_user, email_password)
            server.send_message(msg)
            server.quit()

            print("Correo enviado exitosamente")
            return jsonify({
                "success": True,
                "message": "Correo enviado correctamente"
            }), 200

        except smtplib.SMTPAuthenticationError:
            print("Error de autenticación SMTP")
            return jsonify({
                "success": False,
                "message": "Error de autenticación del correo"
            }), 500
        except Exception as e:
            print(f"Error al enviar el correo: {str(e)}")
            return jsonify({
                "success": False,
                "message": f"Error al enviar el correo: {str(e)}"
            }), 500

        except Exception as e:
            print(f"Error general: {str(e)}")
            return jsonify({
                "success": False,
                "message": f"Error en el servidor: {str(e)}"
            }), 500




#EMAIL EXCEL

@app_email.route("/excel", methods=['POST'])
def email_excel():
        
        email_user = os.getenv('USER')
        email_password = os.getenv('PASS')

        if not email_user or not email_password:
            print("Error: Credenciales de correo no configuradas")
            return jsonify({
                "success": False,
                "message": "Credenciales de correo no configuradas"
            }), 500

        # Obtener datos del request


        # Extraer variables del request


        # Crear el mensaje del correo
        mensaje = f"""
            Reporte con detallado de 
            Bulto: 
        """

        # Configurar el correo
        msg = MIMEMultipart()
        msg['Subject'] = 'Notificación de Diferencia en Almacen'
        msg['From'] = email_user
        msg['To'] = 'deikerdcastillo@gmail.com'

        # Contenido HTML del correo
        contenido_html = f"""
        <html>
            <body>
                <h2>Reporte de Diferencia en Almacen</h2>
                <p>{mensaje}</p>
            </body>
        </html>
        """
         
         
         
        msg.attach(MIMEText(contenido_html, 'html'))
        
        data = request.json
        
        nombre = f"{data["nombre"]}.xlsx"
        archivo_adjuntar = f"C:/Users/DANIEL/Desktop/Proyecto-Codificacion/{nombre}"
        
        if os.path.exists(archivo_adjuntar):  # Verifica que el archivo existe
            with open(archivo_adjuntar, "rb") as archivo:
                adjunto = MIMEBase("application", "octet-stream")
                adjunto.set_payload(archivo.read())
                encoders.encode_base64(adjunto)
                adjunto.add_header("Content-Disposition", f"attachment; filename={os.path.basename(archivo_adjuntar)}")
                msg.attach(adjunto)
        else:
            print("⚠️ El archivo no existe")

        # Enviar el correo
        try:
            server = smtplib.SMTP('smtp.gmail.com', 587) 
            server.starttls()
            server.login(email_user, email_password)
            server.send_message(msg)
            server.quit()

            print("Correo enviado exitosamente")
            return jsonify({
                "success": True,
                "message": "Correo enviado correctamente"
            }), 200

        except smtplib.SMTPAuthenticationError:
            print("Error de autenticación SMTP")
            return jsonify({
                "success": False,
                "message": "Error de autenticación del correo"
            }), 500
        except Exception as e:
            print(f"Error al enviar el correo: {str(e)}")
            return jsonify({
                "success": False,
                "message": f"Error al enviar el correo: {str(e)}"
            }), 500

        except Exception as e:
            print(f"Error general: {str(e)}")
            return jsonify({
                "success": False,
                "message": f"Error en el servidor: {str(e)}"
            }), 500