# nasacso-webapp

This is a Web Application for NASA Community Science Observations.

The main website can be found [here](http://communitysnowobs.org).

## Running development

1. Install backend conda environment
   ```
   cd src/csoapi
   conda install -c conda-forge -n cso --file requirements.txt --file requirements-dev.txt
   ```
2. Run backend server
   ```
   python manage.py runserver
   ```
3. Install frontend environment
   ```
   cd src/csoapp
   npm install
   ```
4. Run frontend server
   ```
   npm start
   ```
6. Go to http://127.0.0.1:8000/