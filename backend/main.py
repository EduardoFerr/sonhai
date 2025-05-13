from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

# Adiciona middleware CORS para permitir acesso do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Você pode restringir para ["http://localhost:3000"] em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Sonho(BaseModel):
    """
    Modelo de dados para um sonho enviado pelo usuário.
    """
    texto: str

@app.post("/interpretar")
async def interpretar_sonho(sonho: Sonho):
    """
    Interpreta um sonho enviado pelo usuário usando IA (OpenAI GPT-3.5).

    Args:
        sonho (Sonho): Texto do sonho enviado pelo usuário.

    Returns:
        dict: Resposta com a interpretação simbólica.
    """
    prompt = f"""
Você é um analista de sonhos que combina as abordagens de Jung, Freud e tradições esotéricas.
Forneça uma interpretação simbólica e emocional resumida em até 5 frases. Forneça 6 números da sorte do sonho.

Sonho: {sonho.texto}
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "developer", "content": "Você é um intérprete de sonhos experiente."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.8
        )
        return {"interpretacao": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
