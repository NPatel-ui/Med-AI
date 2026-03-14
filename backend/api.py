from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# ------------------ INIT APP ------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # later restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ LOAD MODEL ------------------
data = joblib.load(r"symptom_disease_mlp_model.pkl")
model = data["model"]
scaler = data["scaler"]
classes = model.classes_

# ------------------ INPUT SCHEMA ------------------
class SymptomInput(BaseModel):
    fever: int
    cough: int
    headache: int
    nausea: int
    vomiting: int
    fatigue: int
    yellowing_skin_eyes: int
    burning_urination: int
    frequent_urination: int
    sensitivity_to_light: int
    # ⚠️ ADD ALL COLUMNS EXACTLY AS IN CSV (ORDER MATTERS)

# ------------------ PREDICT ENDPOINT ------------------
@app.post("/predict")
def predict(data: SymptomInput):

    input_array = np.array([[
        data.fever,
        data.cough,
        data.headache,
        data.nausea,
        data.vomiting,
        data.fatigue,
        data.yellowing_skin_eyes,
        data.burning_urination,
        data.frequent_urination,
        data.sensitivity_to_light
        # ⚠️ SAME ORDER AS TRAINING DATA
    ]])

    input_scaled = scaler.transform(input_array)

    probs = model.predict_proba(input_scaled)[0]
    top3_idx = np.argsort(probs)[-3:][::-1]

    results = [
        {"disease": classes[i], "probability": float(probs[i])}
        for i in top3_idx
    ]

    return {
        "top_prediction": results[0],
        "top_3_predictions": results
    }
