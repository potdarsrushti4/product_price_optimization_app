#!/usr/bin/env python3
import sys
import json
import joblib
import numpy as np
import os
import traceback

def main():
    try:
        # Read JSON array passed as argv[1]
        raw = sys.argv[1]
        data = json.loads(raw)
    except Exception as e:
        sys.stderr.write("Invalid input JSON: " + str(e))
        sys.exit(1)

    try:
        base = os.path.dirname(os.path.abspath(__file__)) # Use abspath for robust base
        # Use simple filenames, os.path.join will combine them with base
        model_path = os.path.join(base, "price_optimization_model.pkl") 
        poly_path = os.path.join(base, "poly_transformer.pkl")
        
        model = joblib.load(model_path)
        poly = joblib.load(poly_path)

        features = np.array(data).reshape(1, -1)
        poly_features = poly.transform(features)
        pred = model.predict(poly_features)[0]
        # print only the numeric value to stdout (Node will read this)
        print(round(float(pred), 2))
    except Exception as e:
        traceback.print_exc(file=sys.stderr)
        sys.stderr.write("Prediction failed: " + str(e))
        sys.exit(2)

if __name__ == "__main__":
    main()
