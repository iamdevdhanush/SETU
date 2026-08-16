from datetime import date

from pydantic import BaseModel, ConfigDict


class AssetBase(BaseModel):
    asset_id: str
    asset_type: str
    usage_hours: float = 0.0
    last_overhaul_date: date | None = None
    status: str = "Healthy"


class AssetCreate(AssetBase):
    pass


class AssetRead(AssetBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class OverhaulForecast(BaseModel):
    asset_id: str
    next_overhaul_date: date
    confidence: float
    method: str
