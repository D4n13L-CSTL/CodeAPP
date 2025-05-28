import sqlite3
from pathlib import Path

base_dir  = Path().resolve()
db_path = base_dir / "chat.db"


def get_db():
    conexion = sqlite3.connect(str(db_path))
    return conexion

def guardar_mensaje(remitente, destinatario, mensaje):
    conexion = sqlite3.connect("chat.db")
    cursor = conexion.cursor()
    cursor.execute('''
        INSERT INTO mensajes (remitente, destinatario, mensaje) 
        VALUES (?, ?, ?)
    ''', (remitente, destinatario, mensaje))
    conexion.commit()
    conexion.close()



def crear_chat():
    conexion = get_db()
    cursor = conexion.cursor()
    cursor.execute(""" INSERT INTO chat DEFAULT VALUES""")
    conexion.commit()
    cursor.close()  
    
    
    


