import joblib
import numpy as np

bundle = joblib.load("symptom_disease_mlp_model.pkl")
model = bundle["model"]
scaler = bundle["scaler"]

SYMPTOMS = joblib.load("symptom_list.pkl")  # ✅ ORDERED LIST
CLASSES = model.classes_

def build_vector(selected_symptoms: list[str]):
    """
    selected_symptoms = ["headache", "fatigue", ...]
    """
    vector = [1 if symptom in selected_symptoms else 0 for symptom in SYMPTOMS]
    return vector

def predict_from_symptoms(selected_symptoms: list[str]):
    vector = build_vector(selected_symptoms)
    X_scaled = scaler.transform([vector])

    probs = model.predict_proba(X_scaled)[0]
    ranked = sorted(
        zip(CLASSES, probs),
        key=lambda x: x[1],
        reverse=True
    )

    return ranked[:3]
print("Inference output:", results)

