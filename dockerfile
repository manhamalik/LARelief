# Use the official LibreTranslate image
FROM libretranslate/libretranslate

# Expose the necessary port (5000 inside the container, 5050 on your host machine)
EXPOSE 5000

# Start the LibreTranslate service
CMD ["./venv/bin/libretranslate", "--host", "0.0.0.0"]