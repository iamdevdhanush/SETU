from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.asset import Asset
from app.schemas.asset import AssetCreate, AssetRead

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("", response_model=list[AssetRead])
def list_assets(db: Session = Depends(get_db)) -> list[Asset]:
    return db.query(Asset).order_by(Asset.asset_id).all()


@router.post("", response_model=AssetRead, status_code=status.HTTP_201_CREATED)
def create_asset(payload: AssetCreate, db: Session = Depends(get_db)) -> Asset:
    existing = db.query(Asset).filter(Asset.asset_id == payload.asset_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="asset already exists")
    asset = Asset(**payload.model_dump())
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


@router.get("/{asset_id}", response_model=AssetRead)
def get_asset(asset_id: str, db: Session = Depends(get_db)) -> Asset:
    asset = db.query(Asset).filter(Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="asset not found")
    return asset
