from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.asset import Asset
from app.schemas.asset import OverhaulForecast
from ml.service import forecast_overhaul

router = APIRouter(prefix="/forecasts", tags=["forecasts"])


@router.get("/assets/{asset_id}", response_model=OverhaulForecast)
def forecast_for_asset(asset_id: str, db: Session = Depends(get_db)) -> dict:
    asset = db.query(Asset).filter(Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="asset not found")
    if asset.last_overhaul_date is None:
        raise HTTPException(status_code=422, detail="asset has no overhaul history")

    return forecast_overhaul(
        asset_id=asset.asset_id,
        usage_hours=asset.usage_hours,
        last_overhaul_date=asset.last_overhaul_date,
    )
