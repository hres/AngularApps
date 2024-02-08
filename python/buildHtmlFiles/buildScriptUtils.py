def generate_from_jinja_template(template_env, template_name, output_file_path, **kwargs):
    """
    Generate a file from a Jinja2 template.

    Args:
        template_env (jinja2.Environment): Jinja2 environment.
        template_name (str): Name of the template file.
        output_file_path (str): Path to the output file.
        **kwargs: Additional keyword arguments to pass to the template.
    """
    # Load the template
    template = template_env.get_template(template_name)
    
    # Render the template with the provided data
    rendered_content = template.render(**kwargs)

    # Write the rendered content to the output file
    with open(output_file_path, 'w', encoding="utf-8") as output_file:
        output_file.write(rendered_content)

def camel_case(input_string):
    # Split the string by periods and capitalize each part
    parts = input_string.split('.')
    parts = [part.capitalize() for part in parts]
    # Join the parts together
    output_string = ''.join(parts)
    return output_string
