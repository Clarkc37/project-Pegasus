FROM racing-algo-base

RUN apt-get update && apt-get install -y pandoc pandoc-citeproc
RUN apt-get update && apt-get install -y git




WORKDIR '/projectPegasus/'

COPY . /projectPegasus/

#COPY ~/.ssh ~/.ssh

RUN R -e "library(pacman);p_load(readr,stringr,blogdown,kableExtra,dplyr,stringr,lubridate,httr,rmarkdown)"


#CMD cp "../Pegasus production/output/Todays_Prediction.rds" ./R_Scripts/Todays_Prediction.rds
#CMD echo "Todays prediction copied successfully"
#CMD pwd
#CMD git config --global --add safe.directory '/projectPegasus'
#CMD 'git pull'
CMD ["Rscript", "./R_Scripts/update website.r"]
#CMD ["git", "add 'content/racecards/'"]
#CMD ["git", "commit -m 'full test'"]
#CMD ["git", "push"]

#CMD ["bash"]