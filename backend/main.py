from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="Hoyoverse Codes Hub API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    message: str

class GameCode(BaseModel):
    code: str
    game: str
    reward: str
    expires: Optional[str] = None
    active: bool = True

class RedeemRequest(BaseModel):
    code: str
    game: str

class RedeemResponse(BaseModel):
    success: bool
    message: str

# Mock data
MOCK_CODES = [
    GameCode(
        code="GENSHINGIFT",
        game="Genshin Impact",
        reward="100 Primogems, 10 Mystic Enhancement Ore",
        expires="2025-12-31",
        active=True
    ),
    GameCode(
        code="STARRAILGIFT",
        game="Honkai: Star Rail",
        reward="50 Stellar Jade, 5 Traveler's Guide",
        expires="2025-12-31",
        active=True
    ),
    GameCode(
        code="IMPACTCODE123",
        game="Genshin Impact",
        reward="60 Primogems, 5 Hero's Wit",
        expires="2025-11-30",
        active=True
    ),
]

# Endpoints
@app.get("/")
async def root():
    return {"message": "Hoyoverse Codes Hub API", "version": "1.0.0"}

@app.post("/api/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Mock login endpoint - accepts any credentials"""
    if request.username and request.password:
        return LoginResponse(
            success=True,
            token="mock-token-12345",
            message="Login successful"
        )
    raise HTTPException(status_code=400, detail="Invalid credentials")

@app.get("/api/codes", response_model=List[GameCode])
async def get_codes(game: Optional[str] = None):
    """Get all active game codes, optionally filtered by game"""
    if game:
        return [code for code in MOCK_CODES if code.game.lower() == game.lower()]
    return MOCK_CODES

@app.post("/api/redeem", response_model=RedeemResponse)
async def redeem_code(request: RedeemRequest):
    """Mock code redemption endpoint"""
    code_exists = any(c.code == request.code for c in MOCK_CODES)
    
    if code_exists:
        return RedeemResponse(
            success=True,
            message=f"Code {request.code} redeemed successfully for {request.game}!"
        )
    
    return RedeemResponse(
        success=False,
        message=f"Code {request.code} not found or expired"
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
