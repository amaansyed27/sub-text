taskkill /F /IM python.exe /IM uvicorn.exe

cd sub-text/backend 

 .\venv\Scripts\Activate.ps1

 uvicorn main:app


 cd sub-text/frontend

 npm run dev