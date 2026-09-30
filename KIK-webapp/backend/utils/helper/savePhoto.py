import base64
import os
from supabase import create_client
from datetime import datetime

supabase = create_client(os.environ["supabase_url", os.environ["supabase_key"]])
BUCKET = "uploads"

def save_to_uploads(data_base64, user_id, date_time):
    if "," in data_base64:
        header, encoded = data_base64.split(",", 1)
    else :
        encoded = data_base64

    image_data = base64.b64decode(encoded)

    path = f'{user_id}/{date_time}.png'
    supabase.storage.from_(BUCKET).upload(
        path, image_data, {"content-type": "image/jpeg", "upsert": "true"}
    )
    return path