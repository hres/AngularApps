import os, zipfile
import shutil
from fnmatch import fnmatch
     
def delete_folder(folder_path):
    """
    Delete a folder and all its contents.

    Args:
        folder_path (str): Path to the folder to be deleted.
    """
    try:
        shutil.rmtree(folder_path)
        return True
    except OSError as e:
        print(f"\nError: {folder_path} - {e.strerror}")
        return False
                
                
def move_files(root_folder, file_path, file_pattern, destination_folder):
    source_dir = os.path.join(root_folder, file_path)
    dest_dir = os.path.join(root_folder, destination_folder)
    
    if not os.path.exists(source_dir):
        print(f"Source directory does not exist: {source_dir}")
        return
    
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
    
    files = [f for f in os.listdir(source_dir) if fnmatch(f, file_pattern)]
    
    if not files:
        print(f"No files matching the pattern '{file_pattern}' found in {source_dir}")
        return
    
    print(f"Found {len(files)} file(s):")
    for file in files:
        print(f" - {file}")
        src_file = os.path.join(source_dir, file)
        dest_file = os.path.join(dest_dir, file)
        shutil.move(src_file, dest_file)
    
    print(f"Files moved successfully to {dest_dir}.")                
    

def move_folder_contents(source_folder, destination_folder):
    """
    Moves a folder's content to a new place

    Args:
        source_folder (str): absolute path of the source folder
        destination_folder (str): absolute path of the destination folder
    """        
    try:
        # Ensure the destination folder exists
        if not os.path.exists(destination_folder):
            os.makedirs(destination_folder)

        # Iterate over all the files and directories in the source folder
        for item in os.listdir(source_folder):
            src_path = os.path.join(source_folder, item)
            dest_path = os.path.join(destination_folder, item)

            # Move each item to the destination folder
            shutil.move(src_path, dest_path)

        print(f"\n Contents of '{source_folder}' moved to '{destination_folder}' successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")        


def delete_file(file_path):
    """
    Delete the file at the given path

    Args:
        file_path (str): absolute path of the file
    """       
    try:
        # Check if the file exists
        if os.path.isfile(file_path):
            os.remove(file_path)
            print(f"File '{file_path}' has been deleted successfully.")
        else:
            print(f"File '{file_path}' does not exist.")
    except Exception as e:
        print(f"An error occurred while trying to delete the file: {e}")        

        
def delete_files_with_extension(folder_path, file_extension):
    """
    Delete all files with a specified extension in a given folder

    Args:
        folder_path (str): absolute path of the folder
        file_extension (str): eg. ".txt", ".csv"
    """    
    try:
        # Ensure the folder exists
        if not os.path.isdir(folder_path):
            print(f"Folder '{folder_path}' does not exist.")
            return

        # Loop through the files in the folder
        for filename in os.listdir(folder_path):
            # Construct the full file path
            file_path = os.path.join(folder_path, filename)

            # Check if the file has the specified extension
            if os.path.isfile(file_path) and filename.endswith(file_extension):
                os.remove(file_path)
                print(f"Deleted: {file_path}")

        print(f"All files with extension '{file_extension}' in '{folder_path}' have been deleted.")

    except Exception as e:
        print(f"An error occurred: {e}")        