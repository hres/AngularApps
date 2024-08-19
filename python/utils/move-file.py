import fileUtils as fileUtils;
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Move files from one directory to another based on a pattern.')
    parser.add_argument('--root_folder', type=str, help='The root folder path')
    parser.add_argument('--source_relative_path', type=str, help='The relative path to the folder containing the files')
    parser.add_argument('--filename_pattern', type=str, help='The file pattern (e.g., "hpfb-*.tgz")')
    parser.add_argument('--destination_relative_path', type=str, help='The relative path to the destination folder')

    args = parser.parse_args()

    root_folder = args.root_folder or input("Enter the root folder path: ").strip()
    file_path = args.source_relative_path or input("Enter the relative path to the folder containing the files: ").strip()
    filename_pattern = args.filename_pattern or input("Enter the file pattern (e.g., 'hpfb-*.tgz'): ").strip()
    destination_relative_path = args.destination_relative_path or input("Enter the relative path to the destination folder: ").strip()
    
    
    fileUtils.move_files(root_folder, file_path, filename_pattern, destination_relative_path)