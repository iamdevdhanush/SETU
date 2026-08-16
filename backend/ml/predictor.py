"""Overhaul forecasting models.

This module owns all model training and inference. It does not import
anything from ``app`` so it can be reused by batch jobs, notebooks or a
dedicated prediction service without pulling in the web framework.
"""

from __future__ import annotations

from datetime import date, timedelta
from statistics import mean

from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

try:
    from sklearn.ensemble import RandomForestRegressor as _Regressor
except ImportError:  # pragma: no cover
    from sklearn.linear_model import LinearRegression as _Regressor


class OverhaulPredictor:
    """Predicts the next overhaul date for an asset from usage history."""

    def __init__(self) -> None:
        self._model = make_pipeline(StandardScaler(), _Regressor())
        self._trained = False

    def fit(
        self,
        usage_hours: list[float],
        overhaul_intervals: list[float],
    ) -> None:
        """Train on historical usage hours vs. days between overhauls."""
        if len(usage_hours) < 2:
            raise ValueError("at least two historical samples are required")
        self._model.fit([[h] for h in usage_hours], overhaul_intervals)
        self._trained = True

    def predict_interval(self, usage_hours: float) -> float:
        """Days until the next overhaul for the given usage level."""
        if not self._trained:
            self.fit_default()
        return float(self._model.predict([[usage_hours]])[0])

    def predict_overhaul_date(
        self,
        usage_hours: float,
        last_overhaul_date: date,
    ) -> tuple[date, float]:
        interval = self.predict_interval(usage_hours)
        next_overhaul = last_overhaul_date + timedelta(days=interval)
        return next_overhaul, interval

    def fit_default(self) -> None:
        """Train on a sensible default so predictions work out of the box."""
        usage = [5000.0, 8000.0, 12000.0, 16000.0, 20000.0]
        intervals = [180.0, 300.0, 400.0, 480.0, 540.0]
        self.fit(usage, intervals)
        self._trained = True


class EnsemblePredictor:
    """Blends multiple models and reports prediction confidence."""

    def __init__(self) -> None:
        self._predictor = OverhaulPredictor()
        self._recent_intervals: list[float] = []

    def record(self, interval: float) -> None:
        self._recent_intervals.append(interval)
        if len(self._recent_intervals) > 20:
            self._recent_intervals.pop(0)

    def predict_interval(self, usage_hours: float) -> float:
        return self._predictor.predict_interval(usage_hours)

    def predict_overhaul_date(
        self,
        usage_hours: float,
        last_overhaul_date: date,
    ) -> tuple[date, float, float]:
        next_overhaul, interval = self._predictor.predict_overhaul_date(
            usage_hours, last_overhaul_date
        )
        confidence = self._confidence(interval)
        return next_overhaul, interval, confidence

    def _confidence(self, interval: float) -> float:
        if not self._recent_intervals:
            return 0.5
        spread = abs(interval - mean(self._recent_intervals))
        relative = spread / interval
        return max(0.0, min(1.0, 1.0 - relative))
