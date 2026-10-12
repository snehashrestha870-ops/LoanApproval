import argparse
import csv
from pathlib import Path

import joblib
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from utils import (
    CATEGORICAL_FEATURES,
    FEATURE_NAMES,
    NUMERIC_FEATURES,
    build_feature_row,
)


PROJECT_DIR = Path(__file__).resolve().parent
DEFAULT_DATASET = PROJECT_DIR / "dataset" / "train_u6lujuX_CVtuZ9i.csv"
DEFAULT_MODEL = PROJECT_DIR / "model.pkl"


def train_model(dataset_path=DEFAULT_DATASET, model_path=DEFAULT_MODEL):
    training_features = []
    training_labels = []

    with Path(dataset_path).open(newline="", encoding="utf-8") as dataset:
        for row in csv.DictReader(dataset):
            label = row["Loan_Status"].strip()
            if label not in {"Y", "N"}:
                raise ValueError(f"Unsupported Loan_Status value: {label}")
            training_features.append(
                build_feature_row(
                    row["Gender"],
                    row["Married"],
                    row["Dependents"],
                    row["Education"],
                    row["Self_Employed"],
                    row["ApplicantIncome"],
                    row["CoapplicantIncome"],
                    row["LoanAmount"],
                    row["Loan_Amount_Term"],
                    row["Credit_History"],
                    row["Property_Area"],
                )
            )
            training_labels.append(1 if label == "Y" else 0)

    if not training_features:
        raise ValueError(f"No training records found in {dataset_path}")

    categorical_indexes = [
        FEATURE_NAMES.index(name) for name in CATEGORICAL_FEATURES
    ]
    numeric_indexes = [FEATURE_NAMES.index(name) for name in NUMERIC_FEATURES]
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "categorical",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="most_frequent")),
                        ("encoder", OneHotEncoder(handle_unknown="ignore")),
                    ]
                ),
                categorical_indexes,
            ),
            (
                "numeric",
                SimpleImputer(strategy="median"),
                numeric_indexes,
            ),
        ]
    )
    model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            (
                "classifier",
                RandomForestClassifier(
                    n_estimators=300,
                    min_samples_leaf=2,
                    class_weight="balanced_subsample",
                    random_state=42,
                    n_jobs=-1,
                ),
            ),
        ]
    )
    model.fit(np.asarray(training_features, dtype=object), training_labels)
    joblib.dump(model, model_path)
    return model, len(training_features)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Train and save the loan approval prediction model."
    )
    parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET)
    parser.add_argument("--output", type=Path, default=DEFAULT_MODEL)
    args = parser.parse_args()

    _, record_count = train_model(args.dataset, args.output)
    print(f"Trained on {record_count} records and saved model to {args.output}")
