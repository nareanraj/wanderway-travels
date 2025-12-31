@echo off
echo Setting up WanderWay Travels...
echo.

REM Create necessary directories
if not exist database mkdir database
if not exist backend\static\uploads mkdir backend\static\uploads

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Create virtual environment if not exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install flask flask-cors flask-sqlalchemy python-dotenv email-validator pillow >nul 2>&1

REM Run the application
echo Starting WanderWay Travels...
echo.
echo Opening browser to: http://localhost:5000
echo.
start http://localhost:5000
python main.py

pause