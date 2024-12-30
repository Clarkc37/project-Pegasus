library(pacman)
p_load(readr,
       stringr,
       pandoc,
       knitr)

Sys.setenv(RSTUDIO_PANDOC="/Applications/RStudio.app/Contents/Resources/app/quarto/bin/tools/aarch64")

raceinfobox <- function(race_name,
                        course,
                        race_type,
                        conditions,
                        going,
                        distance,
                        no_runners,
                        prize_money){
  
  #read in the html template
  tmplate <- read_lines('/Users/colinclarke/Library/CloudStorage/GoogleDrive-colin.clarke137@gmail.com/My Drive/R Projects/project-Pegasus/project-Pegasus/Rmd_templates/race info template.txt')
  
  #replace placeholders with variables
  tmplate <- tmplate %>% str_replace_all("race_name_placeholder",race_name)
  tmplate <- tmplate %>% str_replace_all("course_placeholder",course)
  tmplate <- tmplate %>% str_replace_all("race_type_placeholder",race_type)
  tmplate <- tmplate %>% str_replace_all("conditions_placeholder",conditions)
  tmplate <- tmplate %>% str_replace_all("going_placeholder",going)
  tmplate <- tmplate %>% str_replace_all("distance_placeholder",distance)
  tmplate <- tmplate %>% str_replace_all("no_runners_placeholder",no_runners )
  tmplate <- tmplate %>% str_replace_all("prize_money_placeholder",prize_money)
  
  return(tmplate)
  
}


dir.tidyup <- function(){
  
  #create directory with todays date.
  dir.create(paste('./content/racecards/',race.date,sep = ""))
  
  todays.old.files <- list.files("./content/racecards/today",full.names = T,
                                 recursive = T)
  todays.old.files <- todays.old.files[!todays.old.files=="./content/racecards/today/_index.md" ]
  old.courses <- todays.old.files %>% str_split_i('/',-2) %>% unique()
  todays.old.folders <- list.files("./content/racecards/today",full.names = T) 
  todays.old.folders <- todays.old.folders[todays.old.folders %>% str_split_i('/',-1) %in% old.courses]
  yesterdays.folders <- todays.old.folders %>% str_replace_all('today','yesterday')
  
  for(dir.path in yesterdays.folders){
    if (!dir.exists(dir.path)) {
      # Create directory if it doesn't exist
      dir.create(dir.path, recursive = TRUE)
      cat("Directory created:", dir.path, "\n")
    }
  }
  
  file.copy(from=todays.old.folders,to='./content/racecards/yesterday',recursive = T)
  file.remove(todays.old.files)
  
  #tmpath <- paste(getwd(),'/content/racecards/today',sep = "")
  #dir.create(tmpath)
  
}

copyToDated <- function(){
  todays.old.files <- list.files("./content/racecards/today",full.names = T,
                                 recursive = T)
  
  old.courses <- todays.old.files %>% str_split_i('/',-2) %>% unique()
  todays.old.folders <- list.files("./content/racecards/today",full.names = T) 
  todays.old.folders <- todays.old.folders[todays.old.folders %>% str_split_i('/',-1) %in% old.courses]
  
  dated.dir <- paste('./content/racecards/',race.date,"/",sep = "")

  file.copy(from=todays.old.folders,to=dated.dir,recursive=T)
  file.copy(from='./content/racecards/today/_index.md',to=dated.dir)
  
}


update_git <- function(commit_message){
# Git commands
git_add <- "git add ."
git_commit <- paste("git commit -m", shQuote(commit_message))
git_push <- "git push"


git_username <- 'git config --global user.name "Clarkc37"'
git_useremail <- 'git config --global user.email "colin.clarke137@gmail.com"'
system(git_username, intern = TRUE)
system(git_useremail,intern=T)

# Execute Git commands
system(git_add, intern = TRUE)
system(git_commit, intern = TRUE)
system(git_push, intern = TRUE)

cat("Files added, committed, and pushed successfully.\n")
}







