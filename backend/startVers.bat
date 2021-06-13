for /F "tokens=2" %%a in ('"nslookup WTSGLVSE081221D.apa.gad.schneider-electric.com" ^') do set Address=%%a
start chrome "http://%Address%/vers"