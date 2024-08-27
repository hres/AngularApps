import os
import jinja2

def generate_from_jinja_template(template_dirs, template_file_name, output_dir, output_file_name, 
                                              **kwargs):
    # print("\nrunning 'generate_from_jinja_template'")
    # parameters = locals()
    # # Print each parameter with an indent
    # for key, value in parameters.items():
    #     print(f"\t {key}: {value}")
        
    try:
        # Set up the Jinja environment and load templates from all directories in template_dirs
        jinja_template_env = jinja2.Environment(loader=jinja2.FileSystemLoader(template_dirs))

        # Load the template
        template = jinja_template_env.get_template(template_file_name)
        
        # create the output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        output_file_path = os.path.join(output_dir, output_file_name)
        
        # Render the template with the provided data
        rendered_content = template.render(**kwargs)

        # Write the rendered content to the output file
        with open(output_file_path, 'w', encoding="utf-8") as output_file:
            output_file.write(rendered_content)
            
        return output_file_path
    
    except jinja2.TemplateNotFound as e:
        # Raise the exception to the caller
        raise TemplateNotFoundError(f"Template '{template_file_name}' not found. {e}")
    
    except Exception as e:
        # Raise the exception to the caller
        raise GenerationError(f"An unexpected error occurred. {e}")
    
# Define custom exceptions
class TemplateNotFoundError(Exception):
    pass


class GenerationError(Exception):
    pass    

