FROM racing-algo-base

RUN apt-get update && apt-get install -y pandoc pandoc-citeproc
RUN apt-get update && apt-get install -y git


WORKDIR '/projectPegasus/'

COPY . /projectPegasus/

RUN Rscript './R_Scripts/packages_installer.r'


#CMD cp "../Pegasus production/output/Todays_Prediction.rds" ./R_Scripts/Todays_Prediction.rds
#CMD echo "Todays prediction copied successfully"
#CMD pwd
CMD git config --global --add safe.directory '/projectPegasus'
CMD ["Rscript", "./R_Scripts/update website.r"]