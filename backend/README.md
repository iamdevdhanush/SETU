# SETU Sustain — Backend

REST API for the SETU Sustain forecasting tool, plus a machine learning
service that is kept strictly separate from the web layer.

## Structure

```
backend/
├── app/          # FastAPI application (HTTP layer)
│   ├── api/      #   route handlers
│   ├── core/     #   configuration
│   ├── db/       #   SQLAlchemy engine, session, Base
│   ├── models/   #   ORM models
│   ├── schemas/  #   Pydantic request/response models
│   └── main.py   #   app entrypoint
├── ml/           # ML service (models, training, inference)
│   ├── predictor.py  # scikit-learn/XGBoost models
│   └── service.py    # facade used by the API layer
├── requirements.txt
└── .env.example
```

## Getting started

1. Create a virtual environment and install dependencies:

   ```sh
   python -m venv .venv
   .venv\Scripts\activate        # Windows
   pip install -r requirements.txt
   ```

2. Configure the environment:

   ```sh
   cp .env.example .env
   ```

3. Start a PostgreSQL database and set `DATABASE_URL` in `.env`.

4. Run the API (auto-reloads on change):

   ```sh
   uvicorn app.main:app --reload
   ```

5. Open the interactive docs at <http://localhost:8000/docs>.

## API layout

The `app/` layer owns HTTP concerns only. Endpoints delegate forecasting
work to `ml.service`, which in turn uses the models in `ml.predictor`.
Nothing under `app/` knows about model internals, and nothing under `ml/`
imports the web framework, so the ML service can be trained, versioned and
deployed independently.
