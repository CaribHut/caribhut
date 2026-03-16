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


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# FastAPI app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Booking settings
BOOKING_BLOCK_MINUTES = 120  # 2 timmar mellan bokningar på samma bord


# ---------- Helpers ----------

def parse_booking_datetime(date_str: str, time_str: str) -> datetime:
    """
    Parse booking datetime from:
    date: YYYY-MM-DD
    time: HH:MM
    """
    try:
        return datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    except ValueError:
        raise HTTPException(status_code=400, detail="Ogiltigt datum eller tid.")


async def get_booked_table_ids_for_slot(date: str, time: str) -> List[int]:
    """
    Return all table IDs that should be considered unavailable
    for the requested date/time.
    """
    requested_dt = parse_booking_datetime(date, time)

    bookings = await db.bookings.find(
        {"status": "confirmed"},
        {"_id": 0, "table_id": 1, "date": 1, "time": 1}
    ).to_list(5000)

    booked_table_ids = []

    for booking in bookings:
        try:
            existing_dt = parse_booking_datetime(booking["date"], booking["time"])
            diff_minutes = abs((existing_dt - requested_dt).total_seconds()) / 60

            if diff_minutes < BOOKING_BLOCK_MINUTES:
                booked_table_ids.append(booking["table_id"])
        except Exception:
            continue

    return sorted(list(set(booked_table_ids)))


def serialize_datetime_fields(doc: dict) -> dict:
    """
    Convert datetime fields to ISO strings before Mongo insert.
    """
    serialized = dict(doc)
    if isinstance(serialized.get("created_at"), datetime):
        serialized["created_at"] = serialized["created_at"].isoformat()
    if isinstance(serialized.get("timestamp"), datetime):
        serialized["timestamp"] = serialized["timestamp"].isoformat()
    return serialized


def deserialize_datetime_fields(doc: dict) -> dict:
    """
    Convert ISO strings back to datetime objects for response models.
    """
    parsed = dict(doc)
    if isinstance(parsed.get("created_at"), str):
        parsed["created_at"] = datetime.fromisoformat(parsed["created_at"])
    if isinstance(parsed.get("timestamp"), str):
        parsed["timestamp"] = datetime.fromisoformat(parsed["timestamp"])
    return parsed


def send_booking_email(booking: "Booking") -> bool:
    """
    Log booking email content.
    Replace with real SMTP later if needed.
    """
    try:
        restaurant_email = "thecaribhut@gmail.com"

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
Zon: {booking.table_zone or 'Ej angiven'}
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

        logger.info(f"Booking confirmation for {restaurant_email}:")
        logger.info(f"Subject: {subject}")
        logger.info(f"Body: {body}")

        return True

    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False


# ---------- Models ----------

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class BookingCreate(BaseModel):
    table_id: int
    table_seats: int
    table_zone: Optional[str] = None
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
    table_zone: Optional[str] = None
    date: str
    time: str
    name: str
    phone: str
    email: Optional[str] = None
    guests: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "confirmed"


class AvailabilityResponse(BaseModel):
    bookedTableIds: List[int]


# ---------- Routes ----------

@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    await db.status_checks.insert_one(serialize_datetime_fields(status_obj.model_dump()))
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    return [StatusCheck(**deserialize_datetime_fields(check)) for check in status_checks]


# ---------- Booking endpoints ----------

@api_router.get("/bookings/availability", response_model=AvailabilityResponse)
async def get_booking_availability(date: str, time: str):
    """
    Return booked table IDs for a selected date/time.
    Frontend uses this to disable unavailable tables.
    """
    try:
        requested_dt = parse_booking_datetime(date, time)

        bookings = await db.bookings.find(
            {"status": "confirmed"},
            {"_id": 0, "table_id": 1, "date": 1, "time": 1}
        ).to_list(5000)

        booked_table_ids = []

        for booking in bookings:
            try:
                existing_dt = parse_booking_datetime(booking["date"], booking["time"])
                diff_minutes = abs((existing_dt - requested_dt).total_seconds()) / 60

                if diff_minutes < BOOKING_BLOCK_MINUTES:
                    booked_table_ids.append(booking["table_id"])
            except Exception:
                continue

        return {"bookedTableIds": sorted(list(set(booked_table_ids)))}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get booking availability: {e}")
        raise HTTPException(status_code=500, detail="Kunde inte hämta tillgänglighet.")


@api_router.post("/bookings", response_model=Booking)
async def create_booking(input: BookingCreate):
    """
    Create a new table booking.
    Stops duplicate/overlapping bookings for the same table.
    """
    try:
        requested_dt = parse_booking_datetime(input.date, input.time)

        logger.info(
            f"Checking booking conflict for table {input.table_id} on {input.date} at {input.time}"
        )

        existing_bookings = await db.bookings.find(
            {
                "table_id": input.table_id,
                "status": "confirmed",
            },
            {"_id": 0, "table_id": 1, "date": 1, "time": 1}
        ).to_list(1000)

        for existing in existing_bookings:
            try:
                existing_dt = parse_booking_datetime(existing["date"], existing["time"])
                diff_minutes = abs((existing_dt - requested_dt).total_seconds()) / 60

                if diff_minutes < BOOKING_BLOCK_MINUTES:
                    logger.info(
                        f"Conflict found for table {input.table_id}. Existing booking: {existing['date']} {existing['time']}"
                    )
                    raise HTTPException(
                        status_code=409,
                        detail="Bordet är redan bokat eller upptaget nära denna tid. Välj ett annat bord eller en annan tid."
                    )
            except HTTPException:
                raise
            except Exception:
                continue

        booking_obj = Booking(**input.model_dump())
        await db.bookings.insert_one(serialize_datetime_fields(booking_obj.model_dump()))

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
    query = {"status": "confirmed"}
    if date:
        query["date"] = date

    bookings = await db.bookings.find(query, {"_id": 0}).to_list(1000)
    return [Booking(**deserialize_datetime_fields(booking)) for booking in bookings]


@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})

    if not booking:
        raise HTTPException(status_code=404, detail="Bokning hittades inte")

    return Booking(**deserialize_datetime_fields(booking))


# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
