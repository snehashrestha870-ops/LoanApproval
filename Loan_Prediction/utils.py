import joblib
import numpy as np


FEATURE_NAMES = [
    "Gender",
    "Married",
    "Dependents",
    "Education",
    "Self_Employed",
    "ApplicantIncome",
    "CoapplicantIncome",
    "LoanAmount",
    "Loan_Amount_Term",
    "Credit_History",
    "Property_Area",
]

CATEGORICAL_FEATURES = [
    "Gender",
    "Married",
    "Dependents",
    "Education",
    "Self_Employed",
    "Property_Area",
]

NUMERIC_FEATURES = [
    "ApplicantIncome",
    "CoapplicantIncome",
    "LoanAmount",
    "Loan_Amount_Term",
    "Credit_History",
]

_CATEGORY_VALUES = {
    "Gender": {"0": "Female", "1": "Male"},
    "Married": {"0": "No", "1": "Yes"},
    "Dependents": {"0": "0", "1": "1", "2": "2", "3": "3+", "4": "3+"},
    "Education": {"0": "Not Graduate", "1": "Graduate"},
    "Self_Employed": {"0": "No", "1": "Yes"},
    "Property_Area": {"0": "Urban", "1": "Semiurban", "2": "Rural"},
}


def _normalize_category(name, value):
    if value is None or str(value).strip() == "":
        return np.nan

    text = str(value).strip()
    labels = {label.casefold(): label for label in _CATEGORY_VALUES[name].values()}
    if text.casefold() in labels:
        return labels[text.casefold()]
    if text in _CATEGORY_VALUES[name]:
        return _CATEGORY_VALUES[name][text]
    raise ValueError(f"Unsupported value for {name}: {value}")


def _normalize_number(name, value):
    if value is None or str(value).strip() == "":
        return np.nan
    try:
        return float(value)
    except (TypeError, ValueError) as error:
        raise ValueError(f"{name} must be a number") from error


def build_feature_row(
    Gender,
    Married,
    Dependents,
    Education,
    Self_Employed,
    ApplicantIncome,
    CoapplicantIncome,
    LoanAmount,
    Loan_Amount_Term,
    Credit_History,
    Property_Area,
):
    values = {
        "Gender": Gender,
        "Married": Married,
        "Dependents": Dependents,
        "Education": Education,
        "Self_Employed": Self_Employed,
        "ApplicantIncome": ApplicantIncome,
        "CoapplicantIncome": CoapplicantIncome,
        "LoanAmount": LoanAmount,
        "Loan_Amount_Term": Loan_Amount_Term,
        "Credit_History": Credit_History,
        "Property_Area": Property_Area,
    }
    return [
        _normalize_category(name, values[name])
        if name in CATEGORICAL_FEATURES
        else _normalize_number(name, values[name])
        for name in FEATURE_NAMES
    ]


def preprocessdata(
    Gender,
    Married,
    Dependents,
    Education,
    Self_Employed,
    ApplicantIncome,
    CoapplicantIncome,
    LoanAmount,
    Loan_Amount_Term,
    Credit_History,
    Property_Area,
):
    test_data = np.asarray(
        [
            build_feature_row(
                Gender,
                Married,
                Dependents,
                Education,
                Self_Employed,
                ApplicantIncome,
                CoapplicantIncome,
                LoanAmount,
                Loan_Amount_Term,
                Credit_History,
                Property_Area,
            )
        ],
        dtype=object,
    )
    trained_model = joblib.load("model.pkl")
    return trained_model.predict(test_data)
