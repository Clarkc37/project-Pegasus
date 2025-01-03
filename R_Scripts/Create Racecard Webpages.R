library(dplyr)
library(stringr)
library(lubridate)
library(httr)

source('./R_Scripts/Racecard Webpages functions.R')
tmpath<- "/Users/colinclarke/Library/CloudStorage/GoogleDrive-colin.clarke137@gmail.com/My Drive/R Projects/project-Pegasus/project-Pegasus/content/racecards/today"

Todays.Prediction <- readRDS('./R_Scripts/Todays_Prediction.rds')
Todays.Prediction <- Todays.Prediction %>% mutate(JSR.css=case_when(Jockey.sr<.1~"cool",
                                                Jockey.sr>.2~"hot",
                                                T~"average"),
                                                TSR.css=case_when(Trainer.sr<.1~"cool",
                                                                  Trainer.sr>.2~"hot",
                                                                  T~"average"),
                                                Course=str_replace_all(Course," (IRE)",""))


race.date <- Todays.Prediction$url.silk[1]
race.date <- gsub("https://www.attheraces.com/images/silks/","",race.date) %>% substr(1,8) %>% as.Date('%Y%m%d')
race.date.formatted <- paste( wday(race.date,label = T , abbr = F) , format(race.date,"%d %B %Y"))
  
courses.vec <- Todays.Prediction %>% ungroup() %>% select(Course) %>% distinct() 
courses.vec <- courses.vec$Course

todays.prizemoney <- Todays.Prediction %>% ungroup() %>% select(Course,prizemoney) %>% mutate(prizemoney = as.numeric(gsub("[€£,]", "", prizemoney))) %>% unique() %>% group_by(Course) %>% summarise(total.prizemoney=sum(prizemoney))
valuable.racecard <- todays.prizemoney %>% filter(total.prizemoney==max(total.prizemoney))

# list of files to be combined
racecard.elements <- c("./Rmd_templates/racecard header.Rmd","./Rmd_templates/racecard body.Rmd")

# read the files & combine into a single character vector
theRacecard <- unlist(lapply(racecard.elements,readLines))

#create the file directories
dir.tidyup()

url.course.base <- "https://www.attheraces.com/images/course-guides/course_placeholder/course_placeholderjt.png"
headers.base <- c(
  "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0",
  "Accept" = "image/avif,image/webp,*/*",
  "Accept-Language" = "en-US,en;q=0.5",
  "Accept-Encoding" = "gzip, deflate, br",
  "Connection" = "keep-alive",
  "Referer" = "https://www.attheraces.com/course-guides/course_placeholder",
  "Sec-Fetch-Dest" = "image",
  "Sec-Fetch-Mode" = "no-cors",
  "Sec-Fetch-Site" = "same-origin",
  "Pragma" = "no-cache",
  "Cache-Control" = "no-cache"
)



for(course in courses.vec){
  courseRacecard <- gsub("Title_Placeholder",paste(course,race.date),theRacecard)
  courseRacecard <- gsub("Course_Placeholder",course,courseRacecard)
  courseRacecard <- gsub("Date_Placeholder",race.date,courseRacecard)
  courseRacecard <- gsub("Dateformatted",race.date.formatted,courseRacecard)
  courseRacecard <- gsub("featured_placeholder",if(course==valuable.racecard$Course){"true"}else{"false"},courseRacecard)
  
  
  
  courselogo <- gsub("\\s*\\(.*\\)$", "", course)
  courselogo <- courselogo %>% str_to_lower() %>% str_replace(' ','')
  
  url.course <- url.course.base %>% str_replace_all("course_placeholder",courselogo)
  headers <- headers.base %>% str_replace_all("course_placeholder",courselogo)
    
  if(dir.exists(paste(tmpath,course,sep = "/"))==FALSE){
    
    dir.create(paste(tmpath,course,sep = "/"))
  }
  
  
  filename <- paste(tmpath,course,"course.png",sep = "/")
  
  response <- GET(url.course, add_headers(headers))
  content(response, "raw") |> writeBin(filename, "wb")
  writeLines(courseRacecard,paste(tmpath,course,'index.Rmd',sep = "/"))
  
 
   rmarkdown::render(input=paste(tmpath,course,'index.Rmd',sep = "/"),
              output_file =  paste(tmpath,course,'index.html',sep = "/"),
              envir = parent.frame()
              )

   
}

source("./R_Scripts/Fix Markdown Files.R")

copyToDated()



