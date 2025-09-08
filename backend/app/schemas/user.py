from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
import uuid

class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)
    
    @field_validator('first_name')
    @classmethod
    def validate_first_name(cls, v):
        if v is not None and not v.strip():
            raise ValueError('First name cannot be empty')
        return v.strip() if v else None
    
    @field_validator('last_name')
    @classmethod
    def validate_last_name(cls, v):
        return v.strip() if v else None
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        return v.lower().strip()

class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    email: Optional[str] = None