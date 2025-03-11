library(pacman)
p_load(dplyr,
       knitr)

update_static_jsons <- function(source_dir, target_dir="./static/racecards") {
    # Get list of files in source directory
    source_files <- list.files(source_dir, full.names = TRUE)
    
    # Get corresponding target file paths
    target_files <- file.path(target_dir, basename(source_files))
    
    # Identify missing files (completely new files)
    missing_files <- source_files[!file.exists(target_files)]
    
    # Identify files that exist in both but are newer in the source directory
    existing_target_files <- target_files[file.exists(target_files)]
    existing_source_files <- source_files[file.exists(target_files)]
    
    # Get modification times
    source_times <- file.info(existing_source_files)$mtime
    target_times <- file.info(existing_target_files)$mtime
    
    # Find newer files
    newer_files <- existing_source_files[source_times > target_times]
    
    # Combine new and newer files
    files_to_copy <- c(missing_files, newer_files)
    
    # Copy the files to the target directory
    if (length(files_to_copy) > 0) {
      file.copy(files_to_copy, target_dir, overwrite = TRUE)
      message("Copied ", length(files_to_copy), " files to ", target_dir)
    } else {
      message("No new or updated files to copy.")
    }
  }
















