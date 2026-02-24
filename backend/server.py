from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# Booking Models
class BookingCreate(BaseModel):
    table_id: int
    table_seats: int
    date: str
    time: str
    name: str
    phone: str
    email: Optional[str] = None
    guests: int

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    table_id: int
    table_seats: int
    date: str
    time: str
    name: str
    phone: str
    email: Optional[str] = None
    guests: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "confirmed"


def send_booking_email(booking: Booking):
    """Send booking confirmation email to restaurant"""
    try:
        restaurant_email = "thecaribhut@gmail.com"
        
        # Create email content
        subject = f"Ny bokning - Bord {booking.table_id} - {booking.date} kl {booking.time}"
        
        body = f"""
Ny bokning hos Carib Hut!

BOKNINGSDETALJER:
-----------------
Boknings-ID: {booking.id}
Datum: {booking.date}
Tid: {booking.time}

BORD:
Bord nummer: {booking.table_id}
Antal platser: {booking.table_seats}
Antal gäster: {booking.guests}

GÄSTINFORMATION:
Namn: {booking.name}
Telefon: {booking.phone}
E-post: {booking.email or 'Ej angiven'}

-----------------
Bokad: {booking.created_at.strftime('%Y-%m-%d %H:%M')}

Med vänliga hälsningar,
Carib Hut Bokningssystem
        """
        
        # Log the booking (email sending would require SMTP credentials)
        logger.info(f"Booking confirmation for {restaurant_email}:")
        logger.info(f"Subject: {subject}")
        logger.info(f"Body: {body}")
        
        # Note: To actually send emails, you would need SMTP credentials
        # For now, we log the email content and save to database
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Booking endpoints
@api_router.post("/bookings", response_model=Booking)
async def create_booking(input: BookingCreate):
    """Create a new table booking"""
    try:
        # Check if table is already booked for this date/time
        existing = await db.bookings.find_one({
            "table_id": input.table_id,
            "date": input.date,
            "time": input.time,
            "status": "confirmed"
        }, {"_id": 0})
        
        if existing:
            raise HTTPException(
                status_code=400, 
                detail="Bordet är redan bokat för denna tid. Välj en annan tid."
            )
        
        # Create booking object
        booking_dict = input.model_dump()
        booking_obj = Booking(**booking_dict)
        
        # Convert to dict for MongoDB
        doc = booking_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        # Save to database
        await db.bookings.insert_one(doc)
        
        # Send email notification
        send_booking_email(booking_obj)
        
        logger.info(f"New booking created: {booking_obj.id} for {booking_obj.name}")
        
        return booking_obj
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create booking: {e}")
        raise HTTPException(status_code=500, detail="Kunde inte skapa bokning. Försök igen.")


@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings(date: Optional[str] = None):
    """Get all bookings, optionally filtered by date"""
    query = {"status": "confirmed"}
    if date:
        query["date"] = date
    
    bookings = await db.bookings.find(query, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for booking in bookings:
        if isinstance(booking.get('created_at'), str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return bookings


@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    """Get a specific booking by ID"""
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    
    if not booking:
        raise HTTPException(status_code=404, detail="Bokning hittades inte")
    
    if isinstance(booking.get('created_at'), str):
        booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return booking


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()