library(pacman)
p_load(dplyr,jsonlite,tidyr,stringr
)

files.to.fix <- list.files(path = "./content/racecards/today",recursive = T, full.names=T,pattern=".md")
for (fname in files.to.fix){
  tmpfile <- read_lines(file = fname)
  tmpfile <- tmpfile %>% str_replace_all("&gt;",">") %>% str_replace_all("&lt;","<")
  write_lines(tmpfile,fname)
}