# Use the official LibreTranslate image as the base
FROM libretranslate/libretranslate:latest

# Render provides a dynamic port via the $PORT environment variable.
# We'll expose that port (defaulting to 5000 if not provided).
EXPOSE ${PORT:-5000}

# Start LibreTranslate, binding to all interfaces and using the provided PORT.
# The shell form here lets us use environment variable substitution.
CMD sh -c 'libretranslate --host 0.0.0.0 --port ${PORT:-5000}'