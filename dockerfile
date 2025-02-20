# Use the official LibreTranslate Docker image
FROM libretranslate/libretranslate:latest

# Expose the port (LibreTranslate runs on 5000 by default)
EXPOSE 5000

# Start the service
CMD ["./entrypoint.sh"]