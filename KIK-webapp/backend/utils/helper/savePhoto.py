import base64
import os
from datetime import datetime

def save_to_uploads(data_base64, upload_folder="uploads"):
    os.makedirs(upload_folder, exist_ok=True)

    if "," in data_base64:
        header, encoded = data_base64.split(",", 1)
    else :
        encoded = data_base64

    image_data = base64.b64decode(encoded)

    filename = f"absent_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}.png"
    file_path = os.path.join(upload_folder, filename)

    with open(file_path, "wb") as file :
        file.write(image_data)

    return f"/uploads/{filename}" 