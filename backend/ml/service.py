"""High-level ML service facade.

Routes call this module instead of talking to models directly, keeping the
API layer thin and the ML internals swappable.
"""

from __future__ import annotations

from datetime import date

from ml.predictor import EnsemblePredictor

predictor = EnsemblePredictor()


def forecast_overhaul(
    asset_id: str,
    usage_hours: float,
    last_overhaul_date: date,
    method: str = "ensemble-random-forest",
) -> dict:
    next_overhaul, interval, confidence = predictor.predict_overhaul_date(
        usage_hours, last_overhaul_date
    )
    predictor.record(interval)
    return {
        "asset_id": asset_id,
        "next_overhaul_date": next_overhaul,
        "confidence": round(confidence, 3),
        "method": method,
    }
