"""Train and evaluate the documented clinical-specialty text classifiers.

Usage: python train.py "path/to/Healthcare Documentation Database.csv"
"""
import argparse
import json
from pathlib import Path

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline


def combined_text(frame: pd.DataFrame) -> pd.Series:
    columns = ["description", "keywords", "cleaned_transcription"]
    return frame[columns].fillna("").astype(str).agg(" ".join, axis=1).str.replace(r"\s+", " ", regex=True).str.strip()


def evaluate(name, model, x_test, y_test):
    predictions = model.predict(x_test)
    result = {"model": name, "accuracy": round(accuracy_score(y_test, predictions), 4), "macro_f1": round(f1_score(y_test, predictions, average="macro", zero_division=0), 4), "weighted_f1": round(f1_score(y_test, predictions, average="weighted", zero_division=0), 4)}
    print(json.dumps(result, indent=2))
    print(classification_report(y_test, predictions, zero_division=0))
    return result


def main(path: str):
    data = pd.read_csv(path)
    required = {"description", "keywords", "cleaned_transcription", "medical_specialty"}
    missing = required.difference(data.columns)
    if missing: raise ValueError(f"Dataset is missing required columns: {', '.join(sorted(missing))}")
    x, y = combined_text(data), data["medical_specialty"].astype(str)
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=.2, random_state=42, stratify=y)
    vectorizer = TfidfVectorizer(max_features=25000, ngram_range=(1, 2), min_df=2, stop_words="english")
    candidates = [("MultinomialNB", MultinomialNB(alpha=.5)), ("LogisticRegression", LogisticRegression(C=1.0, class_weight="balanced", max_iter=700))]
    results=[]
    for name, classifier in candidates:
        model=Pipeline([("tfidf", vectorizer), ("classifier", classifier)])
        model.fit(x_train, y_train); results.append(evaluate(name, model, x_test, y_test))
        # Persist each completed experiment so long-running model comparisons are recoverable.
        Path("metrics.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
    Path("metrics.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
    print("Saved metrics.json")

if __name__ == "__main__":
    parser=argparse.ArgumentParser(); parser.add_argument("csv", help="Path to Healthcare Documentation Database.csv"); main(parser.parse_args().csv)
