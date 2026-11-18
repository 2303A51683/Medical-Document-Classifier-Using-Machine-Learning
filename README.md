# MedClassify — Medical Document Classifier

A deployable clinical-document classification dashboard and a reproducible NLP training pipeline. It is designed to organize documents by medical specialty, never to diagnose or guide care.

## Live demo

The GitHub Pages site provides an in-browser, privacy-friendly demonstration. It uses transparent term matching and must be treated as a UI prototype, not a validated clinical model.

## Train the documented ML experiment

1. Place `Healthcare Documentation Database.csv` anywhere locally (it is intentionally not committed because it may contain sensitive content).
2. Install dependencies: `pip install -r requirements.txt`
3. Run: `python train.py "path/to/Healthcare Documentation Database.csv"`

The script builds TF-IDF (up to 25,000 unigrams/bigrams, `min_df=2`) from `description`, `keywords`, and `cleaned_transcription`, then evaluates Multinomial Naive Bayes and class-balanced Logistic Regression with an 80/20 stratified split (`random_state=42`). It writes measured results to `metrics.json`—no performance claims are hard-coded.

## Results from the supplied archive

The archive contained **3,813 records**, **39 specialties**, seven columns, and no missing values in the four model fields. With the documented settings, the held-out test results were:

| Model | Accuracy | Macro F1 | Weighted F1 |
| --- | ---: | ---: | ---: |
| Multinomial Naive Bayes | 33.81% | 5.41% | 23.08% |
| Class-balanced Logistic Regression | 38.53% | 36.26% | 32.92% |

These results reflect pronounced class imbalance and should be evaluated per specialty before practical use.

## Deploy

Pushing `main` triggers the included GitHub Pages workflow. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions** once, if needed.
