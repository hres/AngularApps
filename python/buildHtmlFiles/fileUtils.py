import os, zipfile
import shutil
     
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
                