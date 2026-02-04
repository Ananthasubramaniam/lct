from fastapi import FastAPI
from database import db

app = FastAPI()

@app.get("/")
async def root():
    count = await db.users.count_documents({})
    return {"db_status": "connected", "users": count}
